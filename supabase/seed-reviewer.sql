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
-- After creating the user, copy the resulting user UUID and replace the placeholder below.

-- Replace this with the actual UUID from Supabase Auth after creating the user:
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

  -- Insert projects
  INSERT INTO projects (id, user_id, name, color, sort_order) VALUES
    (gen_random_uuid(), reviewer_id, 'App Launch', '#C04820', 0),
    (gen_random_uuid(), reviewer_id, 'Marketing', '#6D50A0', 1),
    (gen_random_uuid(), reviewer_id, 'Personal', '#2E7D32', 2);

  -- Insert today's tasks (mix of complete and incomplete)
  INSERT INTO tasks (id, user_id, day_key, name, complete, estimate, sort_order, status, context) VALUES
    (gen_random_uuid(), reviewer_id, today, 'Review PR for onboarding flow', true, '30m', 0, '', 'App Launch'),
    (gen_random_uuid(), reviewer_id, today, 'Write release notes for v2.1', false, '20m', 1, '', 'App Launch'),
    (gen_random_uuid(), reviewer_id, today, 'Schedule social media posts', false, '15m', 2, '', 'Marketing'),
    (gen_random_uuid(), reviewer_id, today, 'Team standup at 10am', true, '15m', 3, '', ''),
    (gen_random_uuid(), reviewer_id, today, 'Gym – upper body', false, '45m', 4, '', 'Personal'),
    (gen_random_uuid(), reviewer_id, today, 'Reply to design feedback', false, '10m', 5, '', 'App Launch');

  -- Insert tomorrow's tasks
  INSERT INTO tasks (id, user_id, day_key, name, complete, estimate, sort_order, status, context) VALUES
    (gen_random_uuid(), reviewer_id, tomorrow, 'Finalize landing page copy', false, '45m', 0, '', 'Marketing'),
    (gen_random_uuid(), reviewer_id, tomorrow, 'Fix notification bug on iOS', false, '1h', 1, '', 'App Launch'),
    (gen_random_uuid(), reviewer_id, tomorrow, 'Lunch with Sarah', false, '1h', 2, '', 'Personal');

  -- Insert day-after tasks
  INSERT INTO tasks (id, user_id, day_key, name, complete, estimate, sort_order, status, context) VALUES
    (gen_random_uuid(), reviewer_id, day_after, 'Sprint planning meeting', false, '1h', 0, '', 'App Launch'),
    (gen_random_uuid(), reviewer_id, day_after, 'Research competitor pricing', false, '30m', 1, '', 'Marketing');

  -- Insert forward-looking tasks
  INSERT INTO forward_tasks (id, user_id, name, sort_order, due, context) VALUES
    (gen_random_uuid(), reviewer_id, 'Submit app to App Store', 0, today || ' +7 days', 'App Launch'),
    (gen_random_uuid(), reviewer_id, 'Plan Q3 content calendar', 1, '', 'Marketing'),
    (gen_random_uuid(), reviewer_id, 'Book dentist appointment', 2, '', 'Personal'),
    (gen_random_uuid(), reviewer_id, 'Prepare investor update deck', 3, '', 'App Launch');

  RAISE NOTICE 'Reviewer demo data seeded successfully for user %', reviewer_id;
END $$;
