import { POI, Zone } from "./AppState";

export type Point = {x: number, y: number}

function findWidth(top: Point, left: Point) {
  return Math.sqrt(Math.pow(top.x - left.x, 2) + Math.pow(top.y - left.y, 2));
}

function translatePoint(point: Point, newCoordinateSpace: Zone) {
  let angle = Math.atan2(newCoordinateSpace.left.y - newCoordinateSpace.top.y, newCoordinateSpace.left.x - newCoordinateSpace.top.x);
  if(newCoordinateSpace.left.y < newCoordinateSpace.top.y) angle = -angle;

  // normalize point to newCoordinateSpace origin
  point = {
    x: (point.x - newCoordinateSpace.top.x),
    y: (point.y - newCoordinateSpace.top.y),
  }

  // rotate around newCoordinateSpace origin
  const rotatedPoint = {
    x: (point.x) * Math.cos(angle) - (point.y ) * Math.sin(angle),
    y: (point.x) * Math.sin(angle) + (point.y ) * Math.cos(angle),
  }

  // find scaling factor of new coordinate space
  const heightMultiplier = newCoordinateSpace.naturalHeight / newCoordinateSpace.height
  const widthMultiplier = newCoordinateSpace.naturalWidth / findWidth(newCoordinateSpace.top, newCoordinateSpace.left)

  // translate point to newCoordinateSpace origin
  return {
    x: rotatedPoint.x * widthMultiplier,
    y: rotatedPoint.y * heightMultiplier,
  }
}

function intersectsZone(zone: Zone, x: number, y: number, ctx: CanvasRenderingContext2D) {
  if(!(zone.left && zone.top && zone.height)) return false;

  // calculate tilt
  const angle = Math.atan2(zone.left.y - zone.top.y, zone.left.x - zone.top.x);

  const height = zone.height
  const width = findWidth(zone.top, zone.left);

  // set translate (relative origin) and rotation angle for the drawing context so that image has proper tilt
  ctx.save();
  ctx.beginPath();
  ctx.translate(zone.top.x, zone.top.y);
  ctx.rotate(angle);
  ctx.rect(0, 0, width, height);
  
  // apply canvas scale to x and y
  const zoom = ctx.getTransform().a;
  const result = ctx.isPointInPath(x * zoom, y * zoom);
  
  ctx.restore(); // resets to previous state
  return result;
}


function intersectsPOI(poi: POI, x: number, y: number, zone: Zone) {
  const translated = translatePoint({x: poi.x, y: poi.y}, zone);
  const pointerSize = 15;

  return x > translated.x - pointerSize / 2 && x < translated.x + pointerSize / 2 && y > translated.y - pointerSize && y < translated.y;


}

export {findWidth, intersectsZone, intersectsPOI, translatePoint}