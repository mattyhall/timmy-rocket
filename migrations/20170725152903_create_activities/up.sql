CREATE TABLE activities (
       id SERIAL PRIMARY KEY,
       project_id INTEGER REFERENCES projects(id),
       description VARCHAR,
       start_time TIMESTAMP WITH TIME ZONE NOT NULL,
       end_time TIMESTAMP WITH TIME ZONE NOT NULL,
       tags TEXT[] NOT NULL DEFAULT '{}'
)
