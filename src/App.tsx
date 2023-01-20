import React, {useState} from 'react';
import './App.css';
import {Box} from '@mui/material';
import { AppStateProvider, useAppState } from './AppStateContext';
import { AppCanvasProvider } from './CanvasContext';
import { Overview } from './components/Overview';
import { ZoneCanvas } from './components/Zone';

function App() {

  return (
    <AppStateProvider>
        <AppCanvasProvider>
          <Main/>
        </AppCanvasProvider>
    </AppStateProvider>
  )
}

export default App;

function Main() {
  const state = useAppState()

  return <Box component="main" sx={{ bgcolor: 'background.default'}}>
    { state.selectedZone 
      ? <ZoneCanvas zone={state.selectedZone} sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
      : <Overview sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
    }
  </Box>
}