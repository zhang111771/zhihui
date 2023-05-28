<template>
  <div></div>
</template>

<script setup>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {gsap} from 'gsap'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import FireWork from './utils/firework'
import {Water} from 'three/examples/jsm/objects/Water2'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import {CSS2DRenderer,CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'


const scene = new THREE.Scene()
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(0,10,15)
scene.add(camera)

const helper=new THREE.AxesHelper()
scene.add(helper)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/') // 设置public下的解码路径，注意最后面的/

const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
directionalLight.position.set(0,10,100)
directionalLight.castShadow=true
directionalLight.shadow.bias = -0.00005;


scene.add( directionalLight );
// const pointLight=new THREE.PointLight(0xffffff,10)
// pointLight.shadow.bias = -0.00005;

// pointLight.castShadow=true
// pointLight.position.set(0,100,100)
// scene.add(pointLight)
// directionalLight.target.set(0,0,0)
let rgbeLoader=new RGBELoader()
rgbeLoader.loadAsync('./model/enviroment/Alex_Hart-Snow_Pano_2k.hdr').then((texture)=>{
  scene.environment=texture
  scene.background=texture
  texture.mapping=THREE.EquirectangularReflectionMapping
})

let gltfloader=new GLTFLoader()
gltfloader.setDRACOLoader(dracoLoader)
gltfloader.load('./model/home/newyears_min.glb',(gltf)=>{
  scene.add(gltf.scene)
  gltf.scene.traverse((child)=>{
    if(child.isMesh){

      child.castShadow=true
      child.receiveShadow =true
    }
  })

})
let fireworks=[]
let createFireWork=()=>{
  let color=`hls(${Math.random()*360},100%,80%)`
  let position={
    x:(Math.random()-0.5)*40,
    z:(Math.random()-0.5)*40,
    y:7+Math.random()
  }

  const firework=new FireWork(color,position)
  fireworks.push(firework)
  firework.addScene(scene,camera)
}
window.addEventListener('click',createFireWork)

const waterPlane=new THREE.PlaneGeometry(100,100)
        let water=new Water(
            waterPlane,{
                textureHeight:1024,
                textureHeight:1024,
               
					
            }
        )
        water.rotation.x =-Math.PI/2
        water.position.set(0,0.1,0)
scene.add(water)
const textureLoader=new THREE.TextureLoader()

const moonTexture=textureLoader.load('./textures/moonTexture.jpg')
let moonMaterial=new THREE.MeshStandardMaterial({
  color:0xffffff,
  map:moonTexture
  
})


let moon=new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16),moonMaterial)
moon.position.set(5,15,0)
const pointLight=new THREE.PointLight(0xffffff,5,100)
moon.add(pointLight)
scene.add(moon)

//添加提示标签
const moonDiv=document.createElement('div')

moonDiv.className='label'
moonDiv.innerHTML='月球'
const moonLabel = new CSS2DObject(moonDiv);

moonLabel.position.set( 0 , 0.3, 0 );

moon.add( moonLabel );


const labelRenderer=new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(labelRenderer.domElement)
labelRenderer.domElement.style.position='fixed'
labelRenderer.domElement.style.top='0px'
labelRenderer.domElement.style.left='0px'
labelRenderer.domElement.style.zIndex='10'

//检测射线碰撞
const raycaster=new THREE.Raycaster()
const mouse=new THREE.Vector2()
window.addEventListener('click',(event)=>{
  mouse.x=(event.clientX/window.innerWidth)*2-1
  mouse.y=1-(event.clientY/window.innerHeight)*2
  raycaster.setFromCamera(mouse,camera)
  const interserctsObjects=raycaster.intersectObjects(scene.children)
  console.log(interserctsObjects)
})

//创建一个curve对象
const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -10, 10, 10 ),
	new THREE.Vector3( -5, 5, 5 ),
	new THREE.Vector3( 5, 10, 5 ),
	new THREE.Vector3( 10, 10, 10 )
],true );

const points=curve.getPoints(500)
const geometry=new THREE.BufferGeometry().setFromPoints(points)
const material=new THREE.LineBasicMaterial({color:0xff0000})
const curveObject=new THREE.Line(geometry,material)

scene.add(curveObject)

const renderer=new THREE.WebGLRenderer({antialias: true})
renderer.outputEncoding=THREE.sRGBEncoding
renderer.toneMapping=THREE.ACESFilmicToneMapping
renderer.toneMappingExposure=0.1

renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true;
//合成效果
// const effectComposer=new EffectComposer(renderer)
// effectComposer.setSize(window.innerWidth,window.innerHeight)
// //添加渲染通道
// const renderPass=new RenderPass(scene,camera)

// effectComposer.addPass(renderPass)
// const dotScreenPass=new DotScreenPass()
// effectComposer.addPass(dotScreenPass)



renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls=new OrbitControls(camera,labelRenderer.domElement)
controls.enableDamping=true

const clock=new THREE.Clock()
function animate(){
  let time=clock.getElapsedTime()
  // moon.position.set(Math.sin(time)*10,15,Math.cos(time)*10)
  moon.rotation.y=time*3
  const pointTime=time/10%1

  const point=curve.getPoint(pointTime)
  moon.position.copy(point)
  // camera.position.copy(point)
  // camera.lookAt(new THREE.Vector3(0,0,0))
  // fireworks.forEach((item)=>{
  //   item.update()
  // })
  controls.update()
  renderer.render(scene,camera)
  //标签渲染器
  labelRenderer.render(scene,camera)

  // effectComposer.render()
  requestAnimationFrame(animate)
}
animate()
</script>

<style>
*{
  margin:0;
  padding:0;
}
.label{
  color:#fff;
  display: block;
}
</style>
