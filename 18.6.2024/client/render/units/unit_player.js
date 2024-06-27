import { mat4 } from "../../math/mat4";
import { vec3 } from "../../math/vec3";
import { Platon, planePrim } from "../res/figures";
import { image } from "../res/image";
import { materialPattern } from "../res/material_pattern";
import { material } from "../res/materials";
import { prim } from "../res/prim";
import { texture } from "../res/textures";
import { _unit } from "./units";

export class _unitPlayer extends _unit {
  prim;
  pos;
  oldPos;
  curPos;
  interval;
  intervalStart;
  id;
  rnd;
  testPlane;

  static myPlayerMaterial = null;
  static hpBarMaterial = null;
  static enemyPlayerMaterial = null;
  static enemyPlayerMaterialPattern = null;
  static hpBarPrim = null;  

  constructor(rnd, id, playerName) {
      super(
        "Player " + id.toString(),
        unitInit,
        unitResponse,
        unitRender,
        unitClose
    );
    this.rnd = rnd;
    this.id = id;
    this.playerName = playerName;
    this.deads = 0;
    this.kills = 0;
  }
}

function unitInit() {
  if (_unitPlayer.enemyPlayerMaterial == null) {
    _unitPlayer.enemyPlayerMaterial = material(
      this.rnd.defaultMaterialPattern,
      {
        "ka":vec3(0.90, 0.08, 0.30),
        "kd":vec3(0.8, 0.1, 0.1),
        "ks":vec3(0.727811, 0.626959, 0.626959),
        "ph":76.8,
        "trans":0,
      },
    "enemyPlayerMaterial");
  }

  this.prim = Platon.dodecCreate(_unitPlayer.enemyPlayerMaterial, 0.47 / 2);
  this.pos = vec3(0);
  this.oldPos = vec3(0);
  this.interval = 50;
}

function unitResponse() {
  let d = (this.rnd.anim.timer.globalTime - this.intervalStart) * 1000 / this.interval;

  this.curPos = this.oldPos.mulNum(1 - d).addVec(this.pos.mulNum(d));
}

function unitRender() {
  this.rnd.drawPrim(this.prim, mat4().translate(this.curPos));
}

function unitClose() {
  // do nothing
}

export function unitPlayer(rnd, id, playerName) {
  return new _unitPlayer(rnd, id, playerName);
}