import { vertex } from "./vertex.js"
import { vec3 } from "../../math/vec3.js"
import { prim } from "./prim.js";

export function tetrCreate(mtlPtn, size) {
  const sqrt3 = Math.sqrt(3);
  const sqrt23 = Math.sqrt(2 / 3);

  let vt = [
    vertex(vec3(0, 0, sqrt3 / 3)), vertex(vec3(0.5, 0, -sqrt3 / 6)), vertex(vec3(-0.5, 0, -sqrt3 / 6)),
    vertex(vec3(0, sqrt23, 0)), vertex(vec3(0.5, 0, -sqrt3 / 6)), vertex(vec3(-0.5, 0, -sqrt3 / 6)),
    vertex(vec3(0, sqrt23, 0)), vertex(vec3(0.5, 0, -sqrt3 / 6)), vertex(vec3(0, 0, sqrt3 / 3)),
    vertex(vec3(0, sqrt23, 0)), vertex(vec3(-0.5, 0, -sqrt3 / 6)), vertex(vec3(0, 0, sqrt3 / 3)),
  ];

  vt.forEach((vert) => {
    vert.pos = vert.pos.mulNum(size);
  })

  vt = vertex().autoNormal(vt);

  vt = vertex().createVertexArray(vt);

  return prim(mtlPtn, "triangles", vt);
}