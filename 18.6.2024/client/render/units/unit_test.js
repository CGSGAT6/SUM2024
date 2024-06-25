import { mat4 } from "../../math/mat4";
import { vec3 } from "../../math/vec3";
import { Platon, planePrim } from "../res/figures";
import { image } from "../res/image";
import { materialPattern } from "../res/material_pattern";
import { material } from "../res/materials";
import { texture } from "../res/textures";
import { _unit } from "./units";

class _unitPlane extends _unit {
  rnd;
  testPlane;
  constructor(rnd) {
    super("Plane", unitInit, unitResponse, unitRender, unitClose);
    this.rnd = rnd;
  }
}

function unitInit() {
  let MtlPtn = materialPattern("plane", "texShd", this.rnd, [
    {name : "Position",
    size : 12},
    {name : "Normal",
    size : 12},
    {name : "TexCoord",
      size : 8}
   ]);

  let Mtl = material(
    MtlPtn,
    {
      "ka":vec3(0.0, 0.30, 0.7),
      "kd":vec3(0.7, 0.6, 0.9),
      "ks":vec3(0.727811, 0.626959, 0.626959),
      "ph":76.8,
      "trans":0,
    },
    "planeMtl",
   )


  let img = image("bin/A.png");
  let tex = texture(this.rnd, img);
  
  Mtl.textureAttach(tex);

  this.testPlane = planePrim(Mtl, 1);
}

function unitResponse() {
}

function unitRender() {
  this.rnd.drawPrim(this.testPlane, mat4().rotateX(90).mulMatr(mat4().scale(vec3(1000))));
}

function unitClose() {
  // do nothing
}

export function unitPlane(rnd) {
  return new _unitPlane(rnd);
}