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
const scene = new THREE.Scene()
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(0,0,5)
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




const renderer=new THREE.WebGLRenderer({antialias: true})
renderer.outputEncoding=THREE.sRGBEncoding
renderer.toneMapping=THREE.ACESFilmicToneMapping
renderer.toneMappingExposure=0.1

renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true;



renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls=new OrbitControls(camera,renderer.domElement)
controls.enableDamping=true

const clock=new THREE.Clock()
function animate(){
  let time=clock.getElapsedTime()
  fireworks.forEach((item)=>{
    item.update()
  })
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
