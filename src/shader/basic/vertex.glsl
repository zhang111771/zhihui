
varying vec2 vUv;
varying float vElevation;
uniform float uTime;
void main(){
     vUv=uv;
  vec4 modelPosition=modelMatrix*vec4(position,1);
    modelPosition.z=sin(modelPosition.x*10.0+uTime*10.0)*0.05;
    modelPosition.z+=sin(modelPosition.y*10.0+uTime*10.0)*0.05;
    vElevation=modelPosition.z;
  gl_Position=projectionMatrix*viewMatrix*modelPosition;
}