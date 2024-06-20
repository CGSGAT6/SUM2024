import { vec3 } from "../../math/vec3";
import { ubo_buffer } from "./buffers";

const materialUBOBindingPoint = 1;

class _material {
  mtlPtn;
  gl;

  name;
  ka;
  trans;
  kd;
  empty;
  ks;
  ph;

  textureFlags = [0, 0, 0, 0, 0, 0, 0, 0];
  textures = [];
  materialUBO;

  constructor(mtlPtn, obj, name) {
    this.mtlPtn = mtlPtn;
    this.gl = mtlPtn.shd.glDrawingContext;

    if (obj.ka != undefined)
      this.ka = vec3(obj.ka);
    else
      this.ka = vec3(0);
    if (obj.kd != undefined)
      this.kd = vec3(obj.kd);
    else
      this.kd = vec3(0);
    if (obj.ks != undefined)
      this.ks = vec3(obj.ks);
    else
      this.ks = vec3(0);
    if (obj.trans != undefined)
      this.trans = obj.trans;
    else
      this.trans = 0;
    if (obj.ph != undefined)
      this.ph = obj.ph;
    else
      this.ph = 0;
  
    this.materialUBO = ubo_buffer(this.mtlPtn.rnd, "MaterialUBO", 12 * 4 + 4 * 8, materialUBOBindingPoint);
    let data = [].concat(this.ka.toArray4(this.trans), this.kd.toArray4(0), this.ks.toArray4(this.ph));
    this.materialUBO.update(new Float32Array(data));
  }

  apply() {
    this.mtlPtn.shd.apply();
    this.materialUBO.apply(this.mtlPtn.shd);

    for (let i in this.textureFlags) {
      if (this.textureFlags[i]) {
        this.gl.activeTexture(this.gl.TEXTURE0 + Number(i));

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[i].id);

      }
    }
  }

  textureAttach(tex) {
    if (this.textures.length < 8) {
      this.textureFlags[this.textures.length] = 1;
      this.textures[this.textures.length] = tex;
      this.materialUBO.update(new Float32Array(this.textureFlags));
    }
  }
}

export function material(...args) {
  return new _material(...args);
}