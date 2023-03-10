import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';
import { useAppState, useAppStateDispatch } from '../AppStateContext';
import { useAppCanvas } from '../CanvasContext';
import { getMousePos } from '../getMousePos';
import { AppState, Zone } from '../AppState';
import { Box } from '@mui/material';
import {findWidth, intersectsZone, Point} from '../math' ;

import data from '../data.json';
const { pois } = data as {pois: Point[]};

export function Overview({sx}: {sx: any}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const img = useRef<HTMLImageElement>(null);
  const state:AppState = useAppState();
  const dispatchState = useAppStateDispatch();
  const canvas = useAppCanvas();
  let drawContext = canvas?.getContext('2d');

  // setup click handlers for canvas
  useEffect(() => {
    const clickHandler = (x: number, y: number) => {
      for(let zone of state.zones) {
        if (intersectsZone(zone, x, y, drawContext)) {
          dispatchState({type: 'SELECTED_ZONE', zone })
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

    // mapped zones
    for(let zone of state.zones) {
      drawZone(zone, drawContext);
    }


    // points
    for(let poi of pois) {
      drawPoi(poi, drawContext);
    }
  }


  return <Box sx={sx}>
    <img ref={img} src={state.overview!.url} style={{ display: 'none' }} crossOrigin="anonymous" />
    {state.zones.map((zone: Zone) => <img id={zone.name} key={zone.name} src={zone.url} style={{ display: 'none' }} crossOrigin="anonymous" />)}
    <Canvas width={width} height={height} />
  </Box>;

}
function drawZone(zone: Zone, ctx: CanvasRenderingContext2D) {
  if(!(zone.left && zone.top && zone.height)) return;

  // calculate tilt
  const angle = Math.atan2(zone.left.y - zone.top.y, zone.left.x - zone.top.x);

  const height = zone.height
  const width = findWidth(zone.top, zone.left);
  
  // set translate (relative origin) and rotation angle for the drawing context so that image has proper tilt
  ctx.save();
  ctx.translate(zone.top.x, zone.top.y);
  ctx.rotate(angle);
  ctx.drawImage((document.getElementById(zone.name) as HTMLImageElement)!, 0, 0, width, height);
  // ctx.strokeStyle = "#43FF33";
  // ctx.rect(0, 0, width, height);
  // ctx.stroke();
  
  ctx.restore(); // resets to previous state
  
}


function drawPoi(poi: any, context: CanvasRenderingContext2D) {
  context.beginPath();
  context.arc(poi.x, poi.y, 5, 0, 5 * Math.PI);
  context.strokeStyle = 'green';
  context.stroke();
  context.fillStyle = 'lightgreen'
  context.fill();
}
