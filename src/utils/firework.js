import * as THREE from 'three'
import vertex from '../shader/firework/vertex.glsl'
import fragment from '../shader/firework/fragment.glsl'
import fkFragment from '../shader/firework/fkFragment.glsl'
import fkVertex from '../shader/firework/fkVertex.glsl'

export default class FireWork{
    constructor(color,to,from={x:0.0,y:0,z:0}){
        let position=new Float32Array(3)
        position[0]=from.x
        position[1]=from.y
        position[2]=from.z

        this.startPointGeometry=new THREE.BufferGeometry()
        this.startPointGeometry.setAttribute('position',new THREE.BufferAttribute(position,3))

        const astepArray=new Float32Array(3)
        astepArray[0]=to.x-from.x
        astepArray[1]=to.y-from.y
        astepArray[2]=to.z-from.z
        this.startPointGeometry.setAttribute('aStep',new THREE.BufferAttribute(astepArray,3))


        this.startPointMaterial=new THREE.ShaderMaterial({
            vertexShader:vertex,
            fragmentShader:fragment,
            transparent:true,
            blending:THREE.AdditiveBlending,
            depthWrite:false,
            uniforms:{
                uTime:{
                    value:0
                },
                uSize:{
                    value:0
                }
            }
        })
   

        //创建爱你烟花点
        this.startPoint=new THREE.Points(this.startPointGeometry,this.startPointMaterial)
        this.clock=new THREE.Clock()
        this.fireworkGeometry=new THREE.BufferGeometry()
        this.fireworksCount=180+Math.floor(Math.random()*180)
        const positionFireworksArray=new Float32Array(this.fireworksCount*3)
        const scaleFireArray=new Float32Array(this.fireworksCount)
        const directionArray=new Float32Array(this.fireworksCount*3)
        for(let i=0;i<this.fireworksCount;i++){
            positionFireworksArray[i*3+0]=to.x
            positionFireworksArray[i*3+1]=to.y
            positionFireworksArray[i*3+2]=to.z
            //设置烟花所有粒子初始化大小
            scaleFireArray[i]=Math.random()
            //设置四周发射的角度
            let theta=Math.random()*2*Math.PI
            let beta=Math.random()*2*Math.PI
            let r=Math.random()
            directionArray[i*3+0]=r*Math.sin(theta)+r*Math.sin(beta)
            directionArray[i*3+1]=r*Math.cos(theta)+r*Math.cos(beta)
            directionArray[i*3+2]=r*Math.sin(theta)+r*Math.cos(beta)


        }
        this.fireworkGeometry.setAttribute('position',new THREE.BufferAttribute(positionFireworksArray,3))
        this.fireworkGeometry.setAttribute('aScale',new THREE.BufferAttribute(scaleFireArray,1))
        this.fireworkGeometry.setAttribute('aRandom',new THREE.BufferAttribute(directionArray,3))
        

        this.fireworksMaterial=new THREE.ShaderMaterial({
            uniforms:{
                uTime:{
                    value:0
                },
                uSize:{
                    value:0
                }
            },
            transparent:true,
            blending:THREE.AdditiveBlending,
            depthWrite:false,
            vertexShader:fkVertex,
            fragmentShader:fkFragment
        })
        this.fireworks=new THREE.Points(this.fireworkGeometry,this.fireworksMaterial)

    }
    addScene(scene,camera){
        console.log(this.startPoint)
        scene.add(this.startPoint)
        scene.add(this.fireworks)
        this.scene=scene
    }
    //update变量
    update(){
        const elapsedTime=this.clock.getElapsedTime()
        if(elapsedTime<1){
            this.startPointMaterial.uniforms.uTime.value=elapsedTime
            this.startPointMaterial.uniforms.uSize.value=20
        }else{
            const time=elapsedTime-1
            this.startPointMaterial.uniforms.uSize.value=0
            this.startPoint.clear()
            this.startPointGeometry.dispose()
            this.startPointMaterial.dispose()

            this.fireworksMaterial.uniforms.uSize.value=20
            this.fireworksMaterial.uniforms.uTime.value=time

        }
        
    }
}