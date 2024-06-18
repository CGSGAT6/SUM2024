import { renderObject } from "./render/rend_def.js";
import { materialPattern } from "./render/res/material_pattern.js";
import { prim } from "./render/res/prim.js";
import { shader } from "./render/res/shaders.js";
import { vec3 } from "./math/vec3.js";
import { Platon } from "./render/res/figures.js";

function main() {
  let 
    truncIcoRnd,
    tetrRnd,
    cubeRnd,
    octRnd,
    dodecRnd,
    icoRnd;
  
  let 
    truncIcoMtlPtn,
    tetrMtnPtn,
    cubeMtlPtn,
    octMtlPtn,
    dodecMtlPtn,
    icoMtlPtn;
  
  let 
    truncIcoPrim,
    tetrPrim,
    cubePrim,
    octPrim,
    dodecPrim,
    icoPrim;

  truncIcoRnd = renderObject("can0");
  tetrRnd = renderObject("can5");
  cubeRnd = renderObject("can1");
  octRnd = renderObject("can2");
  dodecRnd = renderObject("can3");
  icoRnd = renderObject("can4");
 
  
  truncIcoRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  truncIcoRnd.mainCam.setSize(1000, 1000);
  tetrRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  tetrRnd.mainCam.setSize(500, 500);
  cubeRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  cubeRnd.mainCam.setSize(500, 500);
  octRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  octRnd.mainCam.setSize(500, 500);
  dodecRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  dodecRnd.mainCam.setSize(500, 500);
  icoRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  icoRnd.mainCam.setSize(500, 500);

  truncIcoMtlPtn = materialPattern("truncIco", "default", truncIcoRnd);
  tetrMtnPtn = materialPattern("tetr", "default", tetrRnd);
  cubeMtlPtn = materialPattern("cube", "default", cubeRnd);
  octMtlPtn = materialPattern("oct", "default", octRnd);
  dodecMtlPtn = materialPattern("dodec", "default", dodecRnd);
  icoMtlPtn = materialPattern("ico", "default", icoRnd);

  const draw = () => {
    // drawing
    truncIcoRnd.drawFrame();
    tetrRnd.drawFrame();
    cubeRnd.drawFrame();
    octRnd.drawFrame();
    dodecRnd.drawFrame();
    icoRnd.drawFrame();

    truncIcoRnd.drawPrim(truncIcoPrim);
    tetrRnd.drawPrim(tetrPrim);
    cubeRnd.drawPrim(cubePrim);
    octRnd.drawPrim(octPrim);
    dodecRnd.drawPrim(dodecPrim);
    icoRnd.drawPrim(icoPrim);
    // animation register
    window.requestAnimationFrame(draw);
    };

    
    truncIcoPrim = Platon.truncedIcoCreate(truncIcoMtlPtn, 1);
    cubePrim = Platon.cubeCreate(cubeMtlPtn, 0.5);
    octPrim = Platon.octCreate(octMtlPtn, 1);
    dodecPrim = Platon.dodecCreate(dodecMtlPtn, 1);
    icoPrim = Platon.icoCreate(icoMtlPtn, 1);
    tetrPrim = Platon.tetrCreate(tetrMtnPtn, 2);
    draw();
  // truncIcoMtlPtn.shd.create().then(() => {
  //   truncIcoPrim = Platon.truncedIcoCreate(truncIcoMtlPtn, 1);
  //   cubeMtlPtn.shd.create().then(() => {
  //     cubePrim = Platon.cubeCreate(cubeMtlPtn, 0.5);
  //     octMtlPtn.shd.create().then(() => {
  //       octPrim = Platon.octCreate(octMtlPtn, 1);
  //       dodecMtlPtn.shd.create().then(() => {
  //         dodecPrim = Platon.dodecCreate(dodecMtlPtn, 1);
  //         icoMtlPtn.shd.create().then(() => {
  //           icoPrim = Platon.icoCreate(icoMtlPtn, 1);
  //           tetrMtnPtn.shd.create().then(() => {
  //             tetrPrim = Platon.tetrCreate(tetrMtnPtn, 2);
  //             draw();
  //           })
  //         })
  //       })
  //     })
  //   })
  // })
} 

window.addEventListener("load", () => {
  main();
});