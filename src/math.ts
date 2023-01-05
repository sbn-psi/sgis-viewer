type Point = {x: number, y: number}

function findWidth(top: Point, left: Point) {
  return Math.sqrt(Math.pow(top.x - left.x, 2) + Math.pow(top.y - left.y, 2));
}

function findHeight(left: Point, bottom: Point) {
  let height = Math.sqrt(Math.pow(bottom.x - left.x, 2) + Math.pow(bottom.y - left.y, 2));
  if(bottom.y < left.y) height = -height;
  return height;
}

function findBottomCorner(top: Point, left: Point, height: number) {
  // calculate tilt
  const angle = Math.atan2(left.y - top.y, left.x - top.x);

  return {
    x: left.x - (height * Math.sin(angle)),
    y: left.y + (height * Math.cos(angle))
  }

}

export {findWidth, findHeight, findBottomCorner}