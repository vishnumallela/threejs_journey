import * as THREE from "three";

//scene
const scene = new THREE.Scene();

//objects
const material = new THREE.MeshBasicMaterial({color:"yellow"});
const sphere = new THREE.SphereGeometry(1, 32, 32);
const mesh = new THREE.Mesh(sphere, material);
const axesHelper = new THREE.AxesHelper(5)
sphere.scale(2,2,2)
sphere.rotateY(Math.PI/4)
mesh.position.set(2,2,2)
scene.add(mesh);
scene.add(axesHelper)
//camera

const camera = new THREE.PerspectiveCamera(
  75,
  1
);

camera.position.set(-2, 2, 10);
camera.lookAt(mesh.position)



//  renderer

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  
});
renderer.setSize(500, 500);
renderer.render(scene, camera);
