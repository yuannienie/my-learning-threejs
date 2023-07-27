import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper } from "../../utils";

class Controls {
  constructor() {
    this.rotationSpeed = 0.012;
  }
}

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

camera = initPerspectiveCamera();

renderer = initRenderer();

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

const group = new THREE.Mesh();
const mats = [];
mats.push(new THREE.MeshBasicMaterial({
  color: 0x009e60
}));

mats.push(new THREE.MeshBasicMaterial({
  color: 0x0051ba
}));

mats.push(new THREE.MeshBasicMaterial({
  color: 0xffd500
}));

mats.push(new THREE.MeshBasicMaterial({
  color: 0xff5800
}));

mats.push(new THREE.MeshBasicMaterial({
  color: 0xC41E3A
}));

mats.push(new THREE.MeshBasicMaterial({
  color: 0xffffff
}));

addAxesHelper(scene, 20);

for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      let cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
      let cube = new THREE.Mesh(cubeGeom, mats);
      cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);

      group.add(cube);
    }
  }
}

group.scale.copy(new THREE.Vector3(2, 2, 2));
scene.add(group);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

// add gui
function addControls() {
  const gui = new GUI();
  const controls = new Controls();
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  return controls;
}

const controls = addControls();
const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

function animate() {
  stats.update();
  trackBallControls.update(clock.getDelta());

  group.rotation.x += controls.rotationSpeed;
  group.rotation.y += controls.rotationSpeed;
  group.rotation.z += controls.rotationSpeed;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

animate();
