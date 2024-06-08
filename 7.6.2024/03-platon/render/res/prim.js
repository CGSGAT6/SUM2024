class _prim {
  vertexBuffer;
  indexBuffer;
  primMtlPtn;

  constructor(mtlPtn, vertexes, indexes) {
    let gl = mtlPtn.shd.glDrawingContext;

    // vertex buffer
    this.primMtlPtn = mtlPtn;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);

    // index buffer
    if (typeof indexes != "undefined") {
      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(indexes), gl.STATIC_DRAW);
    }
    
    // vertex attribs
    let vertFormat = [
      {name : "Position",
       size : 12},
      {name : "Normal",
       size : 12}
      ];

    let allSize = 0;
    for (let i in vertFormat) {
      let attrLoc = mtlPtn.shd.attrs["In" + vertFormat[i].name].loc;

      allSize += vertFormat[i].size;

      if (attrLoc != -1) {
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, allSize);
        gl.enableVertexAttribArray(posLoc);
      }
    }
  }
}

export function prim(mtlPtn, vertexes, indexes) {
  return new _prim(mtlPtn, vertexes, indexes);
}