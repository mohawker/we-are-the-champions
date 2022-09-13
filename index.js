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
app.post('/api/enter-matches', async (req, res) => {
  try {
    const matches = req.body.matches;
    const matchesEntered = [];
    for await (const match of matches) {
      const matchId = await db.insertMatch(
        match.team_1,
        match.score_1,
        match.team_2,
        match.score_2
      );
      matchesEntered.push(matchId);
    }
    const matchesEnteredString = matchesEntered.join(', ');
    res.json({
      message: `Matches ${matchesEnteredString} successfully registered.`,
      matches_entered: matchesEntered,
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
    if (matches === undefined) {
      return res.json({ message: `Could not get matches!`, type: 'failure' });
    }
    if (teams === undefined || teams.length === 0) {
      return res.json({ message: `No teams found!`, type: 'failure' });
    }

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
    // Assumption: Only two groups identified by group number 1 or 2
    const groupOneRanking = sortedDataStore.filter((obj) => {
      return obj.groupNumber === 1;
    });
    const groupTwoRanking = sortedDataStore.filter((obj) => {
      return obj.groupNumber === 2;
    });

    const groupOneQualified = groupOneRanking
      .slice(0, 4)
      .map((team) => team.teamName);
    const groupTwoQualified = groupTwoRanking
      .slice(0, 4)
      .map((team) => team.teamName);

    res.json({
      message: `Ranking processed successfully!`,
      team_results: sortedDataStore,
      group_one_ranking: groupOneRanking,
      group_one_qualified: groupOneQualified,
      group_two_ranking: groupTwoRanking,
      group_two_qualified: groupTwoQualified,
      type: 'success',
    });
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

/**
 * POST: DEL all match records in TABLE matches
 * @name /api/delete-all-matches
 * @function
 */
app.post('/api/delete-all-matches', async (req, res) => {
  try {
    await db.deleteAllMatches();
    res.json({
      message: `All matches successfully deleted.`,
      type: 'success',
    });
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

/**
 * POST: DEL all team records in TABLE teams
 * @name /api/delete-all-teams
 * @function
 */
app.post('/api/delete-all-teams', async (req, res) => {
  try {
    await db.deleteAllTeams();
    res.json({
      message: `All teams successfully deleted.`,
      type: 'success',
    });
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`URL Shortener server started, listening at PORT ${PORT}`)
);
