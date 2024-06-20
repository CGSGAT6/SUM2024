import { shader } from "./shaders";

class _materialPattern {
  shd;
  name;
  rnd;
  vertexFormat;

  constructor(name, shdName, rndObj, vertexFormat) {
    this.rnd = rndObj;
    this.name = name;
    this.shd = shader(shdName, rndObj);
    this.vertexFormat = vertexFormat;
  }
}

export function materialPattern(name, shdName, rndObj, vertexFormat = [
                                                                       {name : "Position",
                                                                       size : 12},
                                                                       {name : "Normal",
                                                                       size : 12}
                                                                      ]) {
  return new _materialPattern(name, shdName, rndObj, vertexFormat);
}