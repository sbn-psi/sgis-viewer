import React, {useRef, useEffect} from 'react'
import { useAppState } from '../AppStateContext';
import { useAppCanvasDispatch } from '../CanvasContext';

type CanvasProps = {
  width: number,
  height: number,
  redraw?: (context: CanvasRenderingContext2D, props: any) => void
  redrawProps?: any
};

function Canvas({ width, height, redraw, redrawProps }: CanvasProps) {  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef.current
  const ctx = canvas?.getContext('2d')
  const dispatch = useAppCanvasDispatch()
  const state = useAppState()
  
  useEffect(() => {
    
    if(canvas && ctx) {
      dispatch(canvas)
      
      // set up scaling
      let { devicePixelRatio:ratio=1 } = window

      ratio *= state.zoomLevel

      canvas.width = width*ratio
      canvas.height = height*ratio
      ctx.scale(ratio, ratio)
      
      redraw && redraw(ctx, redrawProps)
    } 

  }, [ctx, canvas, width, height, state.zoomLevel])
  
  return <canvas width={width * state.zoomLevel} height={height * state.zoomLevel} ref={canvasRef}>
    Your browser does not support canvas, please use another
  </canvas>
}

export default React.memo(Canvas, compareProps)

function compareProps(prevProps: CanvasProps, nextProps: CanvasProps) {
  return prevProps.width === nextProps.width && prevProps.height === nextProps.height
}