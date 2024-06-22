#version 300 es
precision highp float;
in vec3 InPosition;
in vec2 InTexCoords;

uniform PrimUBO
{
  mat4 MatrW;
  mat4 MatrVP;
  mat4 MatrWVP;
  mat4 MatrWInv;
};

out vec3 DrawPos;
out vec2 DrawTexCoords;

void main( void )
{
  vec2[4] vrtx = vec2[4](vec2(-1, -1), vec2(-1, 1), vec2(1, -1), vec2(1, 1));
  
  DrawPos = vec3(vrtx[gl_VertexID], -1);

  //gl_Position = vec4(vrtx[gl_VertexID], -1, 1);
  gl_Position = vec4(InPosition, 1);
  DrawTexCoords = InTexCoords;
}