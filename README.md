# We are the Champions
Football Table Calculator built with React.js, Node.js and Postgres by Er Jun Jia

Both server and client are hosted on Heroku at https://we-are-the-champions-app.herokuapp.com/ 

## Instructions (to run locally)
### BE Server
- Clone the repo
- Install PosgreSQL on your own local machine (https://www.postgresql.org/download/) 
- Create an `.env` file in the root directory of the repo with the following details:
```
PG_USER = <YOUR USERNAME>
PG_HOST = <YOUR HOST>
PG_PORT = <YOUR PORT>
PG_DATABASE =<YOUR DATABASE NAME>
```
The server will use your local database to store the tables necessary. 
- Connect to your database and create the DB + tables with the commands provided in the `database.sql` file in the repo
- Run `node index.js` in the root directory to start the server on localhost

### FE Client
- `cd client` - Enter the client directory from the root directory
- `npm run start` - To start the client on https://localhost:3000

## Demo
![demo](https://user-images.githubusercontent.com/48997733/189912415-a7d45cb5-1d62-4817-baa2-f1f92b6fec75.gif)

## Application Objective
Given a list of teams to be registered and match results (in the format given), return the ranking of each of the teams within the group. The top 4 teams of each group will qualify for the next stage of the tournament. 

## Architecture
Node.js was used for the backend server, with a postgreSQL database. The database has two tables, *teams* and *matches*

The schema (including constraints) for each of the postgreSQL database can be found below: 
```
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
```
After team registration + entering results, users will be able to generate the ranking for each group, which will be displayed on the website. The user can then reset the data by deleting all entries from both tables through a button on the website. 

## Assumptions
- During team registration, teams can only be of group 1 or 2 (no other naming convention for group)
- As stated in the assignment, the application does not need to handle the processing of results for subsequent rounds of the championship

## Other Features
- Error messages returned by the BE will be displayed on the FE should the user try to input erroneous input.
- Website is designed to be mobile friendly (grid and sizing)
