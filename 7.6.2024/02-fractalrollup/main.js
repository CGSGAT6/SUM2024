let
  canvas,
  gl,
  timeLoc,
  lastShift = false,
  mouseStart = [0.0, 0.0],
  mouseEnd = [1000.0, 1000.0],
  mouseStartLoc,
  mouseEndLoc,
  mse = [0.0, 0.0],
  mee = [1000.0, 1000.0],
  canW = 1000,
  canwLoc,
  d = 1000,
  dLoc,
  corner = [0, 0],
  cornerLoc,
  x = 0;

export function initGL() {
  canvas = document.getElementById("myCan");
  gl = canvas.getContext("webgl2");

  gl.clearColor(0.30, 0.47, 0.8, 1);

  // shaders
  let vs_txt = 
  `#version 300 es
  precision highp float;
  in vec3 InPosition;

  out vec2 DrawPos;
  uniform float Time;
  uniform vec2 MouseStart;
  uniform vec2 MouseEnd;
  uniform float CanW;
  uniform float Dem;
  uniform vec2 Corner;

  float my_mod( float a, float b )
  {
    float n = floor(a / b);

    return a - n * b;
  }

  void main( void )
  {
    vec2 Ms;
    vec2 Me;
    
    Ms = Corner + MouseStart * Dem / CanW;
    Me = Corner + MouseEnd * Dem / CanW;
    float dx = abs(Ms.x - Me.x);
    float dy = abs(Ms.y - Me.y);
    float d = max(dx, dy);

    vec2 pos;

    vec2 c = (min(Ms, Me) + d / 2.0 - CanW / 2.0) * 2.0;
    
    pos = c + InPosition.xy * d;
    pos /= CanW;
    pos.y *= -1.0;
  /*
    float dx = abs(MouseStart.x - MouseEnd.x);
    float dy = abs(MouseStart.y - MouseEnd.y);
    float d = max(dx, dy);

    vec2 pos;

    vec2 c = (min(MouseStart, MouseEnd) + d / 2.0 - CanW / 2.0) * 2.0;
    
    pos = c + InPosition.xy * d;
    pos /= CanW;
    pos.y *= -1.0;
    */
    /*
    vec2 c = min(MouseStart, MouseEnd) + d / 2.0;
    
    pos = c + InPosition.xy * d / 2.0 * d / d1;
    pos /= CanW / 2.0;
    pos -= 1.0;
    pos.y *= -1.0;
    */
    DrawPos = pos;
    //DrawPos = vec2(0) + vec2(0.3) * InPosition.xy;
    DrawPos = InPosition.xy;
    //gl_Position = vec4(DrawPos, 0, 1);
    gl_Position = vec4(InPosition.xy, 0, 1);
    //DrawPos = (InPosition.xy) / (my_mod(Time, 20.0));
    //DrawPos = InPosition.xy;
  }
  `;

  let fs_txt = 
  `#version 300 es
  precision highp float;
  
  uniform float Time;
  uniform vec2 MouseStart;
  uniform vec2 MouseEnd;

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

  void main( void )
  {

    int n, tmp;

    //n = Julia(DrawPos, vec2(0.35, 0.39));
    //n = Julia(DrawPos, vec2(sin(Time) * 0.5, cos(Time ) * -0.33));
    n = Julia(DrawPos, vec2(0.35, 0.39) + vec2(sin(Time) * cos(Time / 2.0) / 47.0, cos(Time) * sin(Time * 2.0) * 0.47));
    //n = Mandl(DrawPos);
    //n = Julia(DrawPos, vec2(sin(MouseStart / 1000.0)));

    //OutColor = vec4(6.0 / (float(n) + 0.0), 7.0 / (float(n) + 0.0), 8.0 / (float(n) + 0.0), 1);
    OutColor = vec4(float(n) / 255.0, float(n) / 150.0, float(n) / 100.0, 1);
    //OutColor = vec4(1.0, 1.0, sin(Time), 1);
    //OutColor = vec4(floor(DrawPos.yx * 10.0) / 10.0, 0, 1);
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
  dLoc = gl.getUniformLocation(prg, "Dem");
  mouseStartLoc = gl.getUniformLocation(prg, "MouseStart");
  mouseEndLoc = gl.getUniformLocation(prg, "MouseEnd");
  canwLoc = gl.getUniformLocation(prg, "CanW");
  cornerLoc = gl.getUniformLocation(prg, "Corner");

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
  if (mouseStartLoc != -1 && mouseEndLoc != -1)
  {
    gl.uniform2fv(mouseStartLoc, new Float32Array(mse));
    gl.uniform2fv(mouseEndLoc, new Float32Array(mee));
  }
  if (canwLoc != -1) {
    let can = document.getElementById("myCan");
    canW = can.clientWidth;

    gl.uniform1f(canwLoc, canW);
  }
  if (dLoc != -1 && lastShift == false)
    gl.uniform1f(dLoc, d);
  if (cornerLoc != -1 && lastShift == false)
    gl.uniform2fv(cornerLoc, new Float32Array(corner));
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
    console.log('Shader compile fail: ' + buf);
  }                                            
  return shader;
} // End of 'loadShader' function

function mouseDown(event) {
  console.log("down");

  if (lastShift == false)
  {
    corner = [corner[0] + Math.min(mouseStart[0], mouseEnd[0]) * d / canW, corner[1] + Math.min(mouseStart[1], mouseEnd[1]) * d / canW];
    //Ms = Corner + MouseStart * Dem / CanW;
    d = Math.max(Math.abs(mse[0] - mee[0]), Math.abs(mse[1] - mee[1])) * d / canW;
    mouseStart = [event.offsetX, event.offsetY];
    console.log("start");
    lastShift = true;    
  }
  /*
  if (event.shiftKey == true && lastShift == false) {
    mouseStart = [event.clientX, event.clientY];
    console.log("start");
    lastShift = true;
  }
  else if (event.shiftKey == false && lastShift == true) {
    mouseEnd = [event.clientX, event.clientY];
    console.log("end");
    lastShift = false;
    mse = mouseStart;
    mee = mouseEnd;
  }
  */
}

function mouseUp(event) {
  console.log("up");

  if (lastShift == true) {
    mouseEnd = [event.offsetX, event.offsetY];
    console.log("end");
    lastShift = false; 
    
    console.log(`d = ${d}`);
    console.log(`Mouse start = ${mouseStart}`);
    console.log(`Mouse end = ${mouseEnd}`);
    console.log(`Mouse start old = ${mse}`);
    console.log(`Mouse end old = ${mee}`);

    mse = mouseStart;
    mee = mouseEnd;
  }
  /*
  if (event.shiftKey == true && lastShift == false) {
    mouseStart = [event.clientX, event.clientY];
    console.log("start");
    lastShift = true;
  }
  else if (event.shiftKey == false && lastShift == true) {
    mouseEnd = [event.clientX, event.clientY];
    console.log("end");
    lastShift = false;
    mse = mouseStart;
    mee = mouseEnd;
  }
  */
}

window.addEventListener("load", () => {
  initGL();

  let can = document.getElementById("myCan");

  can.addEventListener("mousedown", (event) => {
    mouseDown(event);
    //console.log(event);
  });
  can.addEventListener("mouseup", (event) => {
    mouseUp(event);
    //console.log(event);
  });


  const draw = () => {
    // drawing
    render();

    // animation register
    window.requestAnimationFrame(draw);
  };
  draw();
});

