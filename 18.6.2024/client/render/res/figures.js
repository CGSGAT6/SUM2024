import { vec3 } from "../../math/vec3";
import { prim } from "./prim";
import { vertex } from "./vertex";

export class Platon {
  static cubeCreate(mtlPtn, size) {
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
  
  static octCreate(mtlPtn, size) {
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
  
  static tetrCreate(mtlPtn, size) {
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
  
  static icoCreate(mtlPtn, size) {
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
  
  static dodecCreate(mtlPtn, size) {
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
  
  static truncedIcoCreate(mtlPtn, size) {
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

    let ind = [];

    for (let i = 0; i < 5; i++) {
      ind.push(0, i + 1);
    }

    for (let i = 1; i < 6; i++) {
      ind.push(i, 1 + (i) % 5);
    }

    
    let h = [
      1, 9,
      2, 9,
      2, 10,
      3, 10,
      3, 6,
      4, 6,
      4, 7,
      5, 7,
      5, 8,
      1, 8,
    ]
    ind = ind.concat(h);

    for (let i = 1; i < 6; i++) {
      ind.push(5 + i, 6 + i % 5);
    }
    
    for (let i = 0; i < 5; i++) {
      ind.push(11, 5 + i + 1);
    }

    let pnts1 = [];

    for (let i = 0; i < ind.length; i += 2) {
      pnts1.push(
        pnts0[ind[i]].mulNum(2 / 3).addVec(pnts0[ind[i + 1]].mulNum(1 / 3)),
        pnts0[ind[i]].mulNum(1 / 3).addVec(pnts0[ind[i + 1]].mulNum(2 / 3))
      );
    }

    let indexesPent = [
      // up
      [0, 2, 4, 6, 8],
      // 2st lauer
      [1, 10, 20, 38, 19],
      [3, 12, 24, 22, 11],
      [5, 14, 28, 26, 13],
      [7, 15, 30, 32, 16], 
      [9, 18, 36, 34, 17],
      // 2nd lauer
      [21, 23, 46, 57, 45],
      [25, 27, 48, 59, 47],
      [29, 31, 40, 51, 49],
      [33, 35, 42, 53, 41],
      [39, 37, 43, 55, 44],
      // down
      [50, 52, 54, 56, 58],
    ];

    let indexesHex = [
      // up layer
      [0, 1, 10, 11, 3, 2],
      [2, 3, 12, 13, 5, 4],
      [4, 5, 14, 15, 7, 6],
      [6, 7, 16, 17, 9, 8],
      [8, 9, 18, 19, 1, 0],
      // middle layer 
      [20, 21, 23, 22, 11, 10],
      [22, 23, 46, 47, 25, 24],
      [24, 25, 27, 26, 13, 12],
      [26, 27, 48, 49, 29, 28],
      [28, 29, 31, 30, 15, 14],
      [30, 31, 40, 41, 33, 32],
      [32, 33, 35, 34, 17, 16],
      [34, 35, 42, 43, 37, 36],
      [36, 37, 39, 38, 19, 18],
      [38, 39, 44, 45, 21, 20],
      // down layer
      [50, 51, 40, 41, 53, 52],
      [52, 53, 42, 43, 55, 54],
      [54, 55, 44, 45, 57, 56],
      [56, 57, 46, 47, 59, 58],
      [58, 59, 48, 49, 51, 50],
    ];

    let pntsR = [];

    for (let i in indexesPent){
      pntsR.push(...createPentagon(
        pnts1[indexesPent[i][0]],
        pnts1[indexesPent[i][1]],
        pnts1[indexesPent[i][2]],
        pnts1[indexesPent[i][3]],
        pnts1[indexesPent[i][4]]));
    }

    for (let i in indexesHex){
      pntsR.push(...createHexagon(
        pnts1[indexesHex[i][0]],
        pnts1[indexesHex[i][1]],
        pnts1[indexesHex[i][2]],
        pnts1[indexesHex[i][3]],
        pnts1[indexesHex[i][4]],
        pnts1[indexesHex[i][5]]));
    }

    let vert = [];

    for (let i in pntsR) {
      vert.push(vertex(pntsR[i]));
    }

    vertex().autoNormal(vert);
   // ---------------------------------      
    
    let vertexes = vertex().createVertexArray(vert);

    return prim(mtlPtn, "triangles", vertexes);
  }
}

function createPentagon(p0, p1, p2, p3, p4) {
  return [
    vec3(p0), vec3(p1), vec3(p2),
    vec3(p0), vec3(p2), vec3(p3),
    vec3(p0), vec3(p3), vec3(p4),
  ]
}

function createHexagon(p0, p1, p2, p3, p4, p5) {
  return [
    vec3(p0), vec3(p1), vec3(p2),
    vec3(p0), vec3(p2), vec3(p3),
    vec3(p0), vec3(p3), vec3(p4),
    vec3(p0), vec3(p4), vec3(p5),
  ]
}
