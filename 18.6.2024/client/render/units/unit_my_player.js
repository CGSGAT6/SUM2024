import { mat4 } from "../../math/mat4";
import { vec3 } from "../../math/vec3";
import { Platon } from "../res/figures";
import { material } from "../res/materials";
import { _unitPlayer } from "./unit_player";

class _unitMyPlayer extends _unitPlayer {
  move;
  socket;
  dir;
  dirPrim;
  angle = 0;
  oldM;  
  lastShot = 0;
  statTable;
  move = vec3(0);
  ammo = 5;
  isReload = false;
  isRes = false;
  oldHealth = 3;

  constructor(rnd, socket, id, playerName){
    super(rnd, id, playerName);

    this.socket = socket;
    this.init = unitInit;
    this.response = unitResponse;
    this.render = unitRender;
  }
}

function unitInit() {
  this.rnd.canvas.addEventListener("click", () => {this.rnd.canvas.requestPointerLock();});

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
  this.dirPrim = Platon.icoCreate(this.rnd.defaultMaterial, 0.1);
  this.pos = vec3(0);
  this.oldPos = vec3(0);
  this.interval = 50;
  this.dir = vec3(0, 1, 0);

  this.oldM = vec3(0);
  this.statTable = document.getElementById("stats");
  this.isRes = false;

  $("#deads td").last().text(this.deads);
  $("#kills td").last().text(this.kills);

  setInterval(() => {
    if (this.move.x != 0 || this.move.y != 0)
      if (this.socket.readyState == 1)
        this.socket.send(
          JSON.stringify({
            id:this.id,
            type:"move",
            move:this.move,
            name:this.playerName,
          })
        );  

    this.move = vec3(0);
  }, 5);
}

function unitResponse() {
  
  if (this.isDead) {
    this.isRes = true; 
    this.oldPos = vec3(0);
    this.ammo = 5;
    $("#died_field").fadeIn("slow");
    $("#die_timer").text("5");
    $("#stats").hide(0);
    let i = 5;
    let id = setInterval(() => {
      i--
      $("#die_timer").text(i);
    }, 1000);

    setTimeout(() => {
      $("#died_field").fadeOut("slow");
      this.isRes = false;
      clearInterval(id);
      $("#stats").show(0);
      this.health = 3;
      $("#health td").last().text(this.health);  
    }, 4000);
  }
  if (this.isDead) {
    $("#deads td").last().text(this.deads);
  }
  if (this.isKill) {  
    $("#kills td").last().text(this.kills);
  }
  if (this.oldHealth != this.health) {
    $("#health td").last().text(this.health);
  }

  if (this.isRes) {
    return;
  }

  if (this.rnd.anim.input.keysClick["Space"]) {
    if (this.lastShot == false && this.ammo > 0)
      if (this.socket.readyState == 1) {
        this.socket.send(
          JSON.stringify({
            id:this.id,
            type:"bulletAdd",
            pos:this.curPos.addVec(this.dir),
            dir:this.dir,
            name:this.playerName,
          })
        );
        this.lastShot = true;
        this.ammo--;
        $("#ammo td").last().text(this.ammo);
      }
  } else {
    this.lastShot = false;
  }

  if (this.ammo <= 0 && !this.isReload) {
    this.isReload = true;
    let i = 5;
    $("#reload").fadeIn("fast");
    $("#reload").text("Ammo reloading " + i);
    let id = setInterval(() => {
      i--;
      $("#reload").text("Ammo reloading " + i);
    }, 1000);
    setTimeout(() => {
      this.ammo = 5;
      $("#ammo td").last().text(this.ammo);
      this.isReload = false;
      $("#reload").fadeOut("fast");
      clearInterval(id);
    }, 5000);
  }

  /*
  let oldM = vec3(0, 1, 0);
  let newM = vec3(this.rnd.anim.input.mDx, this.rnd.anim.input.mDy, 0).normalize();
  this.rnd.anim.input.mDx = this.rnd.anim.input.mDy = 0;
  //console.log(newM);

  let cos = oldM.dot(newM);
  if (cos > 1)
    cos = 1;
  else if (cos < -1)
    cos = -1;

  let newAngle = Math.acos(cos);

  let cross = oldM.cross(newM);

  let sign;

  if (cross.z < 0) {
    sign = 1;
  } else if (cross.z > 0) {
    sign = -1;
  } else {
    sign = 0;
  }

  let angl = -newAngle * sign;*/
  let angl = 0;
  let db = (this.rnd.anim.input.keys["ArrowRight"] - this.rnd.anim.input.keys["ArrowLeft"]) * 0.30 / 4;
  let df = (this.rnd.anim.input.keys["ArrowUp"] - this.rnd.anim.input.keys["ArrowDown"]) * 0.30 / 4;
  angl -= (this.rnd.anim.input.keys["KeyE"] - this.rnd.anim.input.keys["KeyQ"]) * 2;
  //let z = -(this.rnd.anim.input.keys["PageUp"] - this.rnd.anim.input.keys["PageDown"]) * 0.30 / 4;

  this.angle += angl;
  
  this.dir = this.dir.vectorTransform(mat4().rotateZ(angl));

  this.move = this.move.addVec(this.dir.mulNum(df).addVec(vec3(-this.dir.y, this.dir.x, 0).mulNum(-db)));
 
  // if (this.socket.readyState == 1)
  //   this.socket.send(
  //     JSON.stringify({
  //       id:this.id,
  //       type:"move",
  //       move:this.move,
  //       name:this.playerName,
  //     })
  //   );


  let d = (this.rnd.anim.timer.globalTime - this.intervalStart) * 1000 / this.interval;

  this.curPos = this.oldPos.mulNum(1 - d).addVec(this.pos.mulNum(d));

  let camLoc = this.curPos.addVec(vec3(0, 0, 5).addVec(this.dir.neg().mulNum(4.7)));

  //camLoc = this.curPos.addVec(vec3(0, 0, 5));
  this.rnd.mainCam.set(camLoc, this.curPos, this.dir);
  // this.rnd.updateFrameUBO();
  //this.rnd.mainCam.set(vec3(0.30, 0.47, 0.8), this.curPos, this.dir);
}

function unitRender() {
  this.rnd.drawPrim(this.prim, (mat4().translate(this.curPos)));
  this.rnd.drawPrim(this.dirPrim, mat4().translate(this.curPos.addVec(this.dir)));
}

export function unitMyPlayer(rnd, socket, id, playerName) {
  return new _unitMyPlayer(rnd, socket, id, playerName);
}