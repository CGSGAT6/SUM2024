import { renderObject } from "./render/rend_def.js";
import { materialPattern } from "./render/res/material_pattern.js";
import { prim } from "./render/res/prim.js";
import { shader } from "./render/res/shaders.js";
import { vec3 } from "./math/vec3.js";
import { Platon } from "./render/res/figures.js";

function main() {
  let 
    tetrRnd,
    cubeRnd,
    octRnd,
    dodecRnd,
    icoRnd;
  
  let 
    tetrMtlPtn,
    cubeMtlPtn,
    octMtlPtn,
    dodecMtlPtn,
    icoMtlPtn;
  
  let 
    tetrPrim,
    cubePrim,
    octPrim,
    dodecPrim,
    icoPrim;

  tetrRnd = renderObject("can0");
  cubeRnd = renderObject("can1");
  octRnd = renderObject("can2");
  dodecRnd = renderObject("can3");
  icoRnd = renderObject("can4");
 
  
  tetrRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  tetrRnd.mainCam.setSize(1000, 1000);
  cubeRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  cubeRnd.mainCam.setSize(1000, 1000);
  octRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  octRnd.mainCam.setSize(1000, 1000);
  dodecRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  dodecRnd.mainCam.setSize(1000, 1000);
  icoRnd.mainCam.set(vec3(0, 0, 3), vec3(0, 0, 0), vec3(0, 1, 0));
  icoRnd.mainCam.setSize(1000, 1000);

  tetrMtlPtn = materialPattern("tetr", "default", tetrRnd);
  cubeMtlPtn = materialPattern("cube", "default", cubeRnd);
  octMtlPtn = materialPattern("oct", "default", octRnd);
  dodecMtlPtn = materialPattern("dodec", "default", dodecRnd);
  icoMtlPtn = materialPattern("ico", "default", icoRnd);

  const draw = () => {
    // drawing
    tetrRnd.drawFrame();
    cubeRnd.drawFrame();
    octRnd.drawFrame();
    dodecRnd.drawFrame();
    icoRnd.drawFrame();

    tetrRnd.drawPrim(tetrPrim);
    cubeRnd.drawPrim(cubePrim);
    octRnd.drawPrim(octPrim);
    dodecRnd.drawPrim(dodecPrim);
    icoRnd.drawPrim(icoPrim);
    // animation register
    window.requestAnimationFrame(draw);
    };

  tetrMtlPtn.shd.create().then(() => {
    tetrPrim = Platon.tetrCreate(tetrMtlPtn, 1);
    cubeMtlPtn.shd.create().then(() => {
      cubePrim = Platon.cubeCreate(cubeMtlPtn, 0.5);
      octMtlPtn.shd.create().then(() => {
        octPrim = Platon.octCreate(octMtlPtn, 1);
        dodecMtlPtn.shd.create().then(() => {
          dodecPrim = Platon.dodecCreate(dodecMtlPtn, 1);
          icoMtlPtn.shd.create().then(() => {
            icoPrim = Platon.icoCreate(icoMtlPtn, 1);

            draw();
          })
        })
      })
    })
  })

  fstMtlPtn.shd.create().then(() => {fstPrim = Platon.cubeCreate(fstMtlPtn, 0.5);}).then(() => {
    draw();});
} 

window.addEventListener("load", () => {
  main();
});
