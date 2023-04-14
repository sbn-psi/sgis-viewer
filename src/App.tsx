import React, {useState} from 'react';
import './App.css';
import {AppBar, Box, Toolbar, Typography} from '@mui/material';
import { AppStateProvider, useAppState } from './AppStateContext';
import { AppCanvasProvider } from './CanvasContext';
import { Overview } from './components/Overview';
import { ZoneCanvas } from './components/Zone';
import Controls from './components/Controls';

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
    <AppBar position='sticky'>
      <Toolbar>
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SampleGIS
          </Typography>
      </Toolbar>
    </AppBar>
    { state.selectedZone 
      ? <ZoneCanvas zone={state.selectedZone} sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
      : <Overview sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
    }
    <Controls/>
  </Box>
}