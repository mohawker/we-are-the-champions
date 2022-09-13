import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

export default function RankingList(props) {
  const rankingList = props.rankingArray ? (
    props.rankingArray.map((ranking) => <li>{ranking.teamName}</li>)
  ) : (
    <p>No Ranking Obtained. Ensure teams and matches are properly populated.</p>
  );

  return (
    <Grid item md={6} sm={12}>
      <Paper elevation={2} className='ranking-paper'>
        <Typography>{props.title}</Typography>
        <ol>{rankingList}</ol>
      </Paper>
    </Grid>
  );
}
