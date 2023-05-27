 
precision lowp float;
 varying vec2 vUv;
 varying float vElevation;
 uniform sampler2D uTexture;
 void main(){
    float height=vElevation+0.05*5.0;

    vec4 textureColor=texture2D(uTexture,vUv);
    // gl_FragColor=vec4(textureColor.x*height,textureColor.y*height,0.0,1.0);
    textureColor.rgb*=height;
    gl_FragColor=textureColor;

}