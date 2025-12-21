import * as THREE from "three";
import {gsap} from "gsap";

//scene

const scene = new THREE.Scene();

//objects 
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color:"green"}))
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100)
camera.position.z = 5
scene.add(mesh)
//renderer
const renderer = new THREE.WebGLRenderer({canvas:document.querySelector("canvas.webgl")})
renderer.setSize(window.innerWidth,window.innerHeight)

gsap.to(mesh.position,{x:2,duration:1,ease:"power2.inOut"})
gsap.to(mesh.position,{x:-2,duration:1,ease:"power2.inOut",delay:1})

const renderLoop =()=>{
    renderer.render(scene,camera)
    requestAnimationFrame(renderLoop)
}
renderLoop()