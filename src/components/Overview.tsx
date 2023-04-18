import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';
import { useAppState, useAppStateDispatch } from '../AppStateContext';
import { useAppCanvas } from '../CanvasContext';
import { getMousePos } from '../getMousePos';
import { AppState, Zone } from '../AppState';
import { Box } from '@mui/material';
import { findWidth, intersectsZone, Point } from '../math';

import data from '../data.json';
const { pois } = data as { pois: Point[] };

export function Overview({ sx }: { sx: any }) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const img = useRef<HTMLImageElement>(null);
  const state: AppState = useAppState();
  const dispatchState = useAppStateDispatch();
  const canvas = useAppCanvas();
  let drawContext = canvas?.getContext('2d');

  // setup click handlers for canvas
  useEffect(() => {
    document.body.style.cursor = 'default';

    const clickHandler = (x: number, y: number) => {
      for (let zone of state.zones) {
        if (intersectsZone(zone, x, y, drawContext)) {
          dispatchState({ type: 'SELECTED_ZONE', zone })
          return
        }
      }
    };

    const mouseMoveHandler = (x: number, y: number) => {
      for (let zone of state.zones) {
        if (intersectsZone(zone, x, y, drawContext)) {
          document.body.style.cursor = 'pointer';
          return
        }
      }
      document.body.style.cursor = 'default';
    };

    if (!!canvas) {
      // set up click handling
      const clickListener = (event: MouseEvent) => {
        let pos = getMousePos(canvas, event);
        clickHandler(pos.x, pos.y);
      };
      canvas.addEventListener('mousedown', clickListener);

      // set up cursor pointer handling
      const mouseMoveListener = (event: MouseEvent) => {
        let pos = getMousePos(canvas, event);
        mouseMoveHandler(pos.x, pos.y);
      };
      canvas.addEventListener('mousemove', mouseMoveListener);

      return () => {
        //cleanup
        canvas?.removeEventListener('mousedown', clickListener);
        canvas?.removeEventListener('mousemove', mouseMoveListener);
      };
    }
  }, [canvas, state.zoomLevel]);

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
    redraw(drawContext, { state, img });
  }


  return <Box sx={sx}>
    <img ref={img} src={state.overview!.url} style={{ display: 'none' }} crossOrigin="anonymous" />
    {state.zones.map((zone: Zone) => <img id={zone.name} key={zone.name} src={zone.url} style={{ display: 'none' }} crossOrigin="anonymous" />)}
    <Canvas width={width} height={height} redraw={redraw} redrawProps={{state, img}}/>
  </Box>;

}

function redraw(drawContext: CanvasRenderingContext2D, props: any) {
  const { state, img } = props;

  // overview image
  drawContext.drawImage(img.current!, 0, 0);

  // mapped zones
  for (let zone of state.zones) {
    drawZone(zone, drawContext);
  }

  // points
  for (let poi of pois) {
    drawPoi(poi, drawContext);
  }
}

function drawZone(zone: Zone, ctx: CanvasRenderingContext2D) {
  if (!(zone.left && zone.top && zone.height)) return;

  // calculate tilt
  const angle = Math.atan2(zone.left.y - zone.top.y, zone.left.x - zone.top.x);

  const height = zone.height
  const width = findWidth(zone.top, zone.left);

  // set translate (relative origin) and rotation angle for the drawing context so that image has proper tilt
  ctx.save();
  ctx.translate(zone.top.x, zone.top.y);
  ctx.rotate(angle);
  // ctx.drawImage((document.getElementById(zone.name) as HTMLImageElement)!, 0, 0, width, height);
  ctx.strokeStyle = "#1976d2";
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  // ctx.rect(0, 0, width, height);
  const x = 0;
  const y = 0;
  const cornerRadius = 3;
  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + width - cornerRadius, y);
  ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
  ctx.lineTo(x + width, y + height - cornerRadius);
  ctx.arcTo(x + width, y + height, x + width - cornerRadius, y + height, cornerRadius);
  ctx.lineTo(x + cornerRadius, y + height);
  ctx.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = 'rgba(25, 118, 210, 0.2)';
  ctx.fill();
  ctx.stroke();

  ctx.restore(); // resets to previous state

}


function drawPoi(poi: any, ctx: CanvasRenderingContext2D) {
  const pointerX = poi.x;
  const pointerY = poi.y;
  const triangleSize = 10;

  // Draw the triangle pointer
  ctx.beginPath();
  ctx.moveTo(pointerX, pointerY);
  ctx.lineTo(pointerX - triangleSize / 2, pointerY - triangleSize );
  ctx.lineTo(pointerX + triangleSize / 2, pointerY - triangleSize );
  ctx.closePath();
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.fillStyle = 'lightgreen';
  ctx.fill();
}
