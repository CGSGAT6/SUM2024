import { vec3 } from "../../math/vec3";
import { ubo_buffer } from "./buffers";

const materialUBOBindingPoint = 1;

class _material {
  mtlPtn;

  name;
  ka;
  trans;
  kd;
  empty;
  ks;
  ph;
  materialUBO;

  constructor(mtlPtn, obj, name) {
    this.mtlPtn = mtlPtn;

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
  
    this.materialUBO = ubo_buffer(this.mtlPtn.rnd, "MaterialUBO", 12 * 4, materialUBOBindingPoint);
    let data = [].concat(this.ka.toArray4(this.trans), this.kd.toArray4(0), this.ks.toArray4(this.ph));
    this.materialUBO.update(new Float32Array(data));
  }

  apply() {
    this.mtlPtn.shd.apply();
    this.materialUBO.apply(this.mtlPtn.shd);
  }
}

export function material(...args) {
  return new _material(...args);
}