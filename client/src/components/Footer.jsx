import React from 'react';
import { Stack, Typography, Link, Divider } from '@mui/material';
import '../App.css';

export default function Footer() {
  return (
    <Stack
      spacing={1}
      alignItems={'center'}
      sx={{ padding: '8px', width: '100%' }}
      className='footer'
    >
      <Divider orientation='horizontal' flexItem />
      <Stack spacing={1} sx={{ opacity: '50%' }}>
        <Typography variant='body2' color='white'>
          URL Shortener by{' '}
          <Link href='https://github.com/mohawker'>mohawker</Link>
        </Typography>
      </Stack>
    </Stack>
  );
}
