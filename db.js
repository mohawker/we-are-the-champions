const { Pool } = require('pg');
require('dotenv').config();

// Replace Pool details with process.env for cloud deployment
const devConfig = {
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
};

const prodConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig
);

// Returns: {string} Team name registered (primary key of TABLE teams)
const insertTeam = async (name, group, registrationDate) => {
  await pool.query(
    `INSERT INTO teams(team_name,group_number,registration_date) VALUES ('${name}', '${group}', '${registrationDate}')`
  );
  return name;
};

// Returns: {int} ID of match inserted into TABLE matches
const insertMatch = async (team_1, score_1, team_2, score_2) => {
  const res = await pool.query(
    `INSERT INTO matches(team_1,score_1,team_2,score_2) VALUES ('${team_1}', '${score_1}', '${team_2}', '${score_2}') returning id`
  );
  return res.rows[0].id;
};

// Returns: { array: Object } Array of matches in TABLE teams
const getAllMatches = async () => {
  const res = await pool.query('SELECT * FROM matches');
  return res.rows;
};

// Returns: { array: Object } Array of teams in TABLE teams
const getAllTeams = async () => {
  const res = await pool.query('SELECT * FROM teams');
  return res.rows;
};

exports.insertTeam = insertTeam;
exports.insertMatch = insertMatch;
exports.getAllMatches = getAllMatches;
exports.getAllTeams = getAllTeams;
