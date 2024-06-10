// -------------------------------------------------
class _shader {
  glDrawingContext;
  name;

  async create() {
    this.id = null;
    this.shaders =
    [
       {
         id: null,
         type: this.glDrawingContext.VERTEX_SHADER,
         name: "vert",
         src: "",
       },
       {
        id: null,
        type: this.glDrawingContext.FRAGMENT_SHADER,
        name: "frag",
        src: "",
       }
    ];
    for (const s of this.shaders) {
      let response = await fetch(`bin/shaders/${this.name}/${s.name}.glsl`);
      let src = await response.text();
      if (typeof src == "string" && src != "")
        s.src = src;
    }
    // recompile shaders
    this.updateShadersSource();
 }  

  updateShadersSource() { 
    this.shaders[0].id = null;
    this.shaders[1].id = null;
    this.id = null;
    if (this.shaders[0].src == "" || this.shaders[1].src == "")
      return;
    this.shaders.forEach(s => {
      s.id = this.glDrawingContext.createShader(s.type);
      this.glDrawingContext.shaderSource(s.id, s.src);
      this.glDrawingContext.compileShader(s.id);
      if (!this.glDrawingContext.getShaderParameter(s.id, this.glDrawingContext.COMPILE_STATUS)) {
        let buf = this.glDrawingContext.getShaderInfoLog(s.id);
        console.log(`Shader ${this.name}/${s.name} compile fail: ${buf}`);
      }                                            
    });             
 
    this.id = this.glDrawingContext.createProgram();
    this.shaders.forEach(s => {
      if (s.id != null)
        this.glDrawingContext.attachShader(this.id, s.id);
    });
    this.glDrawingContext.linkProgram(this.id);
    if (!this.glDrawingContext.getProgramParameter(this.id, this.glDrawingContext.LINK_STATUS)) {
      let buf = this.glDrawingContext.getProgramInfoLog(this.id);
      console.log(`Shader program ${this.name} link fail: ${buf}`);
    }                                            
    this.updateShaderData();    
  }

  updateShaderData() {
    // Shader attributes
    this.attrs = {};
    const countAttrs = this.glDrawingContext.getProgramParameter(this.id, this.glDrawingContext.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < countAttrs; i++) {
      const info = this.glDrawingContext.getActiveAttrib(this.id, i);
      this.attrs[info.name] = {
        name: info.name,
        type: info.type,
        size: info.size,
        loc: this.glDrawingContext.getAttribLocation(this.id, info.name),
      };
    }
    
    // Shader uniforms
    this.uniforms = {};
    const countUniforms = this.glDrawingContext.getProgramParameter(this.id, this.glDrawingContext.ACTIVE_UNIFORMS);
    for (let i = 0; i < countUniforms; i++) {
      const info = this.glDrawingContext.getActiveUniform(this.id, i);
      this.uniforms[info.name] = {
        name: info.name,
        type: info.type,
        size: info.size,
        loc: this.glDrawingContext.getUniformLocation(this.id, info.name),
      };
    }

    // Shader uniform blocks
    this.uniformBlocks = {};
    const countUniformBlocks = this.glDrawingContext.getProgramParameter(this.id, this.glDrawingContext.ACTIVE_UNIFORM_BLOCKS);
    for (let i = 0; i < countUniformBlocks; i++) {
      const block_name = this.glDrawingContext.getActiveUniformBlockName(this.id, i);
      const index = this.glDrawingContext.getActiveUniformBlockIndex(this.id, block_name);
      this.uniformBlocks[block_name] = {
        name: block_name,
        index: index,
        size: this.glDrawingContext.getActiveUniformBlockParameter(this.id, idx, this.glDrawingContext.UNIFORM_BLOCK_DATA_SIZE),
        bind: this.glDrawingContext.getActiveUniformBlockParameter(this.id, idx, this.glDrawingContext.UNIFORM_BLOCK_BINDING),
      };
    }
    
  }
 
  constructor(name, rndObj) {
    this.glDrawingContext = rndObj.gl;
    this.name = name;
  }
 
  apply() {
    if (this.id != null)
      this.glDrawingContext.useProgram(this.id);
  }
}

export function shader(name, rndObj) {
  return new _shader(name, rndObj);
}