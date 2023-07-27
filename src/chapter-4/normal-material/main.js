import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addBasicMaterialSettings, addAxesHelper, addArrowHelper } from "../../utils";
// import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

class Controls {
  constructor() {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
    this.selectedMesh = "cube";
  }
}

let trackBallControls, camera, renderer, selectedMesh;

const scene = new THREE.Scene();

const cameraPosition = new THREE.Vector3(-20, 30, 40);
const lookAt = new THREE.Vector3(10, 0, 0);
camera = initPerspectiveCamera(cameraPosition, lookAt);

renderer = initRenderer();

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

const groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
const groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({ color: 0x777777 }));
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = -20;
scene.add(groundMesh);

const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

// add normal material: A material that maps the normal vectors to RGB colors.
const meshMaterial = new THREE.MeshNormalMaterial();
const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
const plane = new THREE.Mesh(planeGeometry, meshMaterial);

selectedMesh = cube;
cube.position.set(0, 3, 2);
sphere.position.copy(cube.position);
plane.position.copy(cube.position);

scene.add(cube);

addAxesHelper(scene);
addArrowHelper(cube);
addArrowHelper(sphere);
addArrowHelper(plane);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

// add gui
function addControls() {
  const gui = new GUI();
  const controls = new Controls();
  addBasicMaterialSettings(gui, controls, meshMaterial);
  gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange(function (e) {
    scene.remove(plane);
    scene.remove(cube);
    scene.remove(sphere);
    switch (e) {
      case "cube":
        scene.add(cube);
        selectedMesh = cube;
        break;
      case "sphere":
        scene.add(sphere);
        selectedMesh = sphere;
        break;
      case "plane":
        scene.add(plane);
        selectedMesh = plane;
        break;
    }
  });

  return controls;
}


const controls = addControls();
const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

function animate() {
  stats.update();
  trackBallControls.update(clock.getDelta());

  selectedMesh.rotation.y += controls.rotationSpeed;

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
