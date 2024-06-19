import { renderObject } from "./render/rend_def.js";
import { materialPattern } from "./render/res/material_pattern.js";
import { vec3 } from "./math/vec3.js";
import { Platon } from "./render/res/figures.js";
import { mat4 } from "./math/mat4.js";
import { input } from "./render/input.js";
import { material } from "./render/res/materials.js";

let testRotate = 0;

let socket;
let inp;
let players = [];
let playerId;

let myRnd;
let mainInput;
let mtlPtn;
let defMaterial;

let interStart;
let inter;

function playerAdd(msg, pos) {
  let player = Platon.truncedIcoCreate(defMaterial, 0.47);
  let playerMove = vec3(pos);
  players.push({
    prim:player,
    pos:playerMove,
    oldPos:playerMove,
  })
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

      for (let m in msg.arr) {
        playerAdd(msg.arr[m], msg.poses[m]);
      }
      playerId = msg.id;
    }
    if (msg.type == "connect") {
      playerAdd(msg, vec3(0));
    }
    if (msg.type == "rotate") {
      testRotate = msg.value;
      inp.value = msg.value;
    }
    if (msg.type == "update") {
      for (let i in msg.pos) {
        if (players[i] != undefined) {
          players[i].oldPos = vec3(players[i].pos);
          players[i].pos = vec3(msg.pos[i]);
        }
      }

      interStart = myRnd.timer.globalTime;
      inter = msg.inter;
    }
  };
}

function main() {
  initializeCommunication();

  inp = document.querySelector("#test");
  inp.addEventListener("input", () => {
    socket.send(JSON.stringify({
      type: "rotate",
      value: inp.value,
    }));
  })


  let x = 0, y = 0, z = 0;
  const draw = () => {
    // drawing
    myRnd.drawFrame();

    let d = (myRnd.timer.globalTime - interStart) * 1000 / inter;
    x = (mainInput.keys["ArrowRight"] - mainInput.keys["ArrowLeft"]) * 0.30 / 4;
    y = (mainInput.keys["ArrowUp"] - mainInput.keys["ArrowDown"]) * 0.30 / 4;
    z = -(mainInput.keys["PageUp"] - mainInput.keys["PageDown"]) * 0.30 / 4;

    if (x != 0 || y != 0 || z != 0)
      if (socket.readyState != 0)
        socket.send(
          JSON.stringify({
            id:playerId,
            type:"move",
            move:vec3(x, y, z),
          })
        );

    for (let p of players) {
      myRnd.drawPrim(p.prim, mat4().translate(p.oldPos.mulNum(1 - d).addVec(p.pos.mulNum(d))));
    }

    //myRnd.drawPrim(trunc, mat4().rotateY(testRotate).mulMatr(mat4().translate(vec3(x, y, z))));
    // animation register
    window.requestAnimationFrame(draw);
    };



  myRnd = renderObject("can")
  mainInput = new input(myRnd);
  mtlPtn = materialPattern("fst", "default", myRnd);
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
  myRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  myRnd.mainCam.setSize(1000, 1000);
  //let trunc = Platon.truncedIcoCreate(defMaterial, 0.47);

  draw();
}

window.addEventListener("load", () => {
  main();
});
