import { renderObject } from "./render/rend_def.js";
import { materialPattern } from "./render/res/material_pattern.js";
import { prim } from "./render/res/prim.js";
import { shader } from "./render/res/shaders.js";

let mainRnd;
let fstMtlPtn;
let fstPrim;

function main() {
  mainRnd = renderObject("mainCanvas");

  fstMtlPtn = materialPattern("fst", "default", mainRnd);

  let v = [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1];
  fstPrim = prim(fstMtlPtn, new Float32Array(v), new Float32Array([0, 1, 2]));

  const draw = () => {
  // drawing
  mainRnd.drawFrame();

  // animation register
  window.requestAnimationFrame(draw);
  };
  draw();
} 

window.addEventListener("load", () => {
  main();
});

