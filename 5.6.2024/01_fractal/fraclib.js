let
  canvas,
  gl,
  timeLoc,
  x = 0;

export function initGL() {
  canvas = document.getElementById("mainCanvas");
  gl = canvas.getContext("webgl2");

  gl.clearColor(0.30, 0.47, 0.8, 1);
  // shadersss
  let vs_txt = 
  `#version 300 es
  precision highp float;
  in vec3 InPosition;

  out vec2 DrawPos;
  uniform float Time;

  void main( void )
  {
    gl_Position = vec4(InPosition, 1);
    DrawPos = InPosition.xy;
  }
  `;

  let fs_txt = 
  `#version 300 es
  precision highp float;
  
  uniform float Time;

  in vec2 DrawPos;
  out vec4 OutColor;

  void main( void )
  {

    int n, tmp;
    vec2 b = DrawPos, b1;

    for (n = 0; n <= 255 && length(b) < 2.0; n++)
    {
      b1 = b;
      b.x = b1.x * b1.x - b1.y * b1.y;
      b.y = 2.0 * b1.x * b1.y;
      
      b += sin(Time) / 2.0;
    }
    OutColor = vec4(float(n) / 255.0, 0.0 * float(n) / 255.0, float(n) / 510.0, 1);
    //OutColor = vec4(1.0 * sin(DrawPos.x * 8.0 + Time * 5), abs(sin(Time) * DrawPos.y, 0, 1));
  }
  `;

  let 
    vs = loadShader(gl.VERTEX_SHADER, vs_txt),
    fs = loadShader(gl.FRAGMENT_SHADER, fs_txt),
    prg = gl.createProgram();

  gl.attachShader(prg, vs);
  gl.attachShader(prg, fs);
  gl.linkProgram(prg);

  if(!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    let buf = gl.getProgramInfoLog(prg);
    console.log("Program link fail" + buf);
  }
  // vertex buffer
  const size = 1;
  const vertexes = [-size, size, 0, -size, -size, 0, size, size, 0, size, -size, 0];
  const posLoc = gl.getAttribLocation(prg, "InPosition");
  let vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
  if (posLoc != -1) {
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
  }
  // uniform data

  timeLoc = gl.getUniformLocation(prg, "Time");

  gl.useProgram(prg);
}

// Main render frame function
export function render() {
  //console.log(`Frame ${x++}`);
  gl.clear(gl.COLOR_BUFFER_BIT);
                                               
  if (timeLoc != -1) {
    const date = new Date();
    let t = date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000;
 
    gl.uniform1f(timeLoc, t);
  }
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
} // End of 'render' function

// Load and compile shader function
function loadShader(shaderType, shaderSource) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let buf = gl.getShaderInfoLog(shader);
    console.log('Shader compile fail: ' + buf);
  }                                            
  return shader;
} // End of 'loadShader' function