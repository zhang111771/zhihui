
 uniform sampler2D uTexture;
 uniform sampler2D uTexture1;
 uniform sampler2D uTexture2;
varying vec3 vColor;
 varying float vImgIndex;
 vec2 rotate(vec2 uv,float rotation,vec2 mid){
    return vec2(cos(rotation)*(uv.x-mid.x)+sin(rotation)*(uv.y-mid.y)+mid.x, cos(rotation)*(uv.y-mid.y)-sin(rotation)*(uv.x-mid.x)+mid.y);
}
 void main(){

    // gl_FragColor=vec4(gl_PointCoord,0,1);
    // float strength=distance(gl_PointCoord,vec2(0.5));
    // strength*=2.0;
    // strength=1.0-strength;
    vec2 rotateUv=rotate(gl_PointCoord,3.14,vec2(0.5));
     vec4 textureColor;
    if(vImgIndex==0.0){
         textureColor=texture2D(uTexture,rotateUv);
    }else {
         textureColor=texture2D(uTexture2,rotateUv);
    }
    gl_FragColor=vec4(vColor,textureColor.r);

}