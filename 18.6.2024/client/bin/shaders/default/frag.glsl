#version 300 es
precision highp float;

#define D2R(a) a * 3.1415 / 180.0

in vec3 DrawPos;
in vec3 DrawNormal;

uniform MaterialUBO
{
  vec4 KaTrans;
  vec4 Kd4;
  vec4 KsPh;
};

uniform FrameUBO
{
  vec4 CamLocTime;
  vec4 CamAtDeltaTime;
  vec4 CamDirGlobalTime;
  vec4 CamRightGlobalDeltaTime;
  vec4 CamUpFPS;
};

#define CamLoc CamLocTime.rgb
#define CamAt CamAtDeltaTime.rgb
#define CamDirGlobal CamDirGlobalTime.rgb
#define CamRightGlobal CamRightGlobalDeltaTime.rgb
#define CamUp CamUpFPS.rgb
#define Time CamLocTime.a
#define DeltaTime CamAtDeltaTime.a
#define GlobalTime CamDirGlobalTime.a
#define GlobalDeltaTime CamRightGlobalDeltaTime.CamAtDeltaTime.a
#define FPS CamUpFPS.a

#define Ka KaTrans.rgb
#define Kd Kd4.rgb
#define Ks KsPh.rgb
#define Trans KaTrans.a
#define Ph KsPh.a

out vec4 OutColor;

/* Phong light model shading function.
 * ARGUMENTS:
 *   - position:
 *       vec3 P;
 *   - normal:
 *       vec3 N;
 *   - ambient:
 *       vec3 MtlKa;
 *   - diffuse:
 *       vec3 MtlKd;
 *   - specular:
 *       vec3 MtlKs;
 *   - shinnes:
 *       float MtlPh;
 *   - light position:
 *       vec3 LightPos
 *   - light color:
 *       vec3 LightCol
 * RETURNS: lighted fragment.
 */
vec3 Shade( vec3 P, vec3 N, vec3 MtlKa, vec3 MtlKd, vec3 MtlKs, float MtlPh, vec3 LightPos, vec3 LightCol )
{
  vec3 V = normalize(P - CamLoc); 	
  vec3 L = normalize(LightPos - P);
  float
    cc = 0.2,
    cl = 0.1,
    cq = 0.3,    	
    d = length(LightPos - P),
    att = min(1.0, 1.0 / (cc + cl * d + cq * d * d));
  
  N = faceforward(N, V, N);                                              
   
  // Diffuse lighting
  vec3 color = min(vec3(0.1), MtlKa);
  //color = vec3(1.0);
  //color = vec3(1.0);
  color += MtlKd * max(0.0, dot(N, L));

  // Specular
  vec3 R = reflect(-V, N);
  //color += MtlKs * 0.0;
  vec3 AddC = MtlKs * min(max(0.0, pow(dot(R, -L), 47.0)), 1.0);

  color += AddC;
  //color = vec3(abs(max(0.0, pow(dot(R, -L), MtlPh))));
  // Distance depended lighting   
 

  color *= att;

  color *= LightCol;

  return color;
} /* End of 'Shade' function */



void main( void )
{
/*  vec3 L = normalize(vec3(0, 1, 3));
  vec3 N = normalize(faceforward(normalize(DrawNormal), -L, normalize(DrawNormal)));
  //int n = Julia(DrawPos.xy, vec2(0.35, 0.39) + vec2(sin(Time / 10.0 * 2.0) / 47.0, cos(Time / 10.0 * 2.0) * 0.47));

  vec3 P = vec3(sin(D2R(Time * 90.0)) * 4.0, 3.0, cos(D2R(Time * 90.0)) * 4.0);
  float d = length(P - DrawPos);
  vec3 R = normalize(P - DrawPos);
  float cc = 0.1, cl = 0.1, cq = 0.1;
  float k = min(1.0, 2.0 / (cc + cl * d + cq * d * d));
  vec3 LC = vec3(0.7, 0.6, 0.1);

  vec3 col = vec3(0.47, 0.30, 0.7) + LC * dot(N, R);
  */

  vec3 L = normalize(DrawPos - CamLoc);
  vec3 N = normalize(faceforward(normalize(DrawNormal), L, normalize(DrawNormal)));
  //int n = Julia(DrawPos.xy, vec2(0.35, 0.39) + vec2(sin(Time / 10.0 * 2.0) / 47.0, cos(Time / 10.0 * 2.0) * 0.47));

  vec3 P = vec3(sin(D2R(Time * 90.0)) * 4.0, 3.0, cos(D2R(Time * 90.0)) * 4.0);
  float d = length(P - DrawPos);
  vec3 R = normalize(P - DrawPos);
  float cc = 0.1, cl = 0.1, cq = 0.1;
  float k = min(1.0, 2.0 / (cc + cl * d + cq * d * d));
  vec3 LC = vec3(1.0);//vec3(0.7, 0.6, 0.1);

  vec3 col = Ka + Kd * dot(N, R);
  col *= LC;
  col *= k;

  //col = vec3(float(n) / 255.0, float(n) / 150.0, float(n) / 100.0) * dot(N, L); 
/*
  vec3 P = vec3(sin(D2R(Time * 90.0)) * 2.0, 3.0, cos(D2R(Time * 90.0)) * 2.0);
  vec3 LC = vec3(0.7, 0.6, 0.1);
  vec3 col = Shade(DrawPos, normalize(DrawNormal), Ka, Kd, Ks, Ph, P, LC);
  
  col = vec3(1.0, 1.0, 1.0);
*/
  OutColor = vec4(col, 1.0);
  //OutColor = vec4(N, 1);
}