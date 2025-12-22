import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"


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

const plane_mesh = new THREE.Mesh(new THREE.PlaneGeometry(window.innerWidth/2,window.innerHeight/2),new THREE.MeshPhysicalMaterial({color:"white",roughness:0.2,metalness:0.5,reflectivity:0.5,transparent:true,opacity:0.1}))
plane_mesh.position.set(0,-5,0)
plane_mesh.rotation.x = -Math.PI/2
scene.add(plane_mesh)

const rgbeLoader = new RGBELoader()
rgbeLoader.load("sky.hdr",(environmentMap)=>{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap
})

const controls = new OrbitControls(camera,renderer.domElement)
controls.enableDamping = true

const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene,camera)
}
animate()