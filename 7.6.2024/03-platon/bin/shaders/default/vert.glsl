#version 300 es
precision highp float;
in vec3 InPosition;
in vec3 InNormal;

uniform mat4 MatrWVP;
uniform mat4 MatrW;
uniform mat4 MatrWInv;

out vec3 DrawNormal;
out vec3 DrawPos;

void main( void )
{
  DrawNormal = mat3(MatrWInv) * InNormal;
  
  DrawPos = (MatrW * vec4(InPosition, 1)).xyz;
  DrawPos = InPosition.xyz;
  gl_Position = MatrWVP * vec4(InPosition, 1);
  
}