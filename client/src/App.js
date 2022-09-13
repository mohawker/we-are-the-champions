import './App.css';
import { useState, useEffect } from 'react';

// MUI Components
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

// Animation Libraries
import AOS from 'aos';
import 'aos/dist/aos.css';

// Custom Components
import InputTextField from './components/InputTextField';
import RankingList from './components/RankingList';

const axios = require('axios');
function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  // STATES
  const [isLoading, setIsLoading] = useState(false);
  // Team Input
  const [teamInput, setTeamInput] = useState('');
  const [teamMessage, setTeamMessage] = useState('');
  const [teamIsError, setTeamIsError] = useState(false);

  // Match input
  const [matchInput, setMatchInput] = useState('');
  const [matchMessage, setMatchMessage] = useState('');
  const [matchIsError, setMatchIsError] = useState(false);

  // Ranking States
  const [groupOneRanking, setGroupOneRanking] = useState([]);
  const [groupOneQualified, setGroupOneQualified] = useState([]);
  const [groupTwoRanking, setGroupTwoRanking] = useState([]);
  const [groupTwoQualified, setGroupTwoQualified] = useState([]);
  const [rankingMessage, setRankingMessage] = useState('');

  // Delete States
  const [deleteTeamMessage, setDeleteTeamMessage] = useState('');
  const [deleteMatchMessage, setDeleteMatchMessage] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 750,
    });
  }, []);

  // Helper Functions
  const registerTeams = (e) => {
    setIsLoading(true);
    try {
      const teamArray = teamInput.trim().split(/\r?\n/);
      const toBeRegistered = [];
      for (const teamString of teamArray) {
        let [name, regDate, group] = teamString.split(' ');
        const regDay = regDate.split('/')[0];
        const regMonth = regDate.split('/')[1];
        // Assume year is 2022
        regDate = '2022' + '-' + regMonth + '-' + regDay;
        const teamObj = {
          name: name,
          group: group,
          registrationDate: regDate,
        };
        toBeRegistered.push(teamObj);
      }
      axios
        .post('/api/register-teams', { teams: toBeRegistered })
        .then(function (res) {
          const res_type = res.data.type;
          const teamsRegistered = res.data.teams_registered;
          const message = res.data.message;
          setTeamMessage(message);
          if (res_type === 'failure' || teamsRegistered === undefined) {
            setTeamIsError(true);
          } else {
            setTeamIsError(false);
          }
        })
        .catch(function (err) {
          setTeamIsError(true);
          setTeamMessage(err.message);
          setIsLoading(false);
        });
      setDeleteMatchMessage('');
      setDeleteTeamMessage('');
    } catch (err) {
      setTeamMessage(err.message);
      setTeamIsError(true);
    }
    setIsLoading(false);
  };

  const enterMatches = (e) => {
    setIsLoading(true);
    try {
      const matchArray = matchInput.trim().split(/\r?\n/);
      const toBeEntered = [];
      for (const matchString of matchArray) {
        console.log(matchString);
        let [team_1, team_2, score_1, score_2] = matchString.split(' ');
        const matchObj = {
          team_1: team_1,
          score_1: score_1,
          team_2: team_2,
          score_2: score_2,
        };
        toBeEntered.push(matchObj);
      }
      axios
        .post('/api/enter-matches', { matches: toBeEntered })
        .then(function (res) {
          const res_type = res.data.type;
          console.log(res);
          const matchesEntered = res.data.matches_entered;
          const message = res.data.message;
          setMatchMessage(message);
          if (res_type === 'failure' || matchesEntered === undefined) {
            setMatchIsError(true);
          } else {
            setMatchIsError(false);
          }
        })
        .catch(function (err) {
          setMatchIsError(true);
          setMatchMessage(err.message);
        });
      setDeleteMatchMessage('');
      setDeleteTeamMessage('');
    } catch (err) {
      setMatchMessage(err.message);
      setMatchIsError(true);
    }
    setIsLoading(false);
  };

  const getRanking = (e) => {
    setIsLoading(true);
    try {
      axios
        .get('/api/get-ranking')
        .then(function (res) {
          setGroupOneRanking(res.data.group_one_ranking);
          setGroupTwoRanking(res.data.group_two_ranking);
          setGroupOneQualified(res.data.group_one_qualified);
          setGroupTwoQualified(res.data.group_two_qualified);
          setRankingMessage(res.data.message);
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (err) {
      setRankingMessage(err.message);
    }
    setIsLoading(false);
  };

  const deleteAll = (e) => {
    setIsLoading(true);
    try {
      axios
        .post('/api/delete-all-matches')
        .then(function (res) {
          setDeleteMatchMessage(res.data.message);
        })
        .catch(function (err) {
          console.log(err);
        });

      axios
        .post('/api/delete-all-teams')
        .then(function (res) {
          setDeleteTeamMessage(res.data.message);
        })
        .catch(function (err) {
          console.log(err);
        });

      setGroupOneRanking([]);
      setGroupTwoRanking([]);
      setGroupOneQualified([]);
      setGroupTwoQualified([]);
      setRankingMessage('');
    } catch (err) {
      setDeleteMatchMessage(err.message);
    }
    setIsLoading(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container className='homepage'>
        <Stack className='homepage-stack' spacing={3}>
          <Typography variant='h3' fontWeight='bold'>
            We are the Champions
          </Typography>
          <InputTextField
            title='Team Registration'
            subtitleInputFormat='&lt;Team A name&gt; &lt;Team A registration date in DD/MM&gt;
                &lt;Team A group number&gt;'
            label='Register teams here:'
            isError={teamIsError}
            input={teamInput}
            message={teamMessage}
            setInput={setTeamInput}
            setMessage={setTeamMessage}
            setError={setTeamIsError}
            inputAction={registerTeams}
            isLoading={isLoading}
          />
          <InputTextField
            title='Enter Match Results'
            subtitleInputFormat='&lt;Team A name&gt; &lt;Team B Name&gt; &lt;Team A goals
                scored&gt; &lt;Team B goals scored&gt;'
            label='Enter match results here:'
            isError={matchIsError}
            input={matchInput}
            message={matchMessage}
            setInput={setMatchInput}
            setMessage={setMatchMessage}
            setError={setMatchIsError}
            inputAction={enterMatches}
            isLoading={isLoading}
          />
          <Paper className='paper'>
            <Stack spacing={1}>
              <Typography variant='h5'>Ranking</Typography>
              <LoadingButton variant='contained' onClick={getRanking}>
                CLICK HERE TO GET RANKING RESULTS
              </LoadingButton>
              <Typography variant='subtitle2'>{rankingMessage}</Typography>
              <Grid container>
                <RankingList
                  title='Group One Ranking (Descending)'
                  rankingArray={groupOneRanking}
                  qualifiedArray={groupOneQualified}
                />
                <RankingList
                  title='Group Two Ranking (Descending)'
                  rankingArray={groupTwoRanking}
                  qualifiedArray={groupTwoQualified}
                />
              </Grid>
            </Stack>
          </Paper>
          <Stack spacing={1}>
            <LoadingButton
              color='error'
              variant='contained'
              onClick={deleteAll}
            >
              Delete all matches and teams
            </LoadingButton>
            <Typography variant='subtitle2'>{deleteTeamMessage}</Typography>
            <Typography variant='subtitle2'>{deleteMatchMessage}</Typography>
          </Stack>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
