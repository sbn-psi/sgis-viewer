import React, {useRef, useEffect} from 'react'
import { useAppCanvasDispatch } from '../CanvasContext';

type CanvasProps = {
  width: number,
  height: number
};

function Canvas({ width, height }: CanvasProps) {  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef.current
  const ctx = canvas?.getContext('2d')
  const dispatch = useAppCanvasDispatch()
  
  useEffect(() => {
    
    if(canvas && ctx) {
      dispatch(canvas)
  
      // set up scaling
      const { devicePixelRatio:ratio=1 } = window
      canvas.width = width*ratio
      canvas.height = height*ratio
      ctx.scale(ratio, ratio)

    } 

  }, [ctx, canvas, width, height])
  
  return <canvas width={width} height={height} ref={canvasRef}>
    Your browser does not support canvas, please use another
  </canvas>
}

export default React.memo(Canvas, compareProps)

function compareProps(prevProps: CanvasProps, nextProps: CanvasProps) {
  return prevProps.width === nextProps.width && prevProps.height === nextProps.height
}