class _mat4 {
  m = 
  [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  
  constructor(...args) {
    if (args.length == 1 &&  Array.isArray(args[0]) && typeof args[0][0] == "number")
      this.m = 
      [
        [args[0][0], args[0][1], args[0][2], args[0][3]],
        [args[0][4], args[0][5], args[0][6], args[0][7]],
        [args[0][8], args[0][9], args[0][10], args[0][11]],
        [args[0][12], args[0][13], args[0][14], args[0][15]]
      ];
    else if (args.length == 1 && typeof args[0] == "object" && !Array.isArray(args[0]))
      this.m = 
      [
        [args[0].m[0][0], args[0].m[0][1], args[0].m[0][2], args[0].m[0][3]],
        [args[0].m[1][0], args[0].m[1][1], args[0].m[1][2], args[0].m[1][3]],
        [args[0].m[2][0], args[0].m[2][1], args[0].m[2][2], args[0].m[2][3]],
        [args[0].m[3][0], args[0].m[3][1], args[0].m[3][2], args[0].m[3][3]],
      ];
    else if (args.length == 1 && args[0].length == 4 && Array.isArray(args[0][0])) {
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
          this.m[i][j] = args[0][i][j];
    } else if (args[0].length == 16) {
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 4; j++)
            this.m[i][j] = args[0][i * 4 + j];
    } else {
      for (let i = 0; i < 16; i++)
        this.m[i] = args[0];
    }
  }
}

export function mat4(...args) {
  return new _mat4(...args);
}
