import { shader } from "./shaders";

class _materialPattern {
  shd;
  name;
  vertexFormat;

  constructor(vertexFormat, name, shdName, rndObj) {
    this.name = name;
    this.vertexFormat = vertexFormat;
    this.shd = shader(shdName, rndObj);
  }
}

export function materialPattern(vertexFormat, name, shdName, rndObj) {
  return new _materialPattern(vertexFormat, name, shdName, rndObj);
}