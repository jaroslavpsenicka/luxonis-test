CREATE TABLE estate (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    image character varying(2048),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
