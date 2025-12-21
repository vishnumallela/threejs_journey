import * as THREE from "three";

//scene
const scene = new THREE.Scene();

//object
const cube = new THREE.BoxGeometry(1, 1, 1); //width, height, depth
const material = new THREE.MeshBasicMaterial({ color: "red", wireframe:true});
const mesh = new THREE.Mesh(cube, material);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
});

//camera    
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
); //fov, aspect ratio, near, far
camera.position.z = 5;
camera.position.x = 4;
camera.position.y = 2;

// Set renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

//composition
scene.add(mesh);
renderer.render(scene, camera);
