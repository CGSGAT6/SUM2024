import { mat4 } from "../../math/mat4";
import { vec3 } from "../../math/vec3";
import { Platon, planePrim } from "../res/figures";
import { image } from "../res/image";
import { material } from "../res/materials";
import { texture } from "../res/textures";
import { _unit } from "./units";

export class _unitBullet extends _unit {
  prim;
  pos;
  oldPos;
  curPos;
  interval;
  intervalStart;
  rnd;
  handlePlauer;
  dir;
  vel;

  static BulletMaterial = null;

  constructor(rnd, pos, dir) {
    super(
      "Bullet",
      unitInit,
      unitResponse,
      unitRender,
      unitClose
    );
    this.rnd = rnd;
    this.pos = vec3(pos);
    this.oldPos = vec3(pos);
    this.dir = vec3(dir);
  }
}

function unitInit() {
  if (_unitBullet.BulletMaterial == null) {
    _unitBullet.BulletMaterial = material(
      this.rnd.defaultMaterialPattern,
      {
        "ka":vec3(0.01, 0.08, 0.90),
        "kd":vec3(0.01, 0.6, 0.90),
        "ks":vec3(0.727811, 0.626959, 0.626959),
        "ph":76.8,
        "trans":0,
      },
    "bulletMaterial");
  }

  this.prim = Platon.octCreate(_unitBullet.BulletMaterial, 0.47 / 8);
  this.interval = 50;
  this.vel = 10;
}

function unitResponse() {
  let d = (this.rnd.anim.timer.globalTime - this.intervalStart) * 1000 / this.interval;

  this.curPos = this.oldPos.mulNum(1 - d).addVec(this.pos.mulNum(d));
}

function unitRender() {
  this.rnd.drawPrim(this.prim, mat4().translate(this.curPos));
  // this.rnd.drawPrim(this.prim, mat4());
}

function unitClose() {
  // do nothing
}

export function unitBullet(rnd, pos, dir) {
  return new _unitBullet(rnd, pos, dir);
}