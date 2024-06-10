import { shader } from "./shaders";

class _materialPattern {
  shd;
  name;
  shdName;
  vertexAttribArray;

  constructor(name, shdName, rndObj) {
    this.name = name;
    this.shd = shader(shdName, rndObj);
  }
}

export function materialPattern(name, shdName, rndObj) {
  return new _materialPattern(name, shdName, rndObj);
}