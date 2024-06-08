class _renderObject {
  gl;
  canvas;

  primList = [];
  
  constructor (canvasId) {
    this.init(canvasId)
  }

  init (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext("webgl2");

    this.gl.clearColor(0.30, 0.47, 0.8, 1);
  }

  drawFrame() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}

export function renderObject(canvasId) {
  return new _renderObject(canvasId);
}