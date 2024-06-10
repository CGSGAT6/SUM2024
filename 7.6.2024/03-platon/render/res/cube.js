import { vec3 } from "../../math/vec3";
import { prim } from "./prim";
import { vertex } from "./vertex";

export function cubeCreate(mtlPtn, size) {
  /*let pnts = [
    vec3(-1, -1, -1), vec3(1, -1, -1),
    vec3(1, -1, 1), vec3(-1, -1, 1),
    vec3(-1, 1, -1), vec3(1, 1, -1),
    vec3(1, 1, 1), vec3(-1, 1, -1),
  ];*/
  let pnts = [
    vec3(0, 0, 0), vec3(1, 0, 0),
    vec3(1, 0, 1), vec3(0, 0, 1),
    vec3(0, 1, 0), vec3(1, 1, 0),
    vec3(1, 1, 1), vec3(0, 1, 1),
  ];



  /*let ind = [
    1, 0, 2, 3, 0, 2,
    5, 6, 1, 2, 6, 1,
    6, 7, 2, 3, 7, 2,
    4, 7, 3, 0, 7, 3,
    4, 5, 0, 1, 5, 0,
    4, 5, 7, 6, 5, 7,
  ];*/
  
  let ind = [
    1, 0, 2, 3, -1,
    5, 6, 1, 2, -1,
    6, 7, 2, 3, -1,
    7, 4, 3, 0, -1,
    4, 5, 0, 1, -1,
    4, 5, 7, 6, -1,
  ];
  /*let ind = [
    1, 0, 2, 0, 2, 3
  ]*/
  
  let norms = [
    vec3(0, -1, 0), vec3(1, 0, 0),
    vec3(0, 0, 1), vec3(-1, 0, 0),
    vec3(0, 0, -1), vec3(0, 1, 0),
  ]

  let vert = [];

  let uInd = [];

  let j = 0;
  for (let i = 0; i < ind.length; i++) {
    if (ind[i] != -1) {
      vert.push(vertex(pnts[ind[i]], norms[Math.floor(i / 5)]));
      uInd.push(j);
      j++;
    }
    else
      uInd.push(-1);
  }

  vert.forEach((vt) => {
    vt.pos = vt.pos.mulNum(size);
  });

  let vertexArr = vertex().createVertexArray(vert);

  return prim(mtlPtn, "triangle strip", vertexArr, uInd);

}