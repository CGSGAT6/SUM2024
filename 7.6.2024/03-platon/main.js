import { renderObject } from "./render/rend_def.js";
import { materialPattern } from "./render/res/material_pattern.js";
import { prim } from "./render/res/prim.js";
import { shader } from "./render/res/shaders.js";
import { vec3 } from "./math/vec3.js";
import { vertex } from "./render/res/vertex.js"
import { tetrCreate } from "./render/res/tetr.js";
import { cubeCreate } from "./render/res/cube.js";
import { octCreate } from "./render/res/oct.js";


function main1() {
  let mainRnd;
  let fstMtlPtn;
  let fstPrim;


  mainRnd = renderObject("mainCanvas");
  
  mainRnd.mainCam.set(vec3(0, 3, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  mainRnd.mainCam.setSize(1000, 1000);

  fstMtlPtn = materialPattern("fst", "default", mainRnd);

  const draw = () => {
    // drawing
    mainRnd.drawFrame();

    mainRnd.drawPrim(fstPrim);
    // animation register
    window.requestAnimationFrame(draw);
    };



  const gl = mainRnd.gl;

  // //prim(fstMtlPtn, "triangle strip", new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0]))

  fstMtlPtn.shd.create().then(() => {fstPrim = cubeCreate(fstMtlPtn, 1);}).then(() => {
    draw();});
} 

function main2() {
  let mainRnd;
  let fstMtlPtn;
  let fstPrim;


  mainRnd = renderObject("secondCanvas");
  
  mainRnd.mainCam.set(vec3(0, 3, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  mainRnd.mainCam.setSize(1000, 1000);

  fstMtlPtn = materialPattern("fst", "default", mainRnd);

  const draw = () => {
    // drawing
    mainRnd.drawFrame();

    mainRnd.drawPrim(fstPrim);
    // animation register
    window.requestAnimationFrame(draw);
    };



  const gl = mainRnd.gl;

  // //prim(fstMtlPtn, "triangle strip", new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0]))

  fstMtlPtn.shd.create().then(() => {fstPrim = tetrCreate(fstMtlPtn, 2);}).then(() => {
    draw();});
}

function main3() {
  let mainRnd;
  let fstMtlPtn;
  let fstPrim;


  mainRnd = renderObject("thirdCanvas");
  
  mainRnd.mainCam.set(vec3(0, 0.8, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  mainRnd.mainCam.setSize(1000, 1000);

  fstMtlPtn = materialPattern("fst", "default", mainRnd);

  const draw = () => {
    // drawing
    mainRnd.drawFrame();

    mainRnd.drawPrim(fstPrim);
    // animation register
    window.requestAnimationFrame(draw);
    };



  const gl = mainRnd.gl;

  // //prim(fstMtlPtn, "triangle strip", new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0]))

  fstMtlPtn.shd.create().then(() => {fstPrim = octCreate(fstMtlPtn, 1);}).then(() => {
    draw();});
}


window.addEventListener("load", () => {
  main1();
  main2();
  main3();
});
