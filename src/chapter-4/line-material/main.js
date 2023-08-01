import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {
  initRenderer,
  initPerspectiveCamera,
  container,
  addAxesHelper,
} from "../../utils";
import { gosper } from './util'; 

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

camera = initPerspectiveCamera();

renderer = initRenderer();

addAxesHelper(scene);

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

const points = gosper(4, 60);
const lines = new THREE.BufferGeometry();
const colors = [];
const vertices = [];
points.forEach((e) => {
  vertices.push(e.x, e.z, e.y);
  colors.push(e.x / 100 + 0.5, (e.y * 20) / 300, 0.8); 
});
lines.setAttribute('positions', new THREE.Float32BufferAttribute(vertices, 3));
lines.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const material = new THREE.LineBasicMaterial({
  opacity: 1.0,
  linewidth: 1,
});

const line = new THREE.Line(lines, material);
line.position.set(25, -30, -60);
scene.add(line);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

function animate() {
  stats.update();
  trackBallControls.update(clock.getDelta());
  line.rotation.z += 0.01;
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
