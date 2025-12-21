import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100)
const renderer = new THREE.WebGLRenderer({canvas:document.querySelector("canvas.webgl")})
renderer.setSize(window.innerWidth,window.innerHeight)
camera.position.z =20
const model_loader = new OBJLoader()
model_loader.load("statue.obj",(obj)=>{
    scene.add(obj)
    obj.traverse((child)=>{
        if(child instanceof THREE.Mesh){
            child.material = new THREE.MeshNormalMaterial()
        }
    })
    obj.position.set(0,-5,0)
    obj.scale.set(0.1,0.1,0.1)
    renderer.render(scene,camera)
    camera.lookAt(obj.position)
})

const controls = new OrbitControls(camera,renderer.domElement)

const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene,camera)
}
animate()