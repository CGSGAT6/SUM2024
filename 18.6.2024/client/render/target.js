import { materialPattern } from "./res/material_pattern";
import { material } from "./res/materials";
import { prim } from "./res/prim";
import { texture } from "./res/textures";
import { vertex } from "./res/vertex";

class _renderTarget {
  gl;
  rnd;
  idFBO;
  colorAttachments = [];
  depthBuffer = {};
  names = [];
  prim;
  trgMtl;

  constructor(rnd, attachments, width, height, isDepth) { // attachments is array of attachments names : ["name 1", "name 2", ...]
    this.rnd = rnd;
    this.gl = rnd.gl;

    // create target material pattern
    let trgMtlPtn = materialPattern(
      "target material pattern",
      "target0",
      rnd,
      [
        {
          name: "Position",
          size: 12,
        },
        {
          name: "TexCoords",
          size: 8,
        },
        
      ]);

    // create target material
    this.trgMtl = material(
      trgMtlPtn,
      {},
      "trgMtl",
    );

    let vertexes = [
      -1, -1, -1, 0, 0,
      -1, 1, -1, 0, 1,
      1, -1, -1, 1, 0,
      1, 1, -1, 1, 1,
    ];

    // create target prim
    this.prim = prim(this.trgMtl, "triangle strip", vertexes);

    attachments.forEach(element => {
      this.names.push(element);
    });
    // generate frame buffer
    this.idFBO = this.gl.createFramebuffer();

    this.screenFBO = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);
    /*this.gl.clearBufferfv(this.gl.COLOR, 0, new Float32Array([0, 0, 0, 0]));*/

    // bind frame buffer
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.idFBO);

    // generate color attachments
    for (let i in attachments) {
      let tex = texture(
        rnd,
        {
          name: attachments[i],
          width: width,
          height: height,
        },
        "colorAttachment",
      );

      this.colorAttachments.push(tex);

      this.trgMtl.textureAttach(tex);

      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.COLOR_ATTACHMENT0 + Number(i),
        this.gl.TEXTURE_2D,
        tex.id,
        0,
      );
    }

    // generate texture for depth buffer
    this.depthBuffer.tex = texture(
      rnd,
      {
        name: "depth",
        width: width,
        height: height,
      },
      "depth",
    );
   
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.DEPTH_ATTACHMENT,
      this.gl.TEXTURE_2D,
      this.depthBuffer.tex.id,
      0
    );

    this.gl.drawBuffers([
      this.gl.COLOR_ATTACHMENT0,
      this.gl.COLOR_ATTACHMENT1,
      this.gl.COLOR_ATTACHMENT2,
      this.gl.COLOR_ATTACHMENT3,
      this.gl.COLOR_ATTACHMENT4,
      this.gl.COLOR_ATTACHMENT5,
    ]);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.screenFBO);
    this.gl.viewport(0, 0, this.rnd.canvas.width, this.rnd.canvas.height);

    //this.gl.clearBufferfv(this.gl.COLOR, 0, new Float32Array([0, 0, 0, 0]));
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


  }

  resize(width, height) {    
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.idFBO);

    // regenerate color attachments
    for (let i in this.names) {
      let tex = texture(
        this.rnd,
        {
          name: this.names[i],
          width: width,
          height: height,
        },
        "colorAttachment",
      );

      this.colorAttachments[i] = tex;

      this.trgMtl.textures[i] = tex;

      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.COLOR_ATTACHMENT0 + Number(i),
        this.gl.TEXTURE_2D,
        tex.id,
        0,
      );
    }

    // regenerate texture for depth buffer
    this.depthBuffer.tex = texture(
      this.rnd,
      {
        name: "depth",
        width: width,
        height: height,
      },
      "depth",
    );
   
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.DEPTH_ATTACHMENT,
      this.gl.TEXTURE_2D,
      this.depthBuffer.tex.id,
      0
    );

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.screenFBO);
  }

  start() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.idFBO);
    this.gl.viewport(0, 0, this.rnd.canvas.width, this.rnd.canvas.height);

    for (let i in this.names) {
      this.gl.clearBufferfv(this.gl.COLOR, Number(i), new Float32Array([0, 0, 0, 0]))
    }
    
    this.gl.clearBufferfv(this.gl.DEPTH, 0, new Float32Array([1]))
/*
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);*/
  }

  end() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.screenFBO);
    this.gl.viewport(0, 0, this.rnd.canvas.width, this.rnd.canvas.height);

    //this.gl.clearBufferfv(this.gl.COLOR, 0, new Float32Array([0, 0, 0, 0]));
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.rnd.drawPrim(this.prim);
  }
}

export function renderTarget(rnd, attachments, width, height, isDepth) {
  return new _renderTarget(rnd, attachments, width, height, isDepth);
}