import { mat4 } from "../../math/mat4";
import { vec3 } from "../../math/vec3";
import { Platon } from "../res/figures";
import { _unit } from "./units";

class _unitPlayer extends _unit {
  prim;
  pos;
  oldPos;
  curPos;
  interval;
  intervalStart;
  id;
  rnd;

  constructor(rnd, id) {
    super(
      "Player " + id.toString(),
      unitInit,
      unitResponse,
      unitRender,
      unitClose
  );
  this.rnd = rnd;

  }
}

function unitInit() {
  this.prim = Platon.cubeCreate(this.rnd.defaultMaterial, 0.47 / 2);
  this.pos = vec3(0);
  this.oldPos = vec3(0);
  this.interval = 50;
}

function unitResponse() {
  let d = (this.rnd.timer.globalTime - this.intervalStart) * 1000 / this.interval;

  this.curPos = this.oldPos.mulNum(1 - d).addVec(this.pos.mulNum(d));
}

function unitRender() {
  this.rnd.drawPrim(this.prim, mat4().translate(this.curPos));
}

function unitClose() {
  // do nothing
}

export function unitPlayer(rnd, id) {
  return new _unitPlayer(rnd, id);
}