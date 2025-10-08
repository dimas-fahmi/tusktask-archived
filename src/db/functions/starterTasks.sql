-- Make sure pgcrypto is available for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to insert default tasks when a primary project is created
CREATE OR REPLACE FUNCTION "project".create_default_tasks_for_primary_project()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only trigger for primary projects
  IF NEW.project_type = 'primary' THEN
    INSERT INTO "project".tasks (id, owner_id, project_id, name, description, task_status, task_priority, deadline_at)
    VALUES
      (
        gen_random_uuid(),
        NEW.owner_id,
        NEW.id,
        'Mark a task as done',
        'Click the circle button to mark this task as completed.',
        'on_process',
        'medium',
        now() + interval '1 day'        -- due tomorrow
      ),
      (
        gen_random_uuid(),
        NEW.owner_id,
        NEW.id,
        'Create a new project',
        'Try to create a new project to organize your work.',
        'on_process',
        'high',
        now() + interval '2 days'       -- due in 2 days
      ),
      (
        gen_random_uuid(),
        NEW.owner_id,
        NEW.id,
        'Create a new task',
        'Right-click on any project then click new task.',
        'on_process',
        'high',
        now() + interval '3 days'       -- due in 3 days
      ),
      (
        gen_random_uuid(),
        NEW.owner_id,
        NEW.id,
        'Delete this task',
        'Right-click or hold for mobile to open context-menu, then delete.',
        'on_process',
        'urgent',
        now() + interval '4 days'       -- due in 4 days
      ),
      (
        gen_random_uuid(),
        NEW.owner_id,
        NEW.id,
        'Archived',
        'Open context-menu and restore this task from archive store!',
        'archived',
        'low',
        now() - interval '1 day'        -- past date (example for archived)
      ),
      (
        gen_random_uuid(),
        NEW.owner_id,
        NEW.id,
        'Setup Telegram Notification',
        'Open notification settings so Tusky can send you reminders!',
        'on_process',
        'high',
        now() + interval '5 days'       -- due in 5 days
      ),
      (
        gen_random_uuid(),
        NEW.owner_id,
        NEW.id,
        'Give it a star',
        'You like my side-project? give the repo a star!',
        'on_process',
        'low',
        now() + interval '7 days'       -- due in 7 days
      ),
      (
        gen_random_uuid(),
        NEW.owner_id,
        NEW.id,
        'Passed Deadline!',
        'Oh No, the boss is not going to like it. Quick, reschedule!',
        'on_process',
        'high',
        now() - interval '2 days'       
      );
  END IF;

  RETURN NEW;
END;
$$;

-- Drop old trigger if it exists
DROP TRIGGER IF EXISTS create_default_tasks_after_project_insert ON "project".projects;

-- Create the trigger
CREATE TRIGGER create_default_tasks_after_project_insert
AFTER INSERT ON "project".projects
FOR EACH ROW
EXECUTE FUNCTION "project".create_default_tasks_for_primary_project();
