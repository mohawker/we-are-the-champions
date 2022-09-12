const express = require('express');
const cors = require('cors');
const db = require('./db.js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
/**
 * POST: Create and INSERT new team into TABLE teams.
 * @name /api/register-team
 * @function
 * @param {Object} team - Object of individual team with a name, group and registrationDate attribute
 */
app.post('/api/register-team', async (req, res) => {
  try {
    const name = req.body.name;
    const group = req.body.group;
    const registrationDate = req.body.registrationDate;
    await db.insertTeam(longUrl, group, registrationDate);
    res.json({
      message: `Team ${name} successfully registered.`,
      type: 'success',
    });
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

/**
 * POST: Create and INSERT new teams into TABLE teams.
 * @name /api/register-teams
 * @function
 * @param {array} teams - Array of team objects, each team has a name, group and registrationDate attribute
 */
app.post('/api/register-teams', async (req, res) => {
  try {
    const teams = req.body.teams;
    const teamsRegistered = [];
    for await (const team of teams) {
      const teamName = await db.insertTeam(
        team.name,
        team.group,
        team.registrationDate
      );
      teamsRegistered.push(teamName);
    }
    const teamsRegisteredString = teamsRegistered.join(', ');
    res.json({
      message: `Teams ${teamsRegisteredString} successfully registered.`,
      teams_registered: teamsRegistered,
      type: 'success',
    });
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

/**
 * POST: Register and insert matches played between teams into TABLE matches.
 * @name /api/register-matches
 * @function
 * @param {array} matches - Array of team matches, each match has 4 attributes: (team_1, team_2, score_1, score_2)
 */

/*
{
    "matches": [
        {
            "team_1": "teamA",
            "score_1": 0,
            "team_2": "teamB",
            "score_2": 1
        },
        {
            "team_1": "teamA",
            "score_1": 1,
            "team_2": "teamC",
            "score_2": 3
        }
    ]
}
*/
app.post('/api/register-matches', async (req, res) => {
  try {
    const matches = req.body.matches;
    const matchesRegistered = [];
    for await (const match of matches) {
      const matchId = await db.insertMatch(
        match.team_1,
        match.score_1,
        match.team_2,
        match.score_2
      );
      matchesRegistered.push(matchId);
    }
    const matchesRegisteredString = matchesRegistered.join(', ');
    res.json({
      message: `Matches ${matchesRegisteredString} successfully registered.`,
      teams_registered: matchesRegistered,
      type: 'success',
    });
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

// GET: Get rankings of each team for each group
app.get('/api/get-ranking', async (req, res) => {
  try {
    const matches = await db.getAllMatches();
    const teams = await db.getAllTeams();
    if (matches === undefined || matches.length === 0) {
      return res.json({ message: `No matches found!`, type: 'failure' });
    }
    if (teams === undefined || teams.length === 0) {
      return res.json({ message: `No teams found!`, type: 'failure' });
    }

    // TODO: Each group should have its own ranking
    const dataStore = {};
    // TODO: Modularize and Refactor into helper functions for better modularity
    teams.forEach((team) => {
      dataStore[team.team_name] = {};
      dataStore[team.team_name]['teamName'] = team.team_name;
      dataStore[team.team_name]['groupNumber'] = team.group_number;
      dataStore[team.team_name]['registrationDate'] = team.registration_date;
      dataStore[team.team_name]['matchesPlayed'] = 0;
      dataStore[team.team_name]['matchesWon'] = 0;
      dataStore[team.team_name]['matchesDrawn'] = 0;
      dataStore[team.team_name]['goalsScored'] = 0;
      dataStore[team.team_name]['totalPoints'] = 0;
      dataStore[team.team_name]['alternativePoints'] = 0;
    });
    console.log(dataStore);
    // Evaluate result of each match
    for (const match of matches) {
      // Add goals scored for each team
      dataStore[match.team_1]['goalsScored'] += match.score_1;
      dataStore[match.team_2]['goalsScored'] += match.score_2;
      // Team 1 Wins
      if (match.score_1 > match.score_2) {
        dataStore[match.team_1]['matchesWon'] += 1;
        dataStore[match.team_1]['totalPoints'] += 3;
        dataStore[match.team_1]['alternativePoints'] += 5;
        dataStore[match.team_2]['alternativePoints'] += 1;
      }
      // Team 2 Wins
      else if (match.score_2 > match.score_1) {
        dataStore[match.team_2]['matchesWon'] += 1;
        dataStore[match.team_2]['totalPoints'] += 3;
        dataStore[match.team_2]['alternativePoints'] += 5;
        dataStore[match.team_1]['alternativePoints'] += 1;
      }
      // Draw
      else {
        dataStore[match.team_1]['matchesDrawn'] += 1;
        dataStore[match.team_1]['totalPoints'] += 1;
        dataStore[match.team_1]['alternativePoints'] += 3;
        dataStore[match.team_2]['matchesDrawn'] += 1;
        dataStore[match.team_2]['totalPoints'] += 1;
        dataStore[match.team_2]['alternativePoints'] += 3;
      }
    }
    const sortedDataStore = Object.values(dataStore);
    // TODO: Fix Sorting of Registration Date
    sortedDataStore.sort(
      (a, b) =>
        b.totalPoints - a.totalPoints ||
        b.goalsScored - a.goalsScored ||
        b.alternativePoints - a.alternativePoints ||
        new Date(a.registrationDate) - new Date(b.registrationDate)
    );
    res.json({
      message: `Ranking Processed!`,
      team_results: sortedDataStore,
      type: 'success',
    });
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

// Optional: DEL match record (individually)

// POST: DEL all match records

// POST: DEL all team records

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`URL Shortener server started, listening at PORT ${PORT}`)
);
