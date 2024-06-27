import { mat4 } from "../../math/mat4";
import { vec3 } from "../../math/vec3";
import { Platon, planePrim } from "../res/figures";
import { image } from "../res/image";
import { materialPattern } from "../res/material_pattern";
import { material } from "../res/materials";
import { texture } from "../res/textures";
import { _unit } from "./units";

class _unitFloor extends _unit {
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

  let imgAO = image("bin/textures/woodparquet/woodparquet_93_ambientocclusion-1K.png");
  let texAO = texture(this.rnd, imgAO);
  let imgDiff = image("bin/textures/woodparquet/woodparquet_93_basecolor-1K.png");
  let texDiff = texture(this.rnd, imgDiff);
  let imgN = image("bin/textures/woodparquet/woodparquet_93_normal-1K.png");
  let texN = texture(this.rnd, imgN);

  // let imgAO = image("bin/textures/ceramic_circle/1K-circle_ceramic_3-ao.jpg");
  // let texAO = texture(this.rnd, imgAO);
  // let imgDiff = image("bin/textures/ceramic_circle/1K-circle_ceramic_3-diffuse.jpg");
  // let texDiff = texture(this.rnd, imgDiff);
  // let imgN = image("bin/textures/ceramic_circle/1K-circle_ceramic_3-normal.jpg");
  // let texN = texture(this.rnd, imgN);

/*
  let imgAO = image("bin/textures/procedural_rocks/Rocks_ambientocclusion.jpg");
  let texAO = texture(this.rnd, imgAO);
  let imgDiff = image("bin/textures/procedural_rocks/Rocks_basecolor.jpg");
  let texDiff = texture(this.rnd, imgDiff);
  let imgN = image("bin/textures/procedural_rocks/Rocks_normal.jpg");
  let texN = texture(this.rnd, imgN);
*/
  Mtl.textureAttach(texAO);
  Mtl.textureAttach(texDiff);
  Mtl.textureAttach(texN);

  this.testPlane = planePrim(Mtl, 1);
}

function unitResponse() {
}

function unitRender() {
  this.rnd.drawPrim(this.testPlane, mat4().rotateX(90).mulMatr(mat4().scale(vec3(10))));
}

function unitClose() {
  // do nothing
}

export function unitFloor(rnd) {
  return new _unitFloor(rnd);
}