import { renderObject } from "./render/rend_def.js";
import { materialPattern } from "./render/res/material_pattern.js";
import { vec3 } from "./math/vec3.js";
import { Platon } from "./render/res/figures.js";
import { mat4 } from "./math/mat4.js";
import { input } from "./render/input.js";
import { material } from "./render/res/materials.js";
import { unitPlayer } from "./render/units/unit_player.js";
import { unitMyPlayer } from "./render/units/unit_my_player.js";
import { animationContext } from "./anim.js";
import { unitPlane } from "./render/units/unit_test.js";
import { unitBullet } from "./render/units/unit_bullet.js";
import { unitFloor } from "./render/units/unit_floor.js";


let testRotate = 0;

let socket;
let inp;
//let players = [];
let newPlayers = {};
//let playerId = -1;
let playerName = "";

let bullets = [];

//let myAnim.rnd;
let myAnim;
let mainInput;
let mtlPtn;
let defMaterial;

let interStart;
let inter;

function playerAdd(msg, pos) {
  
  let player;
 /* if (msg.id == playerId)
    player = unitMyPlayer(myAnim.rnd, socket, msg.id);
  else
    player = unitPlayer(myAnim.rnd, msg.id);*/

  if (msg.name == playerName)
    player = unitMyPlayer(myAnim.rnd, socket, msg.id, playerName);
  else
    player = unitPlayer(myAnim.rnd, msg.id);

  myAnim.unitAdd(player);
  player.pos = vec3(pos);
  player.oldPos = vec3(pos);  
  //players.push(player);
  newPlayers[msg.name] = player;
}

function bulletAdd(msg) {
  let bullet;
  
  bullet = unitBullet(myAnim.rnd, msg.pos, msg.dir);

  bullets.push(bullet);

  myAnim.unitAdd(bullet);
}

function initializeCommunication() {
  socket = new WebSocket("ws://localhost:3030");

  socket.onopen = (event) => {
    console.log("Socket open");
  };
 
  socket.onmessage = (event) => {
    ///console.log("Get message:" + event.data);
    let msg = JSON.parse(event.data);

    if (msg.type == "hist") {
      playerName = msg.name;
      for (let m in msg.poses) {
          playerAdd(msg.poses[m], msg.poses[m].pos);
      }
    } else if (msg.type == "connect") {
      if (msg.valid)
        playerAdd(msg, vec3(0));
      else
       ;// players.push(null);
    } else if (msg.type == "disconnect") {
      /*if (players[msg.id] != undefined) {
        players[msg.id].isActive = false;
        players[msg.id] = null;
      }*/
      if (newPlayers[msg.name] != undefined) {
        newPlayers[msg.name].isActive = false;
        delete newPlayers[msg.name];
      }
    } else if (msg.type == "update") {
      for (let i in msg.players) {
        /*if (players[i] != undefined) {
          players[i].oldPos = vec3(players[i].pos);
          players[i].pos = vec3(msg.pos[i]);
          players[i].intervalStart = myAnim.timer.globalTime;
          players[i].interval = msg.inter;
        }*/
        if (newPlayers[msg.players[i].name] != undefined) {
          newPlayers[msg.players[i].name].oldPos = vec3(newPlayers[msg.players[i].name].pos);
          newPlayers[msg.players[i].name].pos = vec3(msg.players[i].pos);
          newPlayers[msg.players[i].name].isDead = msg.players[i].isDead;
          newPlayers[msg.players[i].name].isKill = msg.players[i].isKill;
          newPlayers[msg.players[i].name].deads = msg.players[i].deads;
          newPlayers[msg.players[i].name].kills = msg.players[i].kills;
          newPlayers[msg.players[i].name].intervalStart = myAnim.timer.globalTime;
          newPlayers[msg.players[i].name].interval = msg.inter;
        }
      }

      for (let i = 0; i < msg.startInd; i++) {
        if (bullets[i] != undefined) { 
          bullets[i].isActive = false;
        }
      }

      bullets = bullets.slice(msg.startInd);

      for (let i in msg.bullets) {
        if (bullets[i] == null) {
          let ii = Number(i) + msg.startInd;
          if (bullets[ii]) {  
            bullets[ii].isActive = false;
          }
          
        }
        let ii = Number(i) + msg.startInd;
        if (bullets[ii] != undefined) {
          bullets[ii].oldPos = vec3(bullets[ii].pos);
          bullets[ii].pos = vec3(msg.bullets[i].pos);
          bullets[ii].intervalStart = myAnim.timer.globalTime;
          bullets[ii].interval = msg.inter;
        }
      }
    } else if (msg.type == "bulletAdd") {
      bulletAdd(msg);
    }
  };
}

function main() {
  const draw = () => {
    
    // for (let p of players) {
    //   p.intervalStart = interStart;
    //   p.interval = inter;
    // }

    myAnim.unitsResponse();

    // drawing
    myAnim.frameStart();

    // myAnim.rnd.mainCam.set(pos.addVec(vec3(0, 0, 5)), pos, vec3(0, 1, 0));    
    //myAnim.rnd.mainCam.set(CamLoc, pos, vec3(0, 1, 0));    



    myAnim.unitsRender();
    window.requestAnimationFrame(draw);
    };
    
  //myAnim.rnd = renderObject("can")
  myAnim = animationContext("can");
  // mainInput = new input(myAnim.rnd);
  mtlPtn = materialPattern("fst", "default", myAnim.rnd);
  defMaterial = material(
    mtlPtn,
    {
      "ka":vec3(0.47, 0.30, 0.7),
      "kd":vec3(0.7, 0.6, 0.1),
      "ks":vec3(0.727811, 0.626959, 0.626959),
      "ph":76.8,
      "trans":0,
    },
  "defMtl");
  myAnim.rnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  myAnim.rnd.mainCam.setSize(1000, 1000);
  //let trunc = Platon.truncedIcoCreate(defMaterial, 0.47);

  initializeCommunication();


  myAnim.unitAdd(unitFloor(myAnim.rnd));
  draw();
}

window.addEventListener("load", () => {
  main();
});
