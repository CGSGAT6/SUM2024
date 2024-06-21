class _texture {
  constructor(rnd, nameURL, textureType = "2d") {
    if (textureType == "2d") {
      this.name = nameURL.name;
      this.type = rnd.gl.TEXTURE_2D;
      this.id = rnd.gl.createTexture();
      rnd.gl.bindTexture(this.type, this.id);
      if (nameURL.img) {
        rnd.gl.texImage2D(this.type, 0, rnd.gl.RGBA, 1, 1, 0, rnd.gl.RGBA,
          rnd.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 0]));
        nameURL.img.onload = () => {
          rnd.gl.bindTexture(this.type, this.id);
          rnd.gl.pixelStorei(rnd.gl.UNPACK_FLIP_Y_WEBGL, true);
          rnd.gl.texImage2D(this.type, 0, rnd.gl.RGBA, rnd.gl.RGBA, rnd.gl.UNSIGNED_BYTE,
                        nameURL.img);
          rnd.gl.generateMipmap(this.type);
          rnd.gl.texParameteri(this.type, rnd.gl.TEXTURE_WRAP_S, rnd.gl.REPEAT);
          rnd.gl.texParameteri(this.type, rnd.gl.TEXTURE_WRAP_T, rnd.gl.REPEAT);
          rnd.gl.texParameteri(this.type, rnd.gl.TEXTURE_MIN_FILTER,
            rnd.gl.LINEAR_MIPMAP_LINEAR);
          rnd.gl.texParameteri(this.type, rnd.gl.TEXTURE_MAG_FILTER, rnd.gl.LINEAR);
        }
      }
    } else if (textureType == "colorAttachment") {
      this.name = nameURL.name;
      this.type = rnd.gl.TEXTURE_2D;
      this.id = rnd.gl.createTexture();
      rnd.gl.bindTexture(this.type, this.id);
      rnd.gl.texStorage2D(this.type, 1, rnd.gl.RGBA32F, nameURL.width, nameURL.height);
      rnd.gl.texParameteri(this.type, rnd.gl.TEXTURE_WRAP_S, rnd.gl.REPEAT);
      rnd.gl.texParameteri(this.type, rnd.gl.TEXTURE_WRAP_T, rnd.gl.REPEAT);
    } else if (textureType == "depth") {
      this.name = nameURL.name;
      this.type = rnd.gl.TEXTURE_2D;
      this.id = rnd.gl.createTexture();
      rnd.gl.bindTexture(this.type, this.id);
      rnd.gl.texStorage2D(this.type, 1, rnd.gl.DEPTH_COMPONENT24, nameURL.width, nameURL.height);
      rnd.gl.texParameteri(this.type, rnd.gl.TEXTURE_WRAP_S, rnd.gl.REPEAT);
      rnd.gl.texParameteri(this.type, rnd.gl.TEXTURE_WRAP_T, rnd.gl.REPEAT);
    }
  }
}
 
export function texture(...args) {
  return new _texture(...args);
}