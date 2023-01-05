import React, {useState} from 'react';
import './App.css';
import {Box} from '@mui/material';
import { AppStateProvider } from './AppStateContext';
import { AppCanvasProvider } from './CanvasContext';
import { Overview } from './components/Overview';

const statusHeight = 30

function App() {

  return (
    <AppStateProvider>
        <AppCanvasProvider>
          <Box component="main" sx={{ bgcolor: 'background.default'}}>
            <Overview sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
          </Box>
        </AppCanvasProvider>
    </AppStateProvider>
  )
}

export default App;
