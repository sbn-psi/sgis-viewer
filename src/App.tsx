import React, {useState} from 'react';
import './App.css';
import {Box, IconButton, styled, SxProps, Theme, Toolbar, Typography} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { AppStateProvider, useAppState } from './AppStateContext';
import { AppCanvasProvider } from './CanvasContext';
import { Overview } from './components/Overview';
import { ZoneCanvas } from './components/Zone';
import Controls from './components/Controls';
import LayerNavigator from './components/Layers';
import { Menu } from '@mui/icons-material';

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

const drawerWidth = 240;

function Main() {
  const state = useAppState()
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return <Box component="main" sx={bg}>
    <AppBar position='sticky' open={open} >
      <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <Menu />
          </IconButton>
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
    <LayerNavigator open={open} close={() => setOpen(false)}/>
    { state.selectedZone 
      ? <ZoneCanvas zone={state.selectedZone} sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
      : <Overview sx={{height: '100%', width: '100%', overflow: 'auto'}}/>
    }
    <Controls/>
  </Box>
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const bg: SxProps<Theme> = {
  bgcolor: 'background.default',
  height: '100vh',
  width: '100vw',
  overflow: 'auto',
  background: 
    `repeating-linear-gradient(
      to right,
      transparent,
      transparent 30px,
      white 30px,
      white 33px
    ),
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 30px,
      white 30px,
      white 33px
    ),
    linear-gradient(135deg, #ddddff, #bbbbd6)`
}