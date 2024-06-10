import { vec3 } from "../../math/vec3";
import { prim } from "./prim";
import { vertex } from "./vertex";

export function octCreate(mtlPtn, size) {
  let pnts = [
    vec3(0, 1, 0), vec3(0, 0, 1),
    vec3(-1, 0, 0), vec3(0, 0, -1),
    vec3(1, 0, 0), vec3(0, -1, 0),
  ];
  
  let ind = [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 1,
    5, 1, 2,
    5, 2, 3,
    5, 3, 4,
    5, 4, 1,
  ];

  let vert = [];

  let uInd = [];

  for (let i = 0; i < ind.length; i++) {
    vert.push(vertex(pnts[ind[i]].mulNum(size)));
  }

  vert = vertex().autoNormal(vert);

  let vertexArr = vertex().createVertexArray(vert);

  return prim(mtlPtn, "triangles", vertexArr);

}