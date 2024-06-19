class _buffer {
  gl;

  constructor(rnd, type, size) {
    this.gl = rnd.gl;

    const types = {
      "UNIFORM_BUFFER": this.gl.UNIFORM_BUFFER,
    }

    this.type = types[type];    // Buffer type (gl.***_BUFFER)
    this.size = size;    // Buffer size in bytes
    this.id = null;
    if (size == 0 || this.type == undefined)
      return;
    this.id = this.gl.createBuffer();
    this.gl.bindBuffer(this.type, this.id);
    this.gl.bufferData(this.type, size, this.gl.STATIC_DRAW);
  }
  update(data) {
    this.gl.bindBuffer(this.type, this.id);
    this.gl.bufferSubData(this.type, 0, data);
  }
}
export function buffer(...args) {
  return new _buffer(...args);
} // End of 'buffer' function
  
class _ubo_buffer extends _buffer {
  constructor(rnd, name, size, bindPoint) {
    super(rnd, "UNIFORM_BUFFER", size);
    this.name = name;
    this.bindPoint = bindPoint; // Buffer GPU binding point
  }
  apply (shd) {
    if (shd == undefined || shd.id == undefined || shd.uniformBlocks[this.name] == undefined)
      return;
    this.gl.uniformBlockBinding(shd.id, shd.uniformBlocks[this.name].index, this.bindPoint);
    this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, this.bindPoint, this.id);
  }                        
}
export function ubo_buffer(...args) {
  return new _ubo_buffer(...args);
} // End of 'ubo_buffer' function