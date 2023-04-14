import { ZoomIn, ZoomOut } from '@mui/icons-material'
import { Box, ButtonGroup, IconButton } from '@mui/material'
import React, { useRef, useEffect } from 'react'
import { useAppState, useAppStateDispatch } from '../AppStateContext'

const zoomLevels = [0.5, 1, 1.5, 2, 2.5, 3]

export default function Controls() {
  const dispatchState = useAppStateDispatch()
  const state = useAppState()

  const zoomIndex = zoomLevels.indexOf(state.zoomLevel)
  const atMax = zoomIndex === zoomLevels.length - 1
  const atMin = zoomIndex === 0

  return <Box sx={{
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 1000,
  }}>
    <ButtonGroup variant="contained" aria-label="contained primary button group" sx={{ backgroundColor: 'white' }}>
      <IconButton onClick={() => dispatchState({ type: 'ZOOM', level: zoomLevels[zoomIndex - 1] })} disabled={atMin}>
        <ZoomOut />
      </IconButton>
      <IconButton onClick={() => dispatchState({ type: 'ZOOM', level: zoomLevels[zoomIndex + 1] })} disabled={atMax}>
        <ZoomIn />
      </IconButton>
    </ButtonGroup>
  </Box>
}