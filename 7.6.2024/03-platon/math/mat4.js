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
      /*for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
          this.m[i][j] = args[0][i * 4 + j];*/
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
    } else if (args.length == 4 && Array.isArray(args[0])) {
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
          this.m[i][j] = args[i][j];
    } else if (args.length == 16) {
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 4; j++)
            this.m[i][j] = args[i * 4 + j];
    } else if (args.length == 1 && typeof args[0] == "number") {
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 4; j++)
            this.m[i][j] = args[0];
    }
  }

  setIdentity() {
    this.m = 
    [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  identity() {
    return new _mat4();
  }

  determ() {
    return this.m[0][0] * matrDeterm3x3(this.m[1][1], this.m[1][2], this.m[1][3],
                                        this.m[2][1], this.m[2][2], this.m[2][3],
                                        this.m[3][1], this.m[3][2], this.m[3][3]) +
          -this.m[0][1] * matrDeterm3x3(this.m[1][0], this.m[1][2], this.m[1][3],
                                        this.m[2][0], this.m[2][2], this.m[2][3],
                                        this.m[3][0], this.m[3][2], this.m[3][3]) +
          +this.m[0][2] * matrDeterm3x3(this.m[1][0], this.m[1][1], this.m[1][3],
                                        this.m[2][0], this.m[2][1], this.m[2][3],
                                        this.m[3][0], this.m[3][1], this.m[3][3]) +
          -this.m[0][3] * matrDeterm3x3(this.m[1][0], this.m[1][1], this.m[1][2],
                                        this.m[2][0], this.m[2][1], this.m[2][2],
                                        this.m[3][0], this.m[3][1], this.m[3][2]);
  }

  setTranslate(v) {
    this.m = 
    [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [v.x, v.y, v.z, 1]
    ];
  }

  translate(v) {
    return mat4([1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [v.x, v.y, v.z, 1]);
  }

  mulMatr(a)
  {
    let r = mat4();

    r.m[0][0] = this.m[0][0] * a.m[0][0] + this.m[0][1] * a.m[1][0] + this.m[0][2] * a.m[2][0] +
      this.m[0][3] * a.m[3][0];

    r.m[0][1] = this.m[0][0] * a.m[0][1] + this.m[0][1] * a.m[1][1] + this.m[0][2] * a.m[2][1] +
      this.m[0][3] * a.m[3][1];

    r.m[0][2] = this.m[0][0] * a.m[0][2] + this.m[0][1] * a.m[1][2] + this.m[0][2] * a.m[2][2] +
      this.m[0][3] * a.m[3][2];

    r.m[0][3] = this.m[0][0] * a.m[0][3] + this.m[0][1] * a.m[1][3] + this.m[0][2] * a.m[2][3] +
      this.m[0][3] * a.m[3][3];


    r.m[1][0] = this.m[1][0] * a.m[0][0] + this.m[1][1] * a.m[1][0] + this.m[1][2] * a.m[2][0] +
      this.m[1][3] * a.m[3][0];

    r.m[1][1] = this.m[1][0] * a.m[0][1] + this.m[1][1] * a.m[1][1] + this.m[1][2] * a.m[2][1] +
      this.m[1][3] * a.m[3][1];

    r.m[1][2] = this.m[1][0] * a.m[0][2] + this.m[1][1] * a.m[1][2] + this.m[1][2] * a.m[2][2] +
      this.m[1][3] * a.m[3][2];

    r.m[1][3] = this.m[1][0] * a.m[0][3] + this.m[1][1] * a.m[1][3] + this.m[1][2] * a.m[2][3] +
      this.m[1][3] * a.m[3][3];


    r.m[2][0] = this.m[2][0] * a.m[0][0] + this.m[2][1] * a.m[1][0] + this.m[2][2] * a.m[2][0] +
      this.m[2][3] * a.m[3][0];

    r.m[2][1] = this.m[2][0] * a.m[0][1] + this.m[2][1] * a.m[1][1] + this.m[2][2] * a.m[2][1] +
      this.m[2][3] * a.m[3][1];

    r.m[2][2] = this.m[2][0] * a.m[0][2] + this.m[2][1] * a.m[1][2] + this.m[2][2] * a.m[2][2] +
      this.m[2][3] * a.m[3][2];

    r.m[2][3] = this.m[2][0] * a.m[0][3] + this.m[2][1] * a.m[1][3] + this.m[2][2] * a.m[2][3] +
      this.m[2][3] * a.m[3][3];


    r.m[3][0] = this.m[3][0] * a.m[0][0] + this.m[3][1] * a.m[1][0] + this.m[3][2] * a.m[2][0] +
      this.m[3][3] * a.m[3][0];

    r.m[3][1] = this.m[3][0] * a.m[0][1] + this.m[3][1] * a.m[1][1] + this.m[3][2] * a.m[2][1] +
      this.m[3][3] * a.m[3][1];

    r.m[3][2] = this.m[3][0] * a.m[0][2] + this.m[3][1] * a.m[1][2] + this.m[3][2] * a.m[2][2] +
      this.m[3][3] * a.m[3][2];

    r.m[3][3] = this.m[3][0] * a.m[0][3] + this.m[3][1] * a.m[1][3] + this.m[3][2] * a.m[2][3] +
      this.m[3][3] * a.m[3][3];

    return r;
  }

  inverse() {
    let r = mat4();
    let det = this.determ();

    if (det == 0)
      return;

    /* build adjoint matrix */
    r.m[0][0] =
      +matrDeterm3x3(this.m[1][1], this.m[1][2], this.m[1][3],
                     this.m[2][1], this.m[2][2], this.m[2][3],
                     this.m[3][1], this.m[3][2], this.m[3][3]) / det;

    r.m[1][0] =
      -matrDeterm3x3(this.m[1][0], this.m[1][2], this.m[1][3],
                     this.m[2][0], this.m[2][2], this.m[2][3],
                     this.m[3][0], this.m[3][2], this.m[3][3]) / det;

    r.m[2][0] =
      +matrDeterm3x3(this.m[1][0], this.m[1][1], this.m[1][3],
                     this.m[2][0], this.m[2][1], this.m[2][3],
                     this.m[3][0], this.m[3][1], this.m[3][3]) / det;

    r.m[3][0] =
      -matrDeterm3x3(this.m[1][0], this.m[1][1], this.m[1][2],
                     this.m[2][0], this.m[2][1], this.m[2][2],
                     this.m[3][0], this.m[3][1], this.m[3][2]) / det;

    r.m[0][1] =
      -matrDeterm3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                     this.m[2][1], this.m[2][2], this.m[2][3],
                     this.m[3][1], this.m[3][2], this.m[3][3]) / det;

    r.m[1][1] =
      +matrDeterm3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                     this.m[2][0], this.m[2][2], this.m[2][3],
                     this.m[3][0], this.m[3][2], this.m[3][3]) / det;

    r.m[2][1] =
      -matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                     this.m[2][0], this.m[2][1], this.m[2][3],
                     this.m[3][0], this.m[3][1], this.m[3][3]) / det;

    r.m[3][1] =
      +matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                     this.m[2][0], this.m[2][1], this.m[2][2],
                     this.m[3][0], this.m[3][1], this.m[3][2]) / det;


    r.m[0][2] =
      +matrDeterm3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                     this.m[1][1], this.m[1][2], this.m[1][3],
                     this.m[3][1], this.m[3][2], this.m[3][3]) / det;

    r.m[1][2] =
      -matrDeterm3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                     this.m[1][0], this.m[1][2], this.m[1][3],
                     this.m[3][0], this.m[3][2], this.m[3][3]) / det;

    r.m[2][2] =
      +matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                     this.m[1][0], this.m[1][1], this.m[1][3],
                     this.m[3][0], this.m[3][1], this.m[3][3]) / det;

    r.m[3][2] =
      -matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                     this.m[1][0], this.m[1][1], this.m[1][2],
                     this.m[3][0], this.m[3][1], this.m[3][2]) / det;


    r.m[0][3] =
      -matrDeterm3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                     this.m[1][1], this.m[1][2], this.m[1][3],
                     this.m[2][1], this.m[2][2], this.m[2][3]) / det;

    r.m[1][3] =
      +matrDeterm3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                     this.m[1][0], this.m[1][2], this.m[1][3],
                     this.m[2][0], this.m[2][2], this.m[2][3]) / det;

    r.m[2][3] =
      -matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                     this.m[1][0], this.m[1][1], this.m[1][3],
                     this.m[2][0], this.m[2][1], this.m[2][3]) / det;

    r.m[3][3] =
      +matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                     this.m[1][0], this.m[1][1], this.m[1][2],
                     this.m[2][0], this.m[2][1], this.m[2][2]) / det;

    return r;
  }

  setInverse() {
    let r = mat4();
    let det = this.determ();

    if (det == 0)
      this.setIdentity();

    /* build adjoint matrix */
    r.m[0][0] =
      +matrDeterm3x3(this.m[1][1], this.m[1][2], this.m[1][3],
                     this.m[2][1], this.m[2][2], this.m[2][3],
                     this.m[3][1], this.m[3][2], this.m[3][3]) / det;

    r.m[1][0] =
      -matrDeterm3x3(this.m[1][0], this.m[1][2], this.m[1][3],
                     this.m[2][0], this.m[2][2], this.m[2][3],
                     this.m[3][0], this.m[3][2], this.m[3][3]) / det;

    r.m[2][0] =
      +matrDeterm3x3(this.m[1][0], this.m[1][1], this.m[1][3],
                     this.m[2][0], this.m[2][1], this.m[2][3],
                     this.m[3][0], this.m[3][1], this.m[3][3]) / det;

    r.m[3][0] =
      -matrDeterm3x3(this.m[1][0], this.m[1][1], this.m[1][2],
                     this.m[2][0], this.m[2][1], this.m[2][2],
                     this.m[3][0], this.m[3][1], this.m[3][2]) / det;

    r.m[0][1] =
      -matrDeterm3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                     this.m[2][1], this.m[2][2], this.m[2][3],
                     this.m[3][1], this.m[3][2], this.m[3][3]) / det;

    r.m[1][1] =
      +matrDeterm3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                     this.m[2][0], this.m[2][2], this.m[2][3],
                     this.m[3][0], this.m[3][2], this.m[3][3]) / det;

    r.m[2][1] =
      -matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                     this.m[2][0], this.m[2][1], this.m[2][3],
                     this.m[3][0], this.m[3][1], this.m[3][3]) / det;

    r.m[3][1] =
      +matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                     this.m[2][0], this.m[2][1], this.m[2][2],
                     this.m[3][0], this.m[3][1], this.m[3][2]) / det;


    r.m[0][2] =
      +matrDeterm3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                     this.m[1][1], this.m[1][2], this.m[1][3],
                     this.m[3][1], this.m[3][2], this.m[3][3]) / det;

    r.m[1][2] =
      -matrDeterm3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                     this.m[1][0], this.m[1][2], this.m[1][3],
                     this.m[3][0], this.m[3][2], this.m[3][3]) / det;

    r.m[2][2] =
      +matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                     this.m[1][0], this.m[1][1], this.m[1][3],
                     this.m[3][0], this.m[3][1], this.m[3][3]) / det;

    r.m[3][2] =
      -matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                     this.m[1][0], this.m[1][1], this.m[1][2],
                     this.m[3][0], this.m[3][1], this.m[3][2]) / det;


    r.m[0][3] =
      -matrDeterm3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                     this.m[1][1], this.m[1][2], this.m[1][3],
                     this.m[2][1], this.m[2][2], this.m[2][3]) / det;

    r.m[1][3] =
      +matrDeterm3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                     this.m[1][0], this.m[1][2], this.m[1][3],
                     this.m[2][0], this.m[2][2], this.m[2][3]) / det;

    r.m[2][3] =
      -matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                     this.m[1][0], this.m[1][1], this.m[1][3],
                     this.m[2][0], this.m[2][1], this.m[2][3]) / det;

    r.m[3][3] =
      +matrDeterm3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                     this.m[1][0], this.m[1][1], this.m[1][2],
                     this.m[2][0], this.m[2][1], this.m[2][2]) / det;

    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4 ; j++)
        this.m[i][j] = r.m[i][j];
  }

  rotate(angle, v) {
    let a = angle * Math.PI / 180, s = Math.sin(a), c = Math.cos(a);

    return mat4(
        c + v.x * v.x * (1 - c), v.y * v.x * (1 - c) - v.z * s, v.z * v.x * (1 - c) + v.y * s, 0,
        v.x * v.y * (1 - c) + v.z * s, c + v.y * v.y * (1 - c), v.z * v.y * (1 - c) - v.x * s, 0,
        v.x * v.z * (1 - c) - v.y * s, v.y * v.z * (1 - c) + v.x * s, c + v.z * v.z * (1 - c), 0,
        0, 0, 0, 1);
  }

  setRotate(angle, v) {
    let a = angle * Math.PI / 180, s = Math.sin(a), c = Math.cos(a);

    this.m =
    [
      [c + v.x * v.x * (1 - c), v.y * v.x * (1 - c) - v.z * s, v.z * v.x * (1 - c) + v.y * s, 0],
      [v.x * v.y * (1 - c) + v.z * s, c + v.y * v.y * (1 - c), v.z * v.y * (1 - c) - v.x * s, 0],
      [v.x * v.z * (1 - c) - v.y * s, v.y * v.z * (1 - c) + v.x * s, c + v.z * v.z * (1 - c), 0],
      [0, 0, 0, 1]
    ];
  }

  view(Loc, At, Up1) {
    let
      Dir = At.subVec(Loc).normalize(),
      Right = Dir.cross(Up1).normalize(),
      Up = Right.cross(Dir).normalize();
    
    return mat4(Right.X, Up.X, -Dir.X, 0,
                 Right.Y, Up.Y, -Dir.Y, 0,
                 Right.Z, Up.Z, -Dir.Z, 0,
                 -Vec3DotVec3(Loc, Right), -Vec3DotVec3(Loc, Up), Vec3DotVec3(Loc, Dir), 1);
  }

  setView(Loc, At, Up1) {
    let
      Dir = At.subVec(Loc).normalize(),
      Right = Dir.cross(Up1).normalize(),
      Up = Right.cross(Dir).normalize();
    
    this.m =
    [
      [Right.X, Up.X, -Dir.X, 0],
      [Right.Y, Up.Y, -Dir.Y, 0],
      [Right.Z, Up.Z, -Dir.Z, 0],
      [-Vec3DotVec3(Loc, Right), -Vec3DotVec3(Loc, Up), Vec3DotVec3(Loc, Dir), 1]
    ];
  }

  frustum(left, right, bottom, top, near, far) {
    return mat4((2 * near) / (right - left), 0, 0, 0,
                    0, (2 * near) / (top - bottom), 0, 0,
                    (right + left) / (right - left), (top + bottom) / (top - bottom), (-((far + near) / (far - near))), (-1),
                    0, 0, (-((2 * near * far) / (far - near))), 0);
  }

  setFrustum(left, right, bottom, top, near, far) {
    this.m =
    [
      [(2 * near) / (right - left), 0, 0, 0],
      [0, (2 * near) / (top - bottom), 0, 0],
      [(right + left) / (right - left), (top + bottom) / (top - bottom), (-((far + near) / (far - near))), (-1)],
      [0, 0, (-((2 * near * far) / (far - near))), 0]
    ];
  }

  transpose(a) {
    return mat4(a.m[0][0], a.m[1][0], a.m[2][0], a.m[3][0],
                a.m[0][1], a.m[1][1], a.m[2][1], a.m[3][1],
                a.m[0][2], a.m[1][2], a.m[2][2], a.m[3][2],
                a.m[0][3], a.m[1][3], a.m[2][3], a.m[3][3]);
  }

  setTranspose() {
    this.m = 
    [
      [this.m[0][0], this.m[1][0], this.m[2][0], this.m[3][0]],
      [this.m[0][1], this.m[1][1], this.m[2][1], this.m[3][1]],
      [this.m[0][2], this.m[1][2], this.m[2][2], this.m[3][2]],
      [this.m[0][3], this.m[1][3], this.m[2][3], this.m[3][3]]
    ];
  }

  rotateX(angleInDegree) {
    let a = angleInDegree * Math.PI / 180, si = Math.sin(a), co = Math.cos(a);

    return mat4(1, 0, 0, 0,
                0, co, si, 0,
                0, -si, co, 0,
                0, 0, 0, 1);
  }

  setRotateX(angleInDegree) {
    let a = angleInDegree * Math.PI / 180, si = Math.sin(a), co = Math.cos(a);

    this.m = 
    [
      [1, 0, 0, 0],
      [0, co, si, 0],
      [0, -si, co, 0],
      [0, 0, 0, 1]
    ];
  }

  rotateY(angleInDegree) {
    let a = angleInDegree * Math.PI / 180, si = Math.sin(a), co = Math.cos(a);

    return mat4(co, 0, -si, 0,
                0, 1, 0, 0,
                si, 0, co, 0,
                0, 0, 0, 1);
  }

  setRotateY(angleInDegree) {
    let a = angleInDegree * Math.PI / 180, si = Math.sin(a), co = Math.cos(a);

    this.m = 
    [
      [co, 0, -si, 0],
      [0, 1, 0, 0],
      [si, 0, co, 0],
      [0, 0, 0, 1]
    ];
  }

  rotateZ(angleInDegree) {
    let a = angleInDegree * Math.PI / 180, si = Math.sin(a), co = Math.cos(a);

    return mat4(co, si, 0, 0,
                -si, co, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1);
  }

  setRotateZ(angleInDegree)
  {
    let a = angleInDegree * Math.PI / 180, si = Math.sin(a), co = Math.cos(a);

    this.m = 
    [
      [co, si, 0, 0],
      [-si, co, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  scale(v) {
    return mat4(v.x, 0, 0, 0,
                0, v.y, 0, 0,
                0, 0, v.z, 0,
                0, 0, 0, 1);
  }

  setScale(v) {
    this.m =
    [
      [v.x, 0, 0, 0],
      [0, v.y, 0, 0],
      [0, 0, v.z, 0],
      [0, 0, 0, 1]
    ];
  }

  ortho(left, right, bottom, top, near, far)
  {
    return mat4(2 / (right - left), 0, 0, 0,
                0, 2 / (top - bottom), 0, 0,
                0, 0, -2 / (far - near), 0,
                -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1);
  }

  setOrtho(left, right, bottom, top, near, far)
  {
    this.m =
    [
      [2 / (right - left), 0, 0, 0],
      [0, 2 / (top - bottom), 0, 0],
      [0, 0, -2 / (far - near), 0],
      [-(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1]
    ];
  }

  toArray() {
    return [].concat(...this.m);
  }
}

export function mat4(...args) {
  return new _mat4(...args);
}

function matrDeterm3x3(a11, a12, a13,
                       a21, a22, a23,
                       a31, a32, a33) {
  return a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32 -
         a11 * a23 * a32 - a12 * a21 * a33 - a13 * a22 * a31;
}