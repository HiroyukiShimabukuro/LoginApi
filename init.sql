CREATE USER local_user;

SELECT 'CREATE DATABASE local_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'local_db');

GRANT ALL PRIVILEGES ON DATABASE local_db TO local_user;

CREATE TABLE IF NOT EXISTS public.users (id serial PRIMARY KEY, name varchar(255) NOT NULL, email varchar(255) NOT NULL, password varchar(255), created_at timestamp NOT NULL DEFAULT NOW());

ALTER TABLE public.users OWNER TO local_user;
