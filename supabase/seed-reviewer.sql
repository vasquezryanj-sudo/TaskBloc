-- Seed script: Create the App Store reviewer test account and pre-populate demo data.
-- Run this once against your Supabase project via the SQL editor or CLI.
--
-- Account: taskbloc.reviewer@withprovenance.org / R3v!ew_TaskBl0c_2026
--
-- IMPORTANT: You must first create the user in Supabase Auth (Dashboard > Authentication > Users > Add user)
--   Email: taskbloc.reviewer@withprovenance.org
--   Password: R3v!ew_TaskBl0c_2026
--   Auto-confirm: YES
--
-- After creating the user, run this script.

-- Verified schema:
-- tasks: id(text), day_key(text), name(text), status(text), context(text), complete(bool), attachments(jsonb), position(int), estimate(text), tags(jsonb), due(text), start(text), recurring(bool), recurring_frequency(text), user_id(uuid)
-- forward_tasks: id(text), name(text), status(text), context(text), complete(bool), attachments(jsonb), position(int), estimate(text), tags(jsonb), due(text), start(text), user_id(uuid)
-- projects: id(text), name(text), color(text), archived(bool), user_id(uuid)
-- user_preferences: id(uuid), user_id(uuid), scheduling_start(int), scheduling_end(int), timezone(text)

DO $$
DECLARE
  reviewer_id uuid;
  today text;
  tomorrow text;
  day_after text;
BEGIN
  SELECT id INTO reviewer_id FROM auth.users WHERE email = 'taskbloc.reviewer@withprovenance.org';

  IF reviewer_id IS NULL THEN
    RAISE EXCEPTION 'Reviewer user not found. Create the user in Supabase Auth first.';
  END IF;

  today := to_char(now() AT TIME ZONE 'America/New_York', 'YYYY-MM-DD');
  tomorrow := to_char((now() AT TIME ZONE 'America/New_York') + interval '1 day', 'YYYY-MM-DD');
  day_after := to_char((now() AT TIME ZONE 'America/New_York') + interval '2 days', 'YYYY-MM-DD');

  -- Clean any existing demo data for this user
  DELETE FROM tasks WHERE user_id = reviewer_id;
  DELETE FROM forward_tasks WHERE user_id = reviewer_id;
  DELETE FROM projects WHERE user_id = reviewer_id;
  DELETE FROM user_preferences WHERE user_id = reviewer_id;

  -- user_preferences
  INSERT INTO user_preferences (user_id, timezone, scheduling_start, scheduling_end)
  VALUES (reviewer_id, 'America/New_York', 540, 1020);

  -- projects (id is text, not uuid)
  INSERT INTO projects (id, user_id, name, color, archived) VALUES
    ('proj_review_1', reviewer_id, 'App Launch', '#C04820', false),
    ('proj_review_2', reviewer_id, 'Marketing', '#6D50A0', false),
    ('proj_review_3', reviewer_id, 'Personal', '#2E7D32', false);

  -- tasks for today
  INSERT INTO tasks (id, user_id, day_key, name, status, context, complete, attachments, position, estimate, tags, due, start, recurring, recurring_frequency) VALUES
    ('rev_t1', reviewer_id, today, 'Review PR for onboarding flow', '', 'App Launch', true, '[]', 0, '30m', '[]', '', '', false, ''),
    ('rev_t2', reviewer_id, today, 'Write release notes for v2.1', '', 'App Launch', false, '[]', 1, '20m', '[]', '', '', false, ''),
    ('rev_t3', reviewer_id, today, 'Schedule social media posts', '', 'Marketing', false, '[]', 2, '15m', '[]', '', '', false, ''),
    ('rev_t4', reviewer_id, today, 'Team standup at 10am', '', '', true, '[]', 3, '15m', '[]', '', '', false, ''),
    ('rev_t5', reviewer_id, today, 'Gym – upper body', '', 'Personal', false, '[]', 4, '45m', '[]', '', '', false, ''),
    ('rev_t6', reviewer_id, today, 'Reply to design feedback', '', 'App Launch', false, '[]', 5, '10m', '[]', '', '', false, '');

  -- tasks for tomorrow
  INSERT INTO tasks (id, user_id, day_key, name, status, context, complete, attachments, position, estimate, tags, due, start, recurring, recurring_frequency) VALUES
    ('rev_t7', reviewer_id, tomorrow, 'Finalize landing page copy', '', 'Marketing', false, '[]', 0, '45m', '[]', '', '', false, ''),
    ('rev_t8', reviewer_id, tomorrow, 'Fix notification bug on iOS', '', 'App Launch', false, '[]', 1, '1h', '[]', '', '', false, ''),
    ('rev_t9', reviewer_id, tomorrow, 'Lunch with Sarah', '', 'Personal', false, '[]', 2, '1h', '[]', '', '', false, '');

  -- tasks for day after
  INSERT INTO tasks (id, user_id, day_key, name, status, context, complete, attachments, position, estimate, tags, due, start, recurring, recurring_frequency) VALUES
    ('rev_t10', reviewer_id, day_after, 'Sprint planning meeting', '', 'App Launch', false, '[]', 0, '1h', '[]', '', '', false, ''),
    ('rev_t11', reviewer_id, day_after, 'Research competitor pricing', '', 'Marketing', false, '[]', 1, '30m', '[]', '', '', false, '');

  -- forward_tasks (no recurring columns)
  INSERT INTO forward_tasks (id, user_id, name, status, context, complete, attachments, position, estimate, tags, due, start) VALUES
    ('rev_f1', reviewer_id, 'Submit app to App Store', '', 'App Launch', false, '[]', 0, '', '[]', '', ''),
    ('rev_f2', reviewer_id, 'Plan Q3 content calendar', '', 'Marketing', false, '[]', 1, '', '[]', '', ''),
    ('rev_f3', reviewer_id, 'Book dentist appointment', '', 'Personal', false, '[]', 2, '', '[]', '', ''),
    ('rev_f4', reviewer_id, 'Prepare investor update deck', '', 'App Launch', false, '[]', 3, '', '[]', '', '');

  RAISE NOTICE 'Reviewer demo data seeded successfully for user %', reviewer_id;
END $$;
