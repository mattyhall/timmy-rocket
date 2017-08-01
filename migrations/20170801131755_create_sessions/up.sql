CREATE TABLE sessions (
       id SERIAL PRIMARY KEY,
       user_id INTEGER NOT NULL,
       token TEXT NOT NULL,
       expiry TIMESTAMP NOT NULL
);
