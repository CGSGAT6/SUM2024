#version 300 es
precision highp float;

#define D2R(a) a * 3.1415 / 180.0

in vec3 DrawPos;
in vec2 DrawTexCoords;

uniform MaterialUBO
{
  vec4 KaTrans;
  vec4 Kd4;
  vec4 KsPh;
  vec4 Tex[2];
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

#define IsTexture0 Tex[0].x
#define IsTexture1 Tex[0].y
#define IsTexture2 Tex[0].z
#define IsTexture3 Tex[0].w
#define IsTexture4 Tex[1].x
#define IsTexture5 Tex[1].y
#define IsTexture6 Tex[1].z
#define IsTexture7 Tex[1].w

uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform sampler2D tex3;
uniform sampler2D tex4;
uniform sampler2D tex5;
uniform sampler2D tex6;
uniform sampler2D tex7;

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
  //OutColor = vec4(DrawTexCoords.xyx, 1.0);
  OutColor = vec4(DrawPos.yxx, 1.0);
  //OutColor = vec4(N, 1);
}