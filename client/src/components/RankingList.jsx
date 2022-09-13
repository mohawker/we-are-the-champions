import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

export default function RankingList(props) {
  const rankingList = props.rankingArray ? (
    props.rankingArray.map((ranking, index) => {
      return index <= 3 ? (
        <li className='ranking-qualified-team'>{ranking.teamName}</li>
      ) : (
        <li className='ranking-not-qualified-team'>{ranking.teamName}</li>
      );
    })
  ) : (
    <p>No Ranking Obtained. Ensure teams and matches are properly populated.</p>
  );
  let qualifiedString = '';
  if (props.qualifiedArray && props.qualifiedArray.length !== 0) {
    qualifiedString += 'Qualified Teams are: ';
    qualifiedString += props.qualifiedArray.join(', ');
  }

  return (
    <Grid item md={6} sm={12}>
      <Paper elevation={2} className='ranking-paper'>
        <Typography>{props.title}</Typography>
        <ol>{rankingList}</ol>
        <Typography>{qualifiedString}</Typography>
      </Paper>
    </Grid>
  );
}
