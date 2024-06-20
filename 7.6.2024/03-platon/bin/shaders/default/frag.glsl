#version 300 es
precision highp float;


in vec3 DrawPos;
in vec3 DrawNormal;

uniform float Time;

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

void main( void )
{
  vec3 L = normalize(vec3(0, 1, 3));
  vec3 N = normalize(faceforward(normalize(DrawNormal), -L, normalize(DrawNormal)));
  vec3 col = vec3(0.47, 0.30, 0.7) * dot(N, L);
  int n = Julia(DrawPos.xy, vec2(0.35, 0.39) + vec2(sin(Time / 10.0 * 2.0) / 47.0, cos(Time / 10.0 * 2.0) * 0.47));

  float d = length(vec3(0, 3.0, 3.0) - DrawPos);
  float cc = 0.1, cl = 0.1, cq = 0.1;
  float k = min(1.0, 2.0 / (cc + cl * d + cq * d * d));

  //col = vec3(float(n) / 255.0, float(n) / 150.0, float(n) / 100.0) * dot(N, L); 
  OutColor = vec4(col * k, 1);
  //OutColor = vec4(N, 1);
}