import { mat4 } from "../../math/mat4";
import { vec3 } from "../../math/vec3";
import { Platon } from "../res/figures";

class _unitMyPlayer extends _unitPlayer {
  move;

  constructor(rnd, id){
    super(rnd, id);

    this.init = unitInit;
    this.response = unitResponse;
    this.render = unitRender;
  }
}

function unitInit() {
  this.prim = Platon.truncedIcoCreate(this.rnd.defaultMaterial, 0.47);
  this.pos = vec3(0);
  this.oldPos = vec3(0);
  this.interval = 50;
}

function unitResponse() {

  x = (this.rnd.input.keys["ArrowRight"] - this.rnd.input.keys["ArrowLeft"]) * 0.30 / 4;
  y = (this.rnd.input.keys["ArrowUp"] - this.rnd.input.keys["ArrowDown"]) * 0.30 / 4;
  z = -(this.rnd.input.keys["PageUp"] - this.rnd.input.keys["PageDown"]) * 0.30 / 4;

  this.move = vec3(x, y, z);

  let d = (this.rnd.timer.globalTime - this.intervalStart) * 1000 / this.interval;

  this.curPos = this.oldPos.mulNum(1 - d).addVec(this.pos.mulNum(d));
}

function unitRender() {
  this.rnd.drawPrim(this.prim, mat4().translate(this.curPos));
}