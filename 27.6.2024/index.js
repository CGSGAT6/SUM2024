let canvas,
  gl,
  timeLoc,
  texId,
  prg,
  vertexArray,
  vertexBuffer,
  indexBuffer;

export function initGL() {
  canvas = document.getElementById("can");
  gl = canvas.getContext("webgl2");

  gl.clearColor(0.3, 0.47, 0.8, 1);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // shaders
  let vs_txt = 
    `#version 300 es
    precision highp float;
    in vec3 InPosition;

    out vec2 DrawPos;

    void main( void )
    {
      DrawPos = InPosition.xy;
      gl_Position = vec4(InPosition.xy, 0, 1);
    }
    `;

  let fs_txt = `#version 300 es
  precision highp float;
  
  in vec2 DrawPos;
  out vec4 OutColor;

  int Julia( vec2 P, vec2 C )
  {
    vec2 b = P, b1;
    int n;

    for (n = 0; n <= 255 && length(b) < 2.0; n++)
      {
        b1 = b;
        b.x = b1.x * b1.x - b1.y * b1.y;
        b.y = 2.0 * b1.x * b1.y;
        
        b += C;
      }

    return n;
  }

  int Mandl( vec2 P )
  {
    vec2 b = P, b1, b0 = P;
    int n;

    for (n = 0; n <= 255 && length(b) < 2.0; n++)
      {
        b1 = b;
        b.x = b1.x * b1.x - b1.y * b1.y;
        b.y = 2.0 * b1.x * b1.y;
        
        b += P;
      }

    return n;
  }

  uniform float Time;
  uniform sampler2D Tex;

  void main( void )
  {

    vec2 TexCoords = (DrawPos + 1.0) / 2.0;
    
    vec3 Color = texture(Tex, TexCoords).rgb;

    OutColor = vec4(Color, 1);
  }
  `;

  let vs = loadShader(gl.VERTEX_SHADER, vs_txt),
      fs = loadShader(gl.FRAGMENT_SHADER, fs_txt);

  prg = gl.createProgram();

  gl.attachShader(prg, vs);
  gl.attachShader(prg, fs);
  gl.linkProgram(prg);

  if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    let buf = gl.getProgramInfoLog(prg);
    console.log("Program link fail" + buf);
  }
  
  // vertex buffer
  const size = 1;
  const vertexes = [
    -size,
    -size,
    0,
    size,
    -size,
    0,
    -size,
    size,
    0,
    size,
    size,
    0,
  ];

  const posLoc = gl.getAttribLocation(prg, "InPosition");
  
  vertexArray = gl.createVertexArray();

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);

  gl.bindVertexArray(vertexArray);
  if (posLoc != -1) {
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
  }

  const indexes = [
    0, 1, 2, 3,
  ]

  indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexes), gl.STATIC_DRAW);


  // uniform data
  timeLoc = gl.getUniformLocation(prg, "Time");
  
  let pixels = [
    255, 255, 255, 255, 0, 0, 0, 255,
    0, 0, 0, 255, 255, 255, 255, 255,
  ];

  texId = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texId);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA,
          gl.UNSIGNED_BYTE, new Uint8Array(pixels));

  gl.useProgram(prg);
}

// Main render frame function
export function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (timeLoc != -1) {
    const date = new Date();
    let time =
      date.getMinutes() * 60 +
      date.getSeconds() +
      date.getMilliseconds() / 1000;

    timeLoc = gl.getUniformLocation(prg, "Time");
    gl.uniform1f(timeLoc, time);
  }

  gl.useProgram(prg);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bindVertexArray(vertexArray);

  let texLoc = gl.getUniformLocation(prg, "Tex");

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texId);
  gl.uniform1i(texLoc, 0);

  if (indexBuffer != undefined) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_INT, 0);
  }
  else 
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
} // End of 'render' function

//new Float32Array(vertexes)

// Load and compile shader function
function loadShader(shaderType, shaderSource) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let buf = gl.getShaderInfoLog(shader);
    console.log("Shader compile fail: " + buf);
  }
  return shader;
} // End of 'loadShader' function

window.addEventListener("load", () => {
  initGL();

  const draw = () => {
    // drawing
    render();

    // animation register
    window.requestAnimationFrame(draw);
  };
  draw();
});

