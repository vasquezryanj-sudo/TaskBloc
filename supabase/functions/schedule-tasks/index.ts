import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GOOGLE_REFRESH_TOKEN = Deno.env.get("GOOGLE_REFRESH_TOKEN")!;
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

interface TimeBlock {
  start: number; // minutes from midnight
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

function minutesToISO(dateStr: string, minutes: number, tz: string): string {
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

// ── Main handler ──

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

Deno.serve(async () => {
  try {
    const tz = "America/New_York"; // user's local timezone
    const dayKey = todayKey(tz);
    const dateStr = todayISO(tz);
    const DAY_START = 12 * 60; // 12pm
    const DAY_END = 17 * 60; // 5pm

    // ── Recurring task rollover ──
    const yKey = yesterdayKey(tz);
    const { data: recurringTasks } = await sb
      .from("tasks")
      .select("*")
      .eq("day_key", yKey)
      .eq("complete", true)
      .eq("recurring", true);

    const recurringCreated: string[] = [];
    if (recurringTasks && recurringTasks.length > 0) {
      // Get count of existing tasks for today to set position
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
        };
        await sb.from("tasks").insert(newTask);
        recurringCreated.push(rt.name);
      }
    }

    // ── Monday weekly reset ──
    const nowLocal = new Date().toLocaleString("en-US", { timeZone: tz });
    const localDate = new Date(nowLocal);
    if (localDate.getDay() === 1) {
      await sb.from("settings").upsert({ key: "week_cleared", value: new Date().toISOString() });
    }

    // 1. Fetch today's incomplete tasks
    const { data: tasks, error: taskErr } = await sb
      .from("tasks")
      .select("*")
      .eq("day_key", dayKey)
      .eq("complete", false)
      .order("position", { ascending: true });

    if (taskErr) throw taskErr;
    if (!tasks || tasks.length === 0) {
      return new Response(JSON.stringify({ message: "No tasks for today" }), { status: 200 });
    }

    // 2. Get Google access token
    const accessToken = await getAccessToken();

    // 3. Fetch today's calendar events (12pm–5pm)
    const timeMin = `${dateStr}T12:00:00`;
    const timeMax = `${dateStr}T17:00:00`;
    const calParams = new URLSearchParams({
      timeMin: new Date(`${timeMin}`).toISOString(),
      timeMax: new Date(`${timeMax}`).toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      timeZone: tz,
    });
    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${calParams}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!calRes.ok) throw new Error(`Calendar fetch failed: ${calRes.status}`);
    const calData = await calRes.json();

    // 4. Build busy blocks
    const busy: TimeBlock[] = (calData.items || [])
      .filter((e: any) => e.start?.dateTime && e.end?.dateTime)
      .map((e: any) => ({
        start: parseMinutes(e.start.dateTime, tz),
        end: parseMinutes(e.end.dateTime, tz),
      }));

    // Collect existing event titles to avoid duplicates
    const existingTitles = new Set(
      (calData.items || []).map((e: any) => e.summary?.trim().toLowerCase())
    );

    // 5. Find free gaps
    const gaps = findFreeGaps(busy, DAY_START, DAY_END);

    // 6. Schedule tasks into free gaps
    let gapIdx = 0;
    let cursor = gaps.length > 0 ? gaps[0].start : DAY_START;
    const created: string[] = [];

    for (const task of tasks) {
      // Skip if a calendar event with this title already exists
      if (existingTitles.has(task.name?.trim().toLowerCase())) continue;

      const duration = task.estimate ? timeToMins(task.estimate) : 30;
      if (isNaN(duration) || duration <= 0) continue;

      // Advance to a gap that can fit this task
      while (gapIdx < gaps.length) {
        if (cursor + duration <= gaps[gapIdx].end) break;
        gapIdx++;
        if (gapIdx < gaps.length) cursor = gaps[gapIdx].start;
      }
      if (gapIdx >= gaps.length) break; // no more room

      const startTime = minutesToISO(dateStr, cursor, tz);
      const endTime = minutesToISO(dateStr, cursor + duration, tz);

      const descLines: string[] = [];
      if (task.status) descLines.push(`Status: ${task.status}`);
      if (task.due) descLines.push(`Due: ${task.due}`);
      if (task.estimate) descLines.push(`Estimate: ${task.estimate}`);
      if (task.tags && task.tags.length > 0) descLines.push(`Tags: ${task.tags.join(", ")}`);
      if (task.context) descLines.push(`Notes: ${task.context}`);
      if (task.attachments && task.attachments.length > 0) descLines.push(`Attachments: ${task.attachments.map((a: any) => a.name || a.url || a).join(", ")}`);
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
        }
      );
      if (!createRes.ok) {
        console.error(`Failed to create event for "${task.name}": ${createRes.status}`);
        continue;
      }

      created.push(task.name);
      cursor += duration;
    }

    return new Response(
      JSON.stringify({ scheduled: created.length, tasks: created, recurringCreated: recurringCreated.length, recurringTasks: recurringCreated }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
