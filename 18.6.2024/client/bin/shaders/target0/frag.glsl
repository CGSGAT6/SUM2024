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
#define CamDir CamDirGlobalTime.rgb
#define CamRight CamRightGlobalDeltaTime.rgb
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
/*vec3 Shade( vec3 Pos, vec3 N, vec3 MtlKa, vec3 MtlKd, vec3 MtlKs, float MtlPh, vec3 LightPos, vec3 LightCol )
{
  vec3 L = normalize(Pos - CamLoc);
  vec3 Nn = normalize(faceforward(normalize(N), L, normalize(N)));
  //int n = Julia(DrawPos.xy, vec2(0.35, 0.39) + vec2(sin(Time / 10.0 * 2.0) / 47.0, cos(Time / 10.0 * 2.0) * 0.47));

  vec3 P = LightPos;//= vec3(sin(D2R(Time * 90.0)) * 4.0, 3.0, cos(D2R(Time * 90.0)) * 4.0);
  float d = length(P - Pos);
  vec3 R = normalize(P - Pos);
  float cc = 0.1, cl = 0.1, cq = 0.1;
  float k = min(1.0, 2.0 / (cc + cl * d + cq * d * d));

  vec3 col = min(vec3(0.1), MtlKa) + MtlKd * dot(Nn, R);
  col *= LightCol;
  col *= k;

  return col;
} *//* End of 'Shade' function */

/* Phong light model shading function.
 * ARGUMENTS:
 *   - position:
 *       vec3 P;
 *   - normal:
 *       vec3 N;
 *   - diffuse:
 *       vec3 Kd;
 *   - specular:
 *       vec3 Ks;
 *   - shinnes:
 *       float Ph;
 * RETURNS: lighted fragment.
 */
vec3 Shade( vec3 P, vec3 N, vec3 MtlKa, vec3 MtlKd, vec3 MtlKs, float MtlPh, vec3 LightDir, vec3 PosSubCamLoc )
{
  vec3 V = normalize(PosSubCamLoc); 	
  vec3 L = normalize(LightDir);
  
  N = faceforward(N, -L, N);
  
  // Diffuse lighting 
  vec3 color = min(vec3(0.1), MtlKa);
  
  color += MtlKd * max(0.0, dot(N, L));
  
  /*color = vec3(max(0.0, dot(normalize(vec3(1, 1, 0)), L)));
  return color;*/

   // Specular
  vec3 R = reflect(V, N);
  //color += MtlKs * max(0.0, pow(dot(R, L), Ph));

  return color;
} /* End of 'Shade' function */


void main( void )
{
  float k = 5.0;

  vec3 Color = texture(tex0, DrawTexCoords).rgb;
  vec3 Normal = texture(tex1, DrawTexCoords).rgb;
  vec3 Pos = texture(tex2, DrawTexCoords).rgb;
  vec3 MapKa = texture(tex3, DrawTexCoords).rgb;
  vec3 MapKd = texture(tex4, DrawTexCoords).rgb;
  vec3 PsC = texture(tex5, DrawTexCoords).rgb;

  vec3 LP = vec3(sin(D2R(Time * 90.0)) * 4.0, cos(D2R(Time * 90.0)) * 4.0, 3.0);
  //vec3 LP = CamAt + vec3(0, 0, 5);

  vec3 col = Shade(Pos, Normal, MapKa, MapKd, vec3(1, 0.47, 0.30), 47.0, vec3(1, 1, 1), -PsC);
  col += sin(Normal) * cos(Normal) / 8.0;

  OutColor = vec4(col, 1.0);
}