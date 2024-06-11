import { vec3 } from "../../math/vec3";
import { prim } from "./prim";
import { vertex } from "./vertex";

export function cubeCreate(mtlPtn, size) {
  let pnts = [
    vec3(-1, -1, -1), vec3(1, -1, -1),
    vec3(1, -1, 1), vec3(-1, -1, 1),
    vec3(-1, 1, -1), vec3(1, 1, -1),
    vec3(1, 1, 1), vec3(-1, 1, 1),
  ];
  
  let ind = [
    1, 0, 2, 3, -1,
    5, 6, 1, 2, -1,
    6, 7, 2, 3, -1,
    7, 4, 3, 0, -1,
    4, 5, 0, 1, -1,
    4, 5, 7, 6, -1,
  ];

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
      vert.push(vertex(pnts[ind[i]].mulNum(size), norms[Math.floor(i / 5)]));
      uInd.push(j);
      j++;
    }
    else
      uInd.push(-1);
  }

  let vertexArr = vertex().createVertexArray(vert);

  return prim(mtlPtn, "triangle strip", vertexArr, uInd);
}

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

export function icoCreate(mtlPtn, size) {
  const 
    sqrt5d2 = Math.sqrt(5) / 2,
    sin72 = Math.sin(72 * Math.PI / 180),
    cos72 = Math.cos(72 * Math.PI / 180);

  let pnts = [
    vec3(0, sqrt5d2, 0)
  ]

  for (let i = 0; i < 5; i++) {
    pnts.push(vec3(Math.cos((72 * i) * Math.PI /180), 0.5, Math.sin((72 * i) * Math.PI /180)));
  }

  for (let i = 0; i < 5; i++) {
    pnts.push(vec3(-Math.cos((72 * i) * Math.PI /180), -0.5, -Math.sin((72 * i) * Math.PI /180)));
  }

  pnts.push(vec3(0, -sqrt5d2, 0));

  let ind = [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 5, 1,
    1, 9, 8, 
    1, 2, 9,
    2, 10, 9,
    2, 3, 10,
    3, 6, 10,
    3, 4, 6,
    4, 7, 6,
    4, 5, 7,
    5, 8, 7,
    5, 1, 8,
    11, 6, 7,
    11, 7, 8,
    11, 8, 9,
    11, 9, 10,
    11, 10, 6,
  ];

  let vert = [];

  for (let i in ind) {
    vert.push(vertex(pnts[ind[i]].mulNum(size)));
  }

  vertex().autoNormal(vert);
  
  let vertexArr = vertex().createVertexArray(vert);

  return prim(mtlPtn, "triangles", vertexArr);
}

export function dodecCreate(mtlPtn, size) {
  const 
    sqrt5d2 = Math.sqrt(5) / 2,
    sin72 = Math.sin(72 * Math.PI / 180),
    cos72 = Math.cos(72 * Math.PI / 180);

  let pnts0 = [
    vec3(0, sqrt5d2, 0)
  ]

  for (let i = 0; i < 5; i++) {
    pnts0.push(vec3(Math.cos((72 * i) * Math.PI /180), 0.5, Math.sin((72 * i) * Math.PI /180)));
  }

  for (let i = 0; i < 5; i++) {
    pnts0.push(vec3(-Math.cos((72 * i) * Math.PI /180), -0.5, -Math.sin((72 * i) * Math.PI /180)));
  }

  pnts0.push(vec3(0, -sqrt5d2, 0));

  let ind = [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 5, 1,
    1, 9, 8, 
    1, 2, 9,
    2, 10, 9,
    2, 3, 10,
    3, 6, 10,
    3, 4, 6,
    4, 7, 6,
    4, 5, 7,
    5, 8, 7,
    5, 1, 8,
    11, 6, 7,
    11, 7, 8,
    11, 8, 9,
    11, 9, 10,
    11, 10, 6,
  ];

  let pnts1 = [];

  for (let i = 0; i < ind.length; i += 3) {
    pnts1.push(pnts0[ind[i]].addVec(pnts0[ind[i + 1]]).addVec(pnts0[ind[i + 2]]).divNum(3));
  }

  let indexes = [
    0, 1, 2, 0, 2, 3, 0, 3, 4,
    0, 1, 8, 0, 8, 7, 0, 7, 6,
    1, 2, 10, 1, 10, 9, 1, 9, 8,
    2, 3, 12, 2, 12, 11, 2, 11, 10,
    3, 4, 14, 3, 14, 13, 3, 13, 12,
    4, 0, 6, 4, 6, 5, 4, 5, 14,
    7, 8, 9, 7, 9, 19, 7, 19, 18,
    9, 10, 11, 9, 11, 15, 9, 15, 19,
    11, 12, 13, 11, 13, 16, 11, 16, 15,
    13, 14, 5, 13, 5, 17, 13, 17, 16,
    5, 6, 7, 5, 7, 18, 5, 18, 17,
    15, 16, 17, 15, 17, 18, 15, 18, 19,
  ]

  let vert = [];

  for (let i in indexes) {
    vert.push(vertex(pnts1[indexes[i]].mulNum(size)));
  }

  vertex().autoNormal(vert);
  
  let vertexArr = vertex().createVertexArray(vert);

  return prim(mtlPtn, "triangles", vertexArr);
}