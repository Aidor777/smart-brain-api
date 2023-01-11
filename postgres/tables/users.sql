BEGIN TRANSACTION;

CREATE TABLE users
(
    id serial primary key,
    name varchar(100),
    email text unique NOT NULL,
    entries bigint DEFAULT 0,
    joined timestamp without time zone NOT NULL
);

COMMIT;