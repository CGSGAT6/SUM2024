import { mat4 } from "../../math/mat4";
import { vec3 } from "../../math/vec3";
import { Platon } from "../res/figures";
import { material } from "../res/materials";
import { _unitPlayer } from "./unit_player";

class _unitMyPlayer extends _unitPlayer {
  move;
  socket;

  constructor(rnd, socket, id){
    super(rnd, id);

    this.socket = socket;
    this.init = unitInit;
    this.response = unitResponse;
    this.render = unitRender;
  }
}

function unitInit() {
  if (_unitPlayer.myPlayerMaterial == null) {
    _unitPlayer.myPlayerMaterial = material(
      this.rnd.defaultMaterialPattern,
      {
        "ka":vec3(0.09, 0.80, 0.30),
        "kd":vec3(0.1, 0.6, 0.1),
        "ks":vec3(0.727811, 0.626959, 0.626959),
        "ph":76.8,
        "trans":0,
      },
    "myPlayerMaterial");
  }

  this.prim = Platon.truncedIcoCreate(_unitPlayer.myPlayerMaterial, 0.47 / 2);
  this.pos = vec3(0);
  this.oldPos = vec3(0);
  this.interval = 50;
}

function unitResponse() {

  let x = (this.rnd.anim.input.keys["ArrowRight"] - this.rnd.anim.input.keys["ArrowLeft"]) * 0.30 / 4;
  let y = (this.rnd.anim.input.keys["ArrowUp"] - this.rnd.anim.input.keys["ArrowDown"]) * 0.30 / 4;
  let z = -(this.rnd.anim.input.keys["PageUp"] - this.rnd.anim.input.keys["PageDown"]) * 0.30 / 4;

  this.move = vec3(x, y, z);

  if (x != 0 || y != 0 || z != 0)
    if (this.socket.readyState == 1)
      this.socket.send(
        JSON.stringify({
          id:this.id,
          type:"move",
          move:this.move,
        })
      );


  let d = (this.rnd.anim.timer.globalTime - this.intervalStart) * 1000 / this.interval;

  this.curPos = this.oldPos.mulNum(1 - d).addVec(this.pos.mulNum(d));
}

function unitRender() {
  this.rnd.drawPrim(this.prim, mat4().translate(this.curPos));
}

export function unitMyPlayer(rnd, socket, id) {
  return new _unitMyPlayer(rnd, socket, id);
}