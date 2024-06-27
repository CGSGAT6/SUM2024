import { camera } from "../math/camera.js";
import { mat4 } from "../math/mat4.js";
import { vec3 } from "../math/vec3.js";
import { input } from "./input.js";
import { ubo_buffer } from "./res/buffers.js";
import { materialPattern } from "./res/material_pattern.js";
import { material } from "./res/materials.js";
import { renderTarget } from "./target.js";
import { Timer } from "./timer.js";


const primUBOBindingPoint = 0;
const frameUBOBindingPoint = 2;

class _renderObject {
  anim;

  gl;
  target0;
  canvas;
  mainCam;
  timer;
  primUBO;
  frameUBO;

  primList = [];

  defaultMaterialPattern;
  defaultMaterial;

  input;

  depthExt;

  constructor (anim, canvasId) {
    this.anim = anim;

    this.init(canvasId)
  }

  updateFrameUBO() {
    let data = [].concat(
      this.mainCam.loc.toArray4(this.anim.timer.localTime),
      this.mainCam.at.toArray4(this.anim.timer.localDeltaTime),
      this.mainCam.dir.toArray4(this.anim.timer.globalTime),
      this.mainCam.right.toArray4(this.anim.timer.globalDeltaTime),
      this.mainCam.up.toArray4(this.anim.timer.FPS),      
    );

    this.frameUBO.update(new Float32Array(data));
  }

  init (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext("webgl2");
    this.gl.getExtension("OES_texture_float");
    //this.depthExt = this.gl.getExtension("WEBGL_depth_texture");

    this.mainCam = camera();

    this.gl.enable(this.gl.DEPTH_TEST);
    const date = new Date();
    this.time = this.startTime = date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000;
    this.deltaTime = 0;

    //this.gl.clearColor(0.30, 0.47, 0.8, 1);
    this.gl.clearColor(19 / 255, 7 / 255, 54 / 255, 1);

    this.primUBO = ubo_buffer(this, "PrimUBO", 16 * 4 * 5, primUBOBindingPoint);
    this.frameUBO = ubo_buffer(this, "FrameUBO", 80, frameUBOBindingPoint);

    this.defaultMaterialPattern = materialPattern("fst", "default", this);
    this.defaultMaterial = material(
      this.defaultMaterialPattern,
      {
        "ka":vec3(0.47, 0.30, 0.7),
        "kd":vec3(0.7, 0.6, 0.1),
        "ks":vec3(0.727811, 0.626959, 0.626959),
        "ph":76.8,
        "trans":0,
      },
    "defMtl");

    this.target0 = renderTarget(
      this,
      [
        "Color",
        "Normal",
        "Pos",
        "Ka",
        "Kd",
        "Ks",
      ],
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      true,
    );
    // this.input = new input(this);
  }

  drawFrame() {
    this.target0.start();
    this.updateFrameUBO();
    //this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  drawPrim(p, m) {
    if (p.material.mtlPtn.shd.id == null) {
      return;
    } else if (p.createData != null) {
      p.create();
    }

    p.material.apply();

    //let mW = mat4().rotateY(47 * this.time);
    let mW;
    if (m == undefined)
      mW = mat4();//.rotate(47 * this.time, vec3(1, 1, 1).normalize());
    else
      mW = mat4(m);
    
    let mWVP = mW.mulMatr(this.mainCam.matrVP);
    let mWInv = mW.inverse().transpose();

    /*
    if (p.primMtlPtn.shd.uniforms["MatrWVP"] != undefined)
      this.gl.uniformMatrix4fv(p.primMtlPtn.shd.uniforms["MatrWVP"].loc, false, new Float32Array(mWVP.toArray()));
    if (p.primMtlPtn.shd.uniforms["MatrW"] != undefined) 
      this.gl.uniformMatrix4fv(p.primMtlPtn.shd.uniforms["MatrW"].loc, false, new Float32Array(mW.toArray()));
    if (p.primMtlPtn.shd.uniforms["MatrWInv"] != undefined)
      this.gl.uniformMatrix4fv(p.primMtlPtn.shd.uniforms["MatrWInv"].loc, false, new Float32Array(mWInv.toArray()));
    */

    /*if (p.material.mtlPtn.shd.uniforms["Time"] != undefined)
      this.gl.uniform1f(p.material.mtlPtn.shd.uniforms["Time"].loc, this.timer.localTime);*/

    let data = [].concat(mW.toArray(), this.mainCam.matrVP.toArray(), mWVP.toArray(), mWInv.toArray(), this.mainCam.matrView.toArray());
    this.primUBO.update(new Float32Array(data));
    this.primUBO.apply(p.material.mtlPtn.shd);
    this.frameUBO.apply(p.material.mtlPtn.shd);


    this.gl.bindVertexArray(p.vertexArray);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, p.vertexBuffer);
    if (p.indexBuffer != undefined) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, p.indexBuffer);

      this.gl.drawElements(p.type, p.noofI, this.gl.UNSIGNED_INT, 0);
    } else {
      this.gl.drawArrays(p.type, 0, p.noofV);
    }
  }

  resize() {
    const displayWidth  = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;
    
    const needResize = this.canvas.width  !== displayWidth ||
                       this.canvas.height !== displayHeight;
    
    if (needResize) {
      this.canvas.width  = displayWidth;
      this.canvas.height = displayHeight;
      
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

      this.mainCam.setSize(displayWidth, displayHeight);

      this.target0.resize(this.canvas.width, this.canvas.height);
    }
  }

  frameEnd() {
    this.target0.end();
  }
}

export function renderObject(anim, canvasId) {
  return new _renderObject(anim, canvasId);
}