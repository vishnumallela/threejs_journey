import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const audioListener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const sound = new THREE.Audio(audioListener);
const textureLoader = new THREE.TextureLoader();

const backgroundTexture = textureLoader.load("./textures/background.png");
backgroundTexture.colorSpace = THREE.SRGBColorSpace;
backgroundTexture.minFilter = THREE.LinearFilter;
backgroundTexture.magFilter = THREE.LinearFilter;


const skyboxGeometry = new THREE.SphereGeometry(400, 64, 32);
const stlLoader = new STLLoader();
const gltfLoader = new GLTFLoader();
const scene = new THREE.Scene();

const skyboxMaterial = new THREE.MeshBasicMaterial({
  map: backgroundTexture,
  side: THREE.BackSide
});
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  800
);

scene.add(skybox);

const sunLight = new THREE.DirectionalLight(0xfff4e0, 2.5); 
sunLight.position.set(50, 50, 25); 
sunLight.castShadow = true;

sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
sunLight.shadow.camera.left = -100;
sunLight.shadow.camera.right = 100;
sunLight.shadow.camera.top = 100;
sunLight.shadow.camera.bottom = -100;
scene.add(sunLight);

const fillLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.8); 
scene.add(fillLight);
scene.add(camera);

camera.add(audioListener);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

audioLoader.load("./sounds/waves.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.2);
  sound.play();
});

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableRotate = true;
controls.enablePan = false;
controls.enableZoom = true;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 30;
controls.minPolarAngle = Math.PI / 3;
controls.maxPolarAngle = 2 * Math.PI / 3;

const waterTexture = textureLoader.load("./textures/water.png");
waterTexture.colorSpace = THREE.SRGBColorSpace;
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;

waterTexture.generateMipmaps = true;
waterTexture.minFilter = THREE.LinearMipmapLinearFilter;
waterTexture.magFilter = THREE.LinearFilter;
waterTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500, 64, 64),
  new THREE.MeshBasicMaterial({
    map: waterTexture,
    transparent: true,
    opacity: 1,
  })
);
plane.rotation.x = -Math.PI / 2;

plane.receiveShadow = true;

scene.add(plane);
const modelsGroup = new THREE.Group();
scene.add(modelsGroup);

stlLoader.load("./models/tiger.stl", function (geometry) {
  const tigerMaterial = new THREE.MeshNormalMaterial();
  const tiger = new THREE.Mesh(geometry, tigerMaterial);

  tiger.scale.set(0.18, 0.18, 0.18);
  tiger.position.set(0, 0, 0);
  tiger.rotation.x = -Math.PI / 2;
  tiger.rotation.z = Math.PI * 0.75;
  tiger.castShadow = true;
  tiger.receiveShadow = true;

  modelsGroup.add(tiger);
});

let mixer; 
gltfLoader.load("./models/model.glb", function (gltf) {
  const glbModel = gltf.scene;

  glbModel.scale.set(4, 4, 4);
  glbModel.position.set(0, 7.1, 0);
  glbModel.rotation.y = 0.5
  modelsGroup.add(glbModel);
  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(glbModel);

 
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });

    console.log(`Loaded ${gltf.animations.length} animations:`,
      gltf.animations.map(clip => clip.name));
  } else {
    console.log("No animations found in GLB file");
  }
});
modelsGroup.position.set(0, -2, -5);

camera.position.set(0, 2, 25);
const positions = plane.geometry.attributes.position.array;

const waves = (time) => {
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 1];
    positions[i + 2] = Math.sin(time + x * 0.05 + z * 0.05) * 0.5;
  }
  plane.geometry.attributes.position.needsUpdate = true;
};


window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const animate = () => {
  requestAnimationFrame(animate);
  const time = Date.now() * 0.001;
  const deltaTime = time - (animate.lastTime || time);
  animate.lastTime = time;

  waves(time);

  if (mixer) {
    mixer.update(deltaTime);
  }
  if (modelsGroup) {
    const floatOffset = Math.sin(time * 2) * Math.cos(time * 1.2) * 0.8;
    const bobOffset = Math.sin(time * 3) * 0.2;
    const baseY = -1;
    const driftX = Math.sin(time * 0.7) * 0.5;
    const driftZ = Math.cos(time * 0.9) * 0.4;
    modelsGroup.position.set(driftX, baseY + floatOffset + bobOffset, -5 + driftZ);
    modelsGroup.rotation.z = Math.sin(time * 1.5) * 0.12;
    modelsGroup.rotation.x = Math.sin(time * 1.1) * 0.08;
    modelsGroup.rotation.y = Math.sin(time * 0.6) * 0.1;
  }

  controls.update();

  camera.position.y = Math.max(camera.position.y, 1);

  skybox.position.copy(camera.position);

  renderer.render(scene, camera);
};
animate();
