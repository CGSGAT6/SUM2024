import { camera } from "../math/camera.js";
import { mat4 } from "../math/mat4.js";

class _renderObject {
  gl;
  canvas;
  mainCam;
  startTime;
  time;

  primList = [];
  
  constructor (canvasId) {
    this.init(canvasId)
  }

  init (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext("webgl2");
    this.mainCam = camera();

    this.gl.enable(this.gl.DEPTH_TEST);
    const date = new Date();
    this.time = this.startTime = date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000;

    this.gl.clearColor(0.30, 0.47, 0.8, 1);

  }

  drawFrame() {
    const date = new Date();
    this.time = date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000 - this.startTime;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  drawPrim(p) {
    p.primMtlPtn.shd.apply();

    let glType;

    if (p.type == "triangles")
      glType = this.gl.TRIANGLES;
    else if (p.type == "triangle strip")
      glType = this.gl.TRIANGLE_STRIP;
    else if (p.type == "line strip")
      glType = this.gl.LINE_STRIP;
    else
      glType = this.gl.POINTS;
    

    let mW = mat4().rotateY(47 * this.time);
    let mWVP = mW.mulMatr(this.mainCam.matrVP);
    let mWInv = mW.inverse().transpose();

    if (p.primMtlPtn.shd.uniforms["MatrWVP"] != undefined)
      this.gl.uniformMatrix4fv(p.primMtlPtn.shd.uniforms["MatrWVP"].loc, false, new Float32Array(mWVP.toArray()));
    if (p.primMtlPtn.shd.uniforms["MatrW"] != undefined) 
      this.gl.uniformMatrix4fv(p.primMtlPtn.shd.uniforms["MatrW"].loc, false, new Float32Array(mW.toArray()));
    if (p.primMtlPtn.shd.uniforms["MatrWInv"] != undefined)
      this.gl.uniformMatrix4fv(p.primMtlPtn.shd.uniforms["MatrWInv"].loc, false, new Float32Array(mWInv.toArray()));
    if (p.primMtlPtn.shd.uniforms["Time"] != undefined)
      this.gl.uniform1f(p.primMtlPtn.shd.uniforms["Time"].loc, this.time);

    this.gl.bindVertexArray(p.vertexArray);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, p.vertexBuffer);
    if (p.indexBuffer != undefined) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, p.indexBuffer);

      this.gl.drawElements(glType, p.noofI, this.gl.UNSIGNED_INT, 0);
    } else {
      this.gl.drawArrays(glType, 0, p.noofV);
    }
  }
}

export function renderObject(canvasId) {
  return new _renderObject(canvasId);
}