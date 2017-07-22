CREATE TABLE projects (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT,
       active BOOLEAN NOT NULL DEFAULT 't'
)
