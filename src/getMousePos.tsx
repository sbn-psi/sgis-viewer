export function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width, // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height; // relationship bitmap vs. element for y

  let x = (evt.clientX - rect.left) * scaleX
  let y = (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element

  return translateMousePos(x, y, canvas.getContext('2d')!.getTransform())
}

function translateMousePos(x: number, y: number, transform: DOMMatrix) {

  let inverted = transform.invertSelf()

  return {
    x: x * inverted.a + y * inverted.c + inverted.e,
    y: x * inverted.b + y * inverted.d + inverted.f
  }
  
}