class _prim {
  vertexBuffer;
  indexBuffer;
  vertexArray;
  noofV = 0;
  noovI = 0;
  type;
  primUBO;
  mtlPtn;
  material;
  
  createData = {};

  create() {
    let gl = this.material.mtlPtn.shd.glDrawingContext;
    
    let vertFormat = this.material.mtlPtn.vertexFormat;
    //  = [
    //   {name : "Position",
    //    size : 12},
    //   {name : "Normal",
    //    size : 12}
    //   ];
    let vertSize = 0;
    
    vertFormat.forEach((elem) => {
      vertSize += elem.size;
    });

    this.noofV = this.createData.vertexes.length / (vertSize / 4);

    ///console.log(material.mtlPtn.shd);

    // vertex buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.createData.vertexes), gl.STATIC_DRAW);

    // index buffer
    if (this.createData.indexes != undefined) {
      this.noofI = this.createData.indexes.length;
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.createData.indexes), gl.STATIC_DRAW);
    }

    // vertex attribs
    this.vertexArray= gl.createVertexArray();
    gl.bindVertexArray(this.vertexArray);

    let allSize = 0;
    for (let i in vertFormat) {
      let findedAttr = this.material.mtlPtn.shd.attrs["In" + vertFormat[i].name];

      if (findedAttr != undefined) {
        let attrLoc = this.material.mtlPtn.shd.attrs["In" + vertFormat[i].name].loc;

        if (attrLoc != -1) {
          gl.vertexAttribPointer(attrLoc, vertFormat[i].size / 4, gl.FLOAT, false, vertSize, allSize);
          gl.enableVertexAttribArray(attrLoc);
        }

        allSize += vertFormat[i].size;
      }
    }

    this.createData = null;

  }

  constructor(material, type, vertexes, indexes) {
    this.material = material;
    this.createData.vertexes = vertexes;
    this.createData.indexes = indexes;
    
    if (type == "triangles")
      this.type = material.mtlPtn.shd.glDrawingContext.TRIANGLES;
    else if (type == "triangle strip")
      this.type = material.mtlPtn.shd.glDrawingContext.TRIANGLE_STRIP;
    else if (type == "line strip")
      this.type = material.mtlPtn.shd.glDrawingContext.LINE_STRIP;
    else if (type == "lines")
      this.type = material.mtlPtn.shd.glDrawingContext.LINES;
    else if (type == "triangle fun")
      this.type = material.mtlPtn.shd.glDrawingContext.TRIANGLE_FUN;
    else
      this.type = material.mtlPtn.shd.glDrawingContext.POINTS; 
  }
}

export function prim(material, type, vertexes, indexes) {
  return new _prim(material, type, vertexes, indexes);
}

// phong:
// - Ka
// - Kd
// - Ks
// - Trans
// - Ph
// - Texture flags