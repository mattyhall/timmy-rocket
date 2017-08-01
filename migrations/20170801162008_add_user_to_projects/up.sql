ALTER TABLE projects ADD COLUMN user_id INTEGER;
UPDATE projects SET user_id=1;
ALTER TABLE projects ALTER COLUMN user_id SET NOT NULL;
