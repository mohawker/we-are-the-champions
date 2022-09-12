create database we_are_the_champions_db;

create table teams(
  team_name varchar (255) primary key,
  group_number int not null,
  registration_date date not null
);

create table matches(
  id serial primary key,
  team_1 varchar (255) not null references teams(team_name),
  team_2 varchar (255) not null references teams(team_name),
  score_1 int not null,
  score_2 int not null,
  constraint not_equal check (team_1 <> team_2)
);
