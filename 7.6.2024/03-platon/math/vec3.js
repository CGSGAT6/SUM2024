class _vec3 {
  x;
  y;
  z;

  constructor(...args) { 
    if (args.length === 3)
      this.x = args[0], this.y = args[1], this.z = args[2];
    else if (typeof args[0] == "object") {
      this.x = args[0].x, this.y = args[0].y, this.z = args[0].z; 
    } else {
      this.x = args[0], this.y = args[0], this.z = args[0]; 
    }
  } // End of 'constructor' function

  // Vector multiplue by number function
  mulNum(num) {
    return vec3(this.x * num, this.y * num, this.z * num);
  } // End of 'mulNum' function

  // Vector divide by number function
  divNum(num) {
    return vec3(this.x / num, this.y / num, this.z / num);
  } // End of 'duvNum' function

  // Vector add number function
  addNum(num) {
    return vec3(this.x + num, this.y + num, this.z + num);
  } // End of 'addNum' function

  // Vector substract number function
  subNum(num) {
    return vec3(this.x - num, this.y - num, this.z - num);
  } // End of 'subNum' function

  // Vector add vector function
  addVec(vec) {
    return vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  } // End of 'addVec' function

  // Vector substract vector function
  subVec(vec) {
    return vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  } // End of 'subVec' function

  // Make vector negative vector
  neg(vec) {
    return vec3(-this.x, -this.y, -this.z);
  } // End of 'neg' function

  // Vector dot product function
  dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  } // End of 'dot' function

  // Vector cross product function
  cross(vec) {
    return vec3(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x);
  } // End of 'cross' function
  
  // Vector lenght evaulating function
  len() {
    let len = this.dot(this);

    if (len == 0 || len == 1)
      return len;

    return Math.sqrt(len);
  } // End of 'len' function

  // Square of vector lenght evaulating function
  len2() {
    return this.dot(this);
  } // End of 'len2' function

  // Vector normalizing function
  normalize() {
    return this.divNum(this.len());
  } // End of 'normalize' function

  // Vector setting normalize function
  setNormalize() {
    let l = this.len();

    this.x /= l;
    this.y /= l;
    this.z /= l;
  } // End of 'normalize' function

  // Vector transform by matrix function
  vectorTransform(a)
  {
    return vec3(this.x * a.m[0][0] + this.y * a.m[1][0] + this.z * a.m[2][0],
                this.x * a.m[0][1] + this.y * a.m[1][1] + this.z * a.m[2][1],
                this.x * a.m[0][2] + this.y * a.m[1][2] + this.z * a.m[2][2]);
  } // End of 'vectorTransform' function

  // Vector multiplue by matrix function
  mulMatr(m)
  {
    let w = this.x * a.m[0][3] + this.y * a.m[1][3] + this.z * a.m[2][3] + a.m[3][3];
  
    return vec3((this.x * a.m[0][0] + this.y * a.m[1][0] + this.z * a.m[2][0] + a.m[3][0]) / w,
                  (this.x * a.m[0][1] + this.y * a.m[1][1] + this.z * a.m[2][1] + a.m[3][1]) / w,
                  (this.x * a.m[0][2] + this.y * a.m[1][2] + this.z * a.m[2][2] + a.m[3][2]) / w);
  } // End of 'mulMatr' function

  pointTransform(m)
  {
    return vec3(this.x * a.m[0][0] + this.y * a.m[1][0] + this.z * a.m[2][0] + a.m[3][0],
              this.x * a.m[0][1] + this.y * a.m[1][1] + this.z * a.m[2][1] + a.m[3][1],
              this.x * a.m[0][2] + this.y * a.m[1][2] + this.z * a.m[2][2] + a.m[3][2]);
  } // End of 'pointTransform' function
}

// Vector setting function
export function vec3(...args) {
  return new _vec3(...args);
} // End of 'vec3' function
