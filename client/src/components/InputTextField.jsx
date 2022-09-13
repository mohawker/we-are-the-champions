import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';

import SendIcon from '@mui/icons-material/Send';

export default function InputTextField(props) {
  const SendButton = () => (
    <LoadingButton
      onClick={() => props.inputAction()}
      loading={props.isLoading}
      size='small'
      color='inherit'
    >
      <SendIcon />
    </LoadingButton>
  );
  return (
    <Paper className='paper'>
      <Stack spacing={1}>
        <Typography variant='h5'>{props.title}</Typography>
        <Typography variant='subtitle2'>
          <u>Input Format</u>
          <br />
          {props.subtitleInputFormat}
        </Typography>
        <TextField
          multiline
          error={props.isError}
          label={props.label}
          variant='outlined'
          rows={10}
          value={props.input}
          helperText={props.message}
          onChange={(input) => {
            props.setInput(input.target.value);
            props.setMessage('');
            props.setError(false);
          }}
          InputProps={{ endAdornment: <SendButton /> }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              props.inputAction();
            }
          }}
        />
      </Stack>
    </Paper>
  );
}
