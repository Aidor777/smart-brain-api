begin transaction;

insert into users(name, email, joined)
values ('test', 'test@test.com', now());

insert into login(hash, email)
values ('$2a$10$pQVHFU6iywlCpPKqDKxIXeF4ZxXqrE/94ECko/sQQ40pzgGWZCXRq', 'test@test.com');

commit;