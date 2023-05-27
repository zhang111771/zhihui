precision lowp float; 
varying vec2 vUv;
varying vec4 vPosition;
varying vec4 gPosition;
void main(){
    vUv=uv;
    vec4 modelPosition=modelMatrix*vec4(position,1);
    gPosition=vec4(position,1);
    vPosition=modelPosition;
    gl_Position=projectionMatrix*viewMatrix*modelPosition;
}