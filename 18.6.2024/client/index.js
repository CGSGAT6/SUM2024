import { renderObject } from "./render/rend_def.js";
import { materialPattern } from "./render/res/material_pattern.js";
import { vec3 } from "./math/vec3.js";
import { Platon } from "./render/res/figures.js";
import { mat4 } from "./math/mat4.js";
import { input } from "./render/input.js";

let testRotate = 0;

let socket;
let inp;

function initializeCommunication() {
  socket = new WebSocket("ws://localhost:3030");

  socket.onopen = (event) => {
    console.log("Socket open");
  };

  socket.onmessage = (event) => {
    ///console.log("Get message:" + event.data);
    let msg = JSON.parse(event.data);

    if (msg.type == "rotate") {
      testRotate = msg.value;
      inp.value = msg.value;
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


  const draw = () => {
    // drawing
    myRnd.drawFrame();
    
    //mainInput.responseCamera(myRnd);

    myRnd.drawPrim(trunc);
    // animation register
    window.requestAnimationFrame(draw);
    };



  let myRnd = renderObject("can")
  let mainInput = new input(myRnd);
  let mtlPtn = materialPattern("fst", "default", myRnd);
  myRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  myRnd.mainCam.setSize(1000, 1000);
  let trunc = Platon.truncedIcoCreate(mtlPtn, 1);

  draw();
}

window.addEventListener("load", () => {
  main();
});
