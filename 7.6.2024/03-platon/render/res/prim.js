class _prim {
  vertexBuffer;
  indexBuffer;
  primMtlPtn;
  vertexArray;
  noofV = 0;
  noovI = 0;
  type;

  constructor(mtlPtn, type, vertexes, indexes) {
    let gl = mtlPtn.shd.glDrawingContext;

    this.type = type;

    let vertFormat = [
      {name : "Position",
       size : 12},
      {name : "Normal",
       size : 12}
      ];
    let vertSize = 24;

    this.noofV = vertexes.length / (vertSize / 4);

    ///console.log(mtlPtn.shd);

    // vertex buffer
    this.primMtlPtn = mtlPtn;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);

    // index buffer
    if (indexes != undefined) {
      this.noofI = indexes.length;
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexes), gl.STATIC_DRAW);
    }

    // vertex attribs
    this.vertexArray= gl.createVertexArray();
    gl.bindVertexArray(this.vertexArray);

    let allSize = 0;
    for (let i in vertFormat) {
      let findedAttr = mtlPtn.shd.attrs["In" + vertFormat[i].name];

      if (findedAttr != undefined) {
        let attrLoc = mtlPtn.shd.attrs["In" + vertFormat[i].name].loc;

        if (attrLoc != -1) {
          gl.vertexAttribPointer(attrLoc, vertFormat[i].size / 4, gl.FLOAT, false, vertSize, allSize);
          gl.enableVertexAttribArray(attrLoc);
        }

        allSize += vertFormat[i].size;
      }
    }
  }
}

export function prim(mtlPtn, type, vertexes, indexes) {
  return new _prim(mtlPtn, type, vertexes, indexes);
}
