import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';
import { useAppCanvas } from '../CanvasContext';
import { getMousePos } from '../getMousePos';
import { AppState, POI, Zone } from '../AppState';
import { Box, Drawer } from '@mui/material';
import {intersectsPOI, intersectsZone, Point, translatePoint} from '../math' ;
import data from '../data.json';
import { useAppState, useAppStateDispatch } from '../AppStateContext';
const { pois } = data as {pois: POI[]};

export function ZoneCanvas({zone, sx}: {zone: Zone, sx: any}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const img = useRef<HTMLImageElement>(null);
  const canvas = useAppCanvas();
  let drawContext = canvas?.getContext('2d');
  const dispatchState = useAppStateDispatch()

  // setup click handlers for canvas
  useEffect(() => {
    const clickHandler = (x: number, y: number) => {
      for(let poi of pois) {
        if (intersectsPOI(poi, x, y, zone)) {
          dispatchState({type: 'SELECTED_POI', poi })
          return
        }
      }
    };

    if (!!canvas) {
      // set up click handling
      const clickListener = (event: MouseEvent) => {
        let pos = getMousePos(canvas, event);
        clickHandler(pos.x, pos.y);
      };
      canvas.addEventListener('mousedown', clickListener);

      return () => {
        //cleanup
        canvas?.removeEventListener('mousedown', clickListener);
      };
    }
  }, [canvas]);

  // setup image load listener so we rerender when it happens
  useEffect(() => {
    const listener = () => {
      setLoaded(true);
    };
    img.current!.addEventListener('load', listener);

    return function cleanup() {
      img.current?.removeEventListener('load', listener);
    };
  }, []);

  const width = img.current?.naturalWidth || 1000;
  const height = img.current?.naturalHeight || 1000;

  // draw the current state
  if (loaded && drawContext) {
    // overview image
    drawContext.drawImage(img.current!, 0, 0);

    // points
    for(let poi of pois) {
      if(intersectsZone(zone, poi.x, poi.y, drawContext)) {
        let point = translatePoint(poi, zone);
        drawPoi(point, drawContext);
      }
    }
  }


  return <Box sx={sx}>
    <img ref={img} src={zone.url} style={{ display: 'none' }} crossOrigin="anonymous" />
    <Canvas width={width} height={height} />
    <Details />
  </Box>;
}

function Details() {
  const state:AppState = useAppState()
  const dispatchState = useAppStateDispatch()
  const poi = state.selectedPOI

  return <Drawer
    anchor='right'
    open={!!poi}
    onClose={() => dispatchState({type: 'UNSELECTED_POI' })}
  >
    <DrawerContents poi={poi} />
  </Drawer>
}

function DrawerContents({poi}: {poi: POI}) {
  if(!poi) return null

  return <div style={{minWidth: 300, padding: 10}}>
    <h1>{poi.name}</h1>
    {Object.entries(poi.data).map(([key, value]) => {
      return <div key={key}>
        <h3>{key}</h3>
        <p>{value + ""}</p>
      </div>
    })}
  </div>
}

function drawPoi(poi: any, context: CanvasRenderingContext2D) {
  context.beginPath();
  context.arc(poi.x, poi.y, 5, 0, 5 * Math.PI);
  context.strokeStyle = 'green';
  context.stroke();
  context.fillStyle = 'lightgreen'
  context.fill();
}
