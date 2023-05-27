<template>
  <div></div>
</template>

<script setup>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import deepVertexShader from './shader/deep/vertex.glsl'
import deepFragmentShader from './shader/deep/fragment.glsl'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {gsap} from 'gsap'

const scene = new THREE.Scene()
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(0,0,5)
scene.add(camera)

const helper=new THREE.AxesHelper()
scene.add(helper)


const rgbeLoader=new RGBELoader()
rgbeLoader.loadAsync('./model/light/Dosch-Surroundings_0028_4k.hdr').then((texture)=>{
  texture.mapping=THREE.EquirectangularReflectionMapping
  scene.background=texture
  scene.environment=texture
})

const shaderMaterial=new THREE.ShaderMaterial({
  fragmentShader:deepFragmentShader,
  vertexShader:deepVertexShader,
  side:THREE.DoubleSide
})




const gltfLoader=new GLTFLoader()

let lightBox=null
gltfLoader.load('./model/light/kongmindeng.glb',(gltf)=>{

  // scene.add(gltf.scene)
  lightBox=gltf.scene.children[0]
  lightBox.material=shaderMaterial
    console.log(gltf.scene.children)
  for(let i=0;i<150;i++){
    let flyLight=gltf.scene.clone(true)
    let x=Math.random()*300-150
    let z=Math.random()*300-150
    let y=Math.random()*60+25
    flyLight.position.set(x,y,z)
    gsap.to(flyLight.rotation,{y:2*Math.PI,duration:5+Math.random()*10,repeat:-1,yoyo:true})
    gsap.to(flyLight.position,{
      x:'+='+Math.random(),
      y:'+='+Math.random()*10,
      duration:5+Math.random()*10,
      repeat:-1,
      yoyo:true
    })
    scene.add(flyLight)

  }
  
})


const renderer=new THREE.WebGLRenderer({antialias: true})

renderer.outputEncoding=THREE.sRGBEncoding
renderer.toneMapping=THREE.ACESFilmicToneMapping
renderer.toneMappingExposure=0.2

renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls=new OrbitControls(camera,renderer.domElement)
controls.enableDamping=true
controls.autoRotate=true
controls.autoRotateSpeed=0.1
controls.maxPolarAngle=Math.PI*3/4
controls.minPolarAngle=Math.PI*3/4
const clock=new THREE.Clock()
function animate(){
  let time=clock.getElapsedTime()
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
