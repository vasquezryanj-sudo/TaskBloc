import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── Helpers ──

function todayKey(tz: string): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = String(Number(parts.find((p) => p.type === "month")!.value) - 1);
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

function todayISO(tz: string): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

function yesterdayKey(tz: string): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = String(Number(parts.find((p) => p.type === "month")!.value) - 1);
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

async function getAccessTokenForUser(refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.access_token;
}

interface TimeBlock {
  start: number;
  end: number;
}

function parseMinutes(isoString: string, tz: string): number {
  const d = new Date(isoString);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(d);
  const h = Number(parts.find((p) => p.type === "hour")!.value);
  const m = Number(parts.find((p) => p.type === "minute")!.value);
  return h * 60 + m;
}

function findFreeGaps(busy: TimeBlock[], dayStart: number, dayEnd: number): TimeBlock[] {
  const sorted = [...busy].sort((a, b) => a.start - b.start);
  const merged: TimeBlock[] = [];
  for (const b of sorted) {
    const clamped = { start: Math.max(b.start, dayStart), end: Math.min(b.end, dayEnd) };
    if (clamped.start >= clamped.end) continue;
    if (merged.length > 0 && clamped.start <= merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, clamped.end);
    } else {
      merged.push({ ...clamped });
    }
  }
  const gaps: TimeBlock[] = [];
  let cursor = dayStart;
  for (const b of merged) {
    if (cursor < b.start) gaps.push({ start: cursor, end: b.start });
    cursor = Math.max(cursor, b.end);
  }
  if (cursor < dayEnd) gaps.push({ start: cursor, end: dayEnd });
  return gaps;
}

function minutesToISO(dateStr: string, minutes: number, _tz: string): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${dateStr}T${h}:${m}:00`;
}

function timeToMins(est: string): number {
  const map: Record<string, number> = { "<5m": 5, "5m": 5, "10m": 10, "15m": 15, "30m": 30, "1hr": 60, "1.5hr": 90, "2hr": 120 };
  if (map[est] !== undefined) return map[est];
  const n = parseInt(est, 10);
  return isNaN(n) || n <= 0 ? 30 : n;
}

// ── Schedule tasks for a single user ──

async function scheduleForUser(
  userId: string,
  accessToken: string,
  dayKey: string,
  dateStr: string,
  tz: string,
  dayStart: number,
  dayEnd: number,
): Promise<{ scheduled: string[]; error?: string }> {
  const DAY_START = dayStart;
  const DAY_END = dayEnd;

  // Fetch user's incomplete tasks for today
  const { data: tasks, error: taskErr } = await sb
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("day_key", dayKey)
    .eq("complete", false)
    .order("position", { ascending: true });

  if (taskErr) throw taskErr;
  if (!tasks || tasks.length === 0) return { scheduled: [] };

  // Fetch today's calendar events in scheduling window
  const startH = String(Math.floor(DAY_START / 60)).padStart(2, "0");
  const startM = String(DAY_START % 60).padStart(2, "0");
  const endH = String(Math.floor(DAY_END / 60)).padStart(2, "0");
  const endM = String(DAY_END % 60).padStart(2, "0");
  const timeMin = `${dateStr}T${startH}:${startM}:00`;
  const timeMax = `${dateStr}T${endH}:${endM}:00`;
  const calParams = new URLSearchParams({
    timeMin: new Date(timeMin).toISOString(),
    timeMax: new Date(timeMax).toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    timeZone: tz,
  });
  const calRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${calParams}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!calRes.ok) throw new Error(`Calendar fetch failed: ${calRes.status}`);
  const calData = await calRes.json();

  // Build busy blocks
  const busy: TimeBlock[] = (calData.items || [])
    .filter((e: any) => e.start?.dateTime && e.end?.dateTime)
    .map((e: any) => ({
      start: parseMinutes(e.start.dateTime, tz),
      end: parseMinutes(e.end.dateTime, tz),
    }));

  const existingTitles = new Set(
    (calData.items || []).map((e: any) => e.summary?.trim().toLowerCase()),
  );

  const gaps = findFreeGaps(busy, DAY_START, DAY_END);

  let gapIdx = 0;
  let cursor = gaps.length > 0 ? gaps[0].start : DAY_START;
  const created: string[] = [];

  for (const task of tasks) {
    if (existingTitles.has(task.name?.trim().toLowerCase())) continue;

    const duration = task.estimate ? timeToMins(task.estimate) : 30;
    if (isNaN(duration) || duration <= 0) continue;

    while (gapIdx < gaps.length) {
      if (cursor + duration <= gaps[gapIdx].end) break;
      gapIdx++;
      if (gapIdx < gaps.length) cursor = gaps[gapIdx].start;
    }
    if (gapIdx >= gaps.length) break;

    const startTime = minutesToISO(dateStr, cursor, tz);
    const endTime = minutesToISO(dateStr, cursor + duration, tz);

    const descLines: string[] = [];
    if (task.status) descLines.push(`Status: ${task.status}`);
    if (task.due) descLines.push(`Due: ${task.due}`);
    if (task.estimate) descLines.push(`Estimate: ${task.estimate}`);
    if (task.tags && task.tags.length > 0) descLines.push(`Tags: ${task.tags.join(", ")}`);
    if (task.context) descLines.push(`Notes: ${task.context}`);
    if (task.attachments && task.attachments.length > 0)
      descLines.push(`Attachments: ${task.attachments.map((a: any) => a.name || a.url || a).join(", ")}`);
    descLines.push("", "Auto-scheduled by TaskBloc");

    const eventBody = {
      summary: task.name,
      description: descLines.join("\n"),
      colorId: "6",
      start: { dateTime: startTime, timeZone: tz },
      end: { dateTime: endTime, timeZone: tz },
    };

    const createRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
      },
    );
    if (!createRes.ok) {
      console.error(`[user=${userId}] Failed to create event for "${task.name}": ${createRes.status}`);
      continue;
    }

    created.push(task.name);
    cursor += duration;
  }

  return { scheduled: created };
}

// ── Main handler ──

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    const tz = "America/New_York";
    const dayKey = todayKey(tz);

    // ── Nightly rollover: move yesterday's incomplete tasks to today ──
    if (action === "rollover") {
      const yKey = yesterdayKey(tz);
      const { data: incompleteTasks, error: fetchErr } = await sb
        .from("tasks")
        .select("*")
        .eq("day_key", yKey)
        .eq("complete", false);

      if (fetchErr) throw fetchErr;
      if (!incompleteTasks || incompleteTasks.length === 0) {
        return new Response(JSON.stringify({ message: "No incomplete tasks to roll over", day_key: dayKey }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const { data: existingToday } = await sb.from("tasks").select("id").eq("day_key", dayKey);
      let pos = existingToday ? existingToday.length : 0;

      const rolledOver: string[] = [];
      for (const task of incompleteTasks) {
        const { error: updateErr } = await sb
          .from("tasks")
          .update({ day_key: dayKey, position: pos++ })
          .eq("id", task.id);
        if (updateErr) {
          console.error(`Failed to roll over "${task.name}":`, updateErr);
          continue;
        }
        rolledOver.push(task.name);
      }

      return new Response(
        JSON.stringify({ rolledOver: rolledOver.length, tasks: rolledOver, from: yKey, to: dayKey }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // ── Recurring task rollover ──
    const dateStr = todayISO(tz);
    const yKey = yesterdayKey(tz);
    const { data: recurringTasks } = await sb
      .from("tasks")
      .select("*")
      .eq("day_key", yKey)
      .eq("complete", true)
      .eq("recurring", true);

    const recurringCreated: string[] = [];
    if (recurringTasks && recurringTasks.length > 0) {
      const { data: existingToday } = await sb.from("tasks").select("id").eq("day_key", dayKey);
      let pos = existingToday ? existingToday.length : 0;
      for (const rt of recurringTasks) {
        const newTask = {
          id: crypto.randomUUID(),
          day_key: dayKey,
          name: rt.name,
          status: "",
          context: rt.context || "",
          complete: false,
          attachments: rt.attachments || [],
          tags: rt.tags || [],
          due: rt.due || "",
          estimate: rt.estimate || "",
          recurring: true,
          recurring_frequency: rt.recurring_frequency || "",
          position: pos++,
          user_id: rt.user_id,
        };
        await sb.from("tasks").insert(newTask);
        recurringCreated.push(rt.name);
      }
    }

    // ── Monday weekly reset ──
    const nowLocal = new Date().toLocaleString("en-US", { timeZone: tz });
    const localDate = new Date(nowLocal);
    if (localDate.getDay() === 1) {
      const { data: cleared, error: clearErr } = await sb
        .from("tasks")
        .delete()
        .eq("complete", true)
        .select("id");
      console.log(`[Monday reset] Deleted ${cleared?.length ?? 0} completed daily tasks`);
      if (clearErr) console.error("[Monday reset] Error:", clearErr);
      await sb.from("settings").upsert({ key: "week_cleared", value: new Date().toISOString() });
    }

    // ── Per-user calendar scheduling ──
    const { data: calUsers, error: calErr } = await sb.from("user_calendars").select("*");
    if (calErr) {
      console.error("Failed to load user_calendars:", calErr);
      return new Response(JSON.stringify({ error: "Failed to load user_calendars" }), { status: 500 });
    }

    // Load all user preferences
    const { data: allPrefs } = await sb.from("user_preferences").select("*");
    const prefsMap: Record<string, any> = {};
    for (const p of allPrefs || []) prefsMap[p.user_id] = p;

    const results: Record<string, any> = {};
    for (const calUser of calUsers || []) {
      try {
        const prefs = prefsMap[calUser.user_id];
        const userTz = prefs?.timezone || "America/New_York";
        const userStart = prefs?.scheduling_start ?? 720;
        const userEnd = prefs?.scheduling_end ?? 1020;
        const userDayKey = todayKey(userTz);
        const userDateStr = todayISO(userTz);
        const accessToken = await getAccessTokenForUser(calUser.refresh_token);
        const result = await scheduleForUser(calUser.user_id, accessToken, userDayKey, userDateStr, userTz, userStart, userEnd);
        results[calUser.user_id] = { scheduled: result.scheduled.length, tasks: result.scheduled };
        console.log(`[user=${calUser.user_id}] Scheduled ${result.scheduled.length} tasks (${userTz}, ${userStart}-${userEnd})`);
      } catch (err) {
        console.error(`[user=${calUser.user_id}] Error:`, err);
        results[calUser.user_id] = { error: String(err) };
      }
    }

    return new Response(
      JSON.stringify({ users: results, recurringCreated: recurringCreated.length, recurringTasks: recurringCreated }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
