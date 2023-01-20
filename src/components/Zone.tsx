import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';
import { useAppCanvas } from '../CanvasContext';
import { getMousePos } from '../getMousePos';
import { Zone } from '../AppState';
import { Box } from '@mui/material';
import {intersectsZone, Point, translatePoint} from '../math' ;
import data from '../data.json';
const { pois } = data as {pois: Point[]};

export function ZoneCanvas({zone, sx}: {zone: Zone, sx: any}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const img = useRef<HTMLImageElement>(null);
  const canvas = useAppCanvas();
  let drawContext = canvas?.getContext('2d');

  // setup click handlers for canvas
  useEffect(() => {
    const clickHandler = (x: number, y: number) => {
      // for(let zone of state.zones) {
      //   if (intersectsZone(zone, x, y, drawContext)) {
      //     dispatchState({type: 'SELECTED_ZONE', zone })
      //     return
      //   }
      // }
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
    let index = 0
    for(let poi of pois) {
      if(intersectsZone(zone, poi.x, poi.y, drawContext)) {
        let point = translatePoint(poi, zone);
        console.log(point)
        drawPoi(point, drawContext, index);
        index++;
      }
    }
  }


  return <Box sx={sx}>
    <img ref={img} src={zone.url} style={{ display: 'none' }} crossOrigin="anonymous" />
    <Canvas width={width} height={height} />
  </Box>;
}

function drawPoi(poi: any, context: CanvasRenderingContext2D, index: number) {
  context.beginPath();
  context.arc(poi.x, poi.y, 5, 0, 5 * Math.PI);
  context.strokeStyle = 'green';
  context.stroke();
  context.fillStyle = `rgba(0, ${50*index + 50}, 0)`;
  context.fill();
}