<template>
  <div></div>
</template>

<script setup>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import deepVertexShader from './shader/points/vertex.glsl'
import deepFragmentShader from './shader/points/fragment.glsl'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {gsap} from 'gsap'

const scene = new THREE.Scene()
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(0,0,5)
scene.add(camera)

const helper=new THREE.AxesHelper()
scene.add(helper)

// const geometry=new THREE.BufferGeometry()
// const positions=new Float32Array([0,0,0])
// geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))

//点材质
// const material=new THREE.PointsMaterial({
//   color:0xff0000,
//   size:10,
//   //近大远小
//   sizeAttenuation:true
// })

let textureLoader=new THREE.TextureLoader()
let texture=textureLoader.load('./particles/diamond.png')
let texture1=textureLoader.load('./particles/star3.png')
let texture2=textureLoader.load('./particles/star4.png')

// const material=new THREE.ShaderMaterial({
//   vertexShader:deepVertexShader,
//   fragmentShader:deepFragmentShader,
//   transparent:true,
//   uniforms:{
//     uTexture:{
//       value:texture
//     }
//   }
// })

// const points=new THREE.Points(geometry,material)
// console.log(points)
// scene.add(points)
// 设置星系的参数
const params = {
  count: 1000,
  size: 0.1,
  radius: 5,
  branches: 4,
  spin: 0.5,
  color: "#ff6030",
  outColor: "#1b3984",
};
let galaxyColor = new THREE.Color(params.color);
let outGalaxyColor = new THREE.Color(params.outColor);
let geometry=null
let points=null
let material=null
const generateGalaxy = () => {
  // 如果已经存在这些顶点，那么先释放内存，在删除顶点数据
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  // 生成顶点几何
  geometry = new THREE.BufferGeometry();
  //   随机生成位置
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);

  const scales = new Float32Array(params.count);

  //图案属性
  const imgIndex = new Float32Array(params.count)

  //   循环生成点
  for (let i = 0; i < params.count; i++) {
    const current = i * 3;

    // 计算分支的角度 = (计算当前的点在第几个分支)*(2*Math.PI/多少个分支)
    const branchAngel =
      (i % params.branches) * ((2 * Math.PI) / params.branches);

    const radius = Math.random() * params.radius;
    // 距离圆心越远，旋转的度数就越大
    // const spinAngle = radius * params.spin;

    // 随机设置x/y/z偏移值
    const randomX =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;
    const randomY =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;
    const randomZ =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;

    // 设置当前点x值坐标
    positions[current] = Math.cos(branchAngel) * radius + randomX;
    // 设置当前点y值坐标
    positions[current + 1] = randomY;
    // 设置当前点z值坐标
    positions[current + 2] = Math.sin(branchAngel) * radius + randomZ;

    const mixColor = galaxyColor.clone();
    mixColor.lerp(outGalaxyColor, radius / params.radius);

    //   设置颜色
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;



    // 顶点的大小
    scales[current] = Math.random();

    // 根据索引值设置不同的图案；
    imgIndex[current] = i%3 ;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("imgIndex", new THREE.BufferAttribute(imgIndex, 1));

  //   设置点材质
  //   material = new THREE.PointsMaterial({
  //     color: new THREE.Color(0xffffff),
  //     size: params.size,
  //     sizeAttenuation: true,
  //     depthWrite: false,
  //     blending: THREE.AdditiveBlending,
  //     map: particlesTexture,
  //     alphaMap: particlesTexture,
  //     transparent: true,
  //     vertexColors: true,
  //   });

  //   设置点的着色器材质
  material = new THREE.ShaderMaterial({
    vertexShader: deepVertexShader,
    fragmentShader: deepFragmentShader,
    
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: {
        value: 0,
      },
      uTexture:{
        value:texture
      },
      uTexture1:{
        value:texture1
      },
      uTexture2:{
        value:texture2
      },
      uTime:{
        value:0
      },
      uColor:{
        value:galaxyColor
      }

    },
  });

  //   生成点
  points = new THREE.Points(geometry, material);
  scene.add(points);
  console.log(points);
  //   console.log(123);
};
generateGalaxy()
const renderer=new THREE.WebGLRenderer({antialias: true})

renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls=new OrbitControls(camera,renderer.domElement)
controls.enableDamping=true

const clock=new THREE.Clock()
function animate(){
  let time=clock.getElapsedTime()
  material.uniforms.uTime.value=time
  controls.update()
  renderer.render(scene,camera)
  requestAnimationFrame(animate)
}
animate()
</script>

<style>
*{
  margin:0;
  padding:0;
}
</style>
