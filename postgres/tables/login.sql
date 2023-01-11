BEGIN TRANSACTION;

CREATE TABLE login
(
    id serial primary key,
    hash varchar(100) NOT NULL,
    email text unique NOT NULL
);

COMMIT;