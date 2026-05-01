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

DO $$
DECLARE
  reviewer_id uuid;
  today text;
  tomorrow text;
  day_after text;
BEGIN
  -- Look up the reviewer user by email
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

  -- Insert user preferences
  INSERT INTO user_preferences (user_id, timezone, scheduling_start, scheduling_end)
  VALUES (reviewer_id, 'America/New_York', 540, 1020);

  -- Insert projects (columns: id, user_id, name, color, archived)
  INSERT INTO projects (id, user_id, name, color, archived) VALUES
    (gen_random_uuid(), reviewer_id, 'App Launch', '#C04820', false),
    (gen_random_uuid(), reviewer_id, 'Marketing', '#6D50A0', false),
    (gen_random_uuid(), reviewer_id, 'Personal', '#2E7D32', false);

  -- Insert today's tasks (columns: id, user_id, day_key, name, status, context, complete, attachments, tags, due, estimate, recurring, recurring_frequency, position)
  INSERT INTO tasks (id, user_id, day_key, name, status, context, complete, attachments, tags, due, estimate, recurring, recurring_frequency, position) VALUES
    (gen_random_uuid(), reviewer_id, today, 'Review PR for onboarding flow', '', 'App Launch', true, '[]', '[]', '', '30m', false, '', 0),
    (gen_random_uuid(), reviewer_id, today, 'Write release notes for v2.1', '', 'App Launch', false, '[]', '[]', '', '20m', false, '', 1),
    (gen_random_uuid(), reviewer_id, today, 'Schedule social media posts', '', 'Marketing', false, '[]', '[]', '', '15m', false, '', 2),
    (gen_random_uuid(), reviewer_id, today, 'Team standup at 10am', '', '', true, '[]', '[]', '', '15m', false, '', 3),
    (gen_random_uuid(), reviewer_id, today, 'Gym – upper body', '', 'Personal', false, '[]', '[]', '', '45m', false, '', 4),
    (gen_random_uuid(), reviewer_id, today, 'Reply to design feedback', '', 'App Launch', false, '[]', '[]', '', '10m', false, '', 5);

  -- Insert tomorrow's tasks
  INSERT INTO tasks (id, user_id, day_key, name, status, context, complete, attachments, tags, due, estimate, recurring, recurring_frequency, position) VALUES
    (gen_random_uuid(), reviewer_id, tomorrow, 'Finalize landing page copy', '', 'Marketing', false, '[]', '[]', '', '45m', false, '', 0),
    (gen_random_uuid(), reviewer_id, tomorrow, 'Fix notification bug on iOS', '', 'App Launch', false, '[]', '[]', '', '1h', false, '', 1),
    (gen_random_uuid(), reviewer_id, tomorrow, 'Lunch with Sarah', '', 'Personal', false, '[]', '[]', '', '1h', false, '', 2);

  -- Insert day-after tasks
  INSERT INTO tasks (id, user_id, day_key, name, status, context, complete, attachments, tags, due, estimate, recurring, recurring_frequency, position) VALUES
    (gen_random_uuid(), reviewer_id, day_after, 'Sprint planning meeting', '', 'App Launch', false, '[]', '[]', '', '1h', false, '', 0),
    (gen_random_uuid(), reviewer_id, day_after, 'Research competitor pricing', '', 'Marketing', false, '[]', '[]', '', '30m', false, '', 1);

  -- Insert forward-looking tasks (columns: id, user_id, name, status, context, complete, attachments, tags, due, estimate, recurring, recurring_frequency, position)
  INSERT INTO forward_tasks (id, user_id, name, status, context, complete, attachments, tags, due, estimate, recurring, recurring_frequency, position) VALUES
    (gen_random_uuid(), reviewer_id, 'Submit app to App Store', '', 'App Launch', false, '[]', '[]', '', '', false, '', 0),
    (gen_random_uuid(), reviewer_id, 'Plan Q3 content calendar', '', 'Marketing', false, '[]', '[]', '', '', false, '', 1),
    (gen_random_uuid(), reviewer_id, 'Book dentist appointment', '', 'Personal', false, '[]', '[]', '', '', false, '', 2),
    (gen_random_uuid(), reviewer_id, 'Prepare investor update deck', '', 'App Launch', false, '[]', '[]', '', '', false, '', 3);

  RAISE NOTICE 'Reviewer demo data seeded successfully for user %', reviewer_id;
END $$;
