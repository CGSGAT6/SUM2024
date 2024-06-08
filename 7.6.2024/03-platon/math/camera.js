class camera {
  loc;   /* Camera location */
  at;    /* Camera look-at point */
  dir;   /* Camera direction */
  right; /* Camera right direction */
  up;    /* Camera up direction */

  matrView; /* View matrix */
  matrProj; /* Projection matrix */
  matrVP;   /* Stored (View * Proj) matrix */

  frameW; /* Frame width (in pixels) */
  frameH; /* Frame height (in pixels) */

  wp;          /* Project plane size (width) */
  hp;          /* Project plane size (height) */
  projSize;    /* Project plane fit square */
  projDist;    /* Distance to project plane from viewer (near) */
  projFarClip; /* Distance to project for clip plane (far) */

  set(loc, at, up)
  {
    this.matrView.setView(loc, at, up);

    this.right = vec3(this.matrView.m[0][0],
                      this.matrView.m[1][0],
                      this.matrView.m[2][0]);
    this.up = vec3(this.matrView.m[0][1],
                   this.matrView.m[1][1],
                   this.matrView.m[2][1]);
    this.dir = vec3(-this.matrView.m[0][2],
                    -this.matrView.m[1][2],
                    -this.matrView.m[2][2]);
    this.loc = vec3(loc);
    this.at = vec3(at);

    this.matrVP = this.matrView.mulMatr(this.matrProj);
  } // End of 'set' function

  setProj(projSize, projDist, projFarClip)
  {
    let rx, ry;

    this.projDist = projDist;
    this.projFarClip = projFarClip;
    rx = ry = this.projSize = projSize;

    /* Correct aspect ratio */
    if (this.frameW >= this.frameH)
      rx *= this.frameW / this.frameH;
    else
      ry *= this.frameH / this.frameW;

    this.wp = rx;
    this.hp = ry;
    this.matrProj.setFrustum(-rx / 2, rx / 2, -ry / 2, ry / 2, this.projDist, this.projFarClip);
    this.matrVP = this.matrView.mulMatr(this.matrProj);
  } // End of 'setProj' function

  setSize(frameW, frameH)
  {
    this.frameW = frameW;
    this.frameH = frameH;
    this.setProj(projSize, projDist, projFarClip);
  } // End of 'setSize' function
}