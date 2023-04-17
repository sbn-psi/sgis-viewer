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
  const [ourPois, setOurPois] = useState<POI[]>([]);
  const img = useRef<HTMLImageElement>(null);
  const canvas = useAppCanvas();
  let drawContext = canvas?.getContext('2d');
  const dispatchState = useAppStateDispatch()
  const state:AppState = useAppState()

  // setup click handlers for canvas
  useEffect(() => {
    document.body.style.cursor = 'default';
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

      // set up cursor pointer handling
      const mouseMoveListener = (event: MouseEvent) => {
        let pos = getMousePos(canvas, event);
        for(let poi of pois) {
          if (intersectsPOI(poi, pos.x, pos.y, zone)) {
            document.body.style.cursor = 'pointer';
            return
          }
        }
        document.body.style.cursor = 'default';
      };
      canvas.addEventListener('mousemove', mouseMoveListener);

      return () => {
        //cleanup
        canvas?.removeEventListener('mousedown', clickListener);
        canvas?.removeEventListener('mousemove', mouseMoveListener);
      };
    }
  }, [canvas]);

  useEffect(() => {
    // setup image load listener so we rerender when it happens
    const listener = () => {
      setLoaded(true);
    };
    img.current!.addEventListener('load', listener);

    let zonePois = []
    for(let poi of pois) {
      if(intersectsZone(zone, poi.x, poi.y, drawContext)) {
        zonePois.push(poi)
      }
    }
    setOurPois(zonePois)

    return function cleanup() {
      img.current?.removeEventListener('load', listener);
    };
  }, []);

  const width = img.current?.naturalWidth || 1000;
  const height = img.current?.naturalHeight || 1000;

  // draw the current state
  if (loaded && drawContext) {
    redraw(drawContext, {state, zone, ourPois, img});
  }


  return <Box sx={sx}>
    <img ref={img} src={zone.url} style={{ display: 'none' }} crossOrigin="anonymous" />
    <Canvas width={width} height={height} redraw={redraw} redrawProps={{state, zone, ourPois, img}}/>
    <Details />
  </Box>;
}

function redraw(context: CanvasRenderingContext2D, props: any) {
  const { state, zone, ourPois, img } = props;
  // overview image
  context.drawImage(img.current!, 0, 0);

  // points
  for(let poi of ourPois) {
    let point = translatePoint(poi, zone);
    drawPoi(point, context);
  }
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
  // console.log('drawPoi', poi)

  context.beginPath();
  context.arc(poi.x, poi.y, 5, 0, 2 * Math.PI);
  context.strokeStyle = 'black';
  context.stroke();
  context.arc(poi.x, poi.y, 4, 0, 4 * Math.PI);
  context.strokeStyle = 'white';
  context.stroke();
  context.fillStyle = 'lightgreen'
  context.fill();
}
