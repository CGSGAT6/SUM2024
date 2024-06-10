import { vec3 } from "../../math/vec3.js"

class _vertex {
  pos;
  norm;

  constructor(pos, norm) {
    this.pos = pos;

    if (norm == undefined)
      this.norm = vec3(0);
    else  
      this.norm = norm;
  }

  toArray() {
    return [this.pos.x, this.pos.y, this.pos.z, this.norm.x, this.norm.y, this.norm.z];
  }

  createVertexArray(...args) {
    let vs;

    if (args.length == 1 && Array.isArray(args[0]))
      vs = args[0];
    else
      vs = args;

    let v = []

    vs.forEach(element => {
      v.push(...element.toArray());
    });

    return v;
  }

  autoNormal(vertexes, indexes) {
    for (let i = 0; i < vertexes.length; i++){
      vertexes[i].norm = vec3(0);
    }

    if (indexes == undefined) {
      for (let i = 0; i < vertexes.length; ){
        let v1 = vertexes[i + 1].pos.subVec(vertexes[i].pos);
        let v2 = vertexes[i + 2].pos.subVec(vertexes[i].pos);

        let n = v1.cross(v2);
        
        vertexes[i].norm = vertexes[i].norm.addVec(n);
        vertexes[i + 1].norm = vertexes[i + 1].norm.addVec(n);
        vertexes[i + 2].norm = vertexes[i + 2].norm.addVec(n);

        i += 3;
      }
    } else {
      for (let j = 0; j < indexes.length; ) {
        if (indexes[j] == -1 || indexes[j + 1] == -1 || indexes[j + 2] == -1) {
          j++;
          continue;
        }

        let v1 = vertexes[indexes[j + 1]].pos.subVec(vertexes[indexes[j]].pos);
        let v2 = vertexes[indexes[j + 2]].pos.subVec(vertexes[indexes[j]].pos);

        let n = v1.cross(v2);
        
        vertexes[indexes[j]].norm = vertexes[indexes[j]].norm.addVec(n);
        vertexes[indexes[j + 1]].norm = vertexes[indexes[j + 1]].norm.addVec(n);
        vertexes[indexes[j + 2]].norm = vertexes[indexes[j + 2]].norm.addVec(n);

        j += 3;
      }
    }

    for (let i = 0; i < vertexes.length; i++){
      vertexes[i].norm = vertexes[i].norm.normalize();
    
    }  
    return vertexes;
  
  }

}

export function vertex(pos, norm) {
  return new _vertex(pos, norm);
}