import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { initRenderer, initCamera, container, addAxesHelper } from "../utils";

class Controls {
  constructor() {
    this.rotationSpeed = 0.02;
    this.color1 = 0xff0000;
    this.intensity1 = 500;
    this.color2 = 0x00ff00;
    this.intensity2 = 500;
    this.color3 = 0x0000ff;
    this.intensity3 = 500;
  }
}

let trackBallControls, camera, renderer, plane;

const scene = new THREE.Scene();

camera = initCamera(new THREE.Vector3(-50, 30, 50));

renderer = initRenderer({ antialias: true });

addAxesHelper(scene);

// create ground plane
const planeGeometry = new THREE.PlaneGeometry(70, 70, 1, 1);
const planeMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.044676705160855, // calculated from shininess = 1000
  metalness: 0.0,
});
plane = new THREE.Mesh(planeGeometry, planeMaterial);
// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);
// add the plane to the scene
scene.add(plane);

const spotLight0 = new THREE.SpotLight(0xcccccc);
spotLight0.position.set(-40, 60, -10);
spotLight0.intensity = 0.1;
spotLight0.lookAt(plane);
scene.add(spotLight0);

// add area light
const areaLight1 = new THREE.RectAreaLight(0xff0000, 500, 4, 10);
areaLight1.position.set(-10, 10, -35);
areaLight1.lookAt(plane.position);
scene.add(areaLight1);

// simulate the rectangle to create area light
const planeGeometry1 = new THREE.BoxGeometry(4, 10, 0);
let planeMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.position.copy(areaLight1.position);
scene.add(plane1);

// add area light
const areaLight2 = new THREE.RectAreaLight(0x00ff00, 500, 4, 10);
areaLight2.position.set(0, 10, -35);
areaLight2.lookAt(plane.position);
scene.add(areaLight2);

// simulate the rectangle to create area light
const planeGeometry2 = new THREE.BoxGeometry(4, 10, 0);
let planeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
plane2.position.copy(areaLight2.position);
scene.add(plane2);

// add area light
const areaLight3 = new THREE.RectAreaLight(0x0000ff, 500, 4, 10);
areaLight3.position.set(10, 10, -35);
areaLight3.lookAt(plane.position);
scene.add(areaLight3);

// simulate the rectangle to create area light
const planeGeometry3 = new THREE.BoxGeometry(4, 10, 0);
const planeMaterial3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
let plane3 = new THREE.Mesh(planeGeometry3, planeMaterial3);
plane3.position.copy(areaLight3.position);
scene.add(plane3);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

function addControls() {
  // add gui
  const gui = new GUI();
  const controls = new Controls();
  gui.addColor(controls, "color1").onChange(function (e) {
    areaLight1.color = new THREE.Color(e);
    planeMaterial.color = new THREE.Color(e);
    scene.remove(plane1);
    plane1 = new THREE.Mesh(planeGeometry1, planeMaterial);
    plane1.position.copy(areaLight1.position);
    scene.add(plane1);
  });
  gui.add(controls, "intensity1", 0, 1000).onChange(function (e) {
    areaLight1.intensity = e;
  });
  gui.addColor(controls, "color2").onChange(function (e) {
    areaLight2.color = new THREE.Color(e);
    planeMaterial2.color = new THREE.Color(e);
    scene.remove(plane2);
    plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
    plane2.position.copy(areaLight2.position);
    scene.add(plane2);
  });
  gui.add(controls, "intensity2", 0, 1000).onChange(function (e) {
    areaLight2.intensity = e;
  });
  gui.addColor(controls, "color3").onChange(function (e) {
    areaLight3.color = new THREE.Color(e);
    planeMaterial3.color = new THREE.Color(e);
    scene.remove(plane3);
    plane3 = new THREE.Mesh(planeGeometry1, planeMaterial3);
    plane3.position.copy(areaLight3.position);
    scene.add(plane3);
  });
  gui.add(controls, "intensity3", 0, 1000).onChange(function (e) {
    areaLight3.intensity = e;
  });
  return controls;
}

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);
const controls = addControls();
let step = 0;
function animate() {
  stats.update();
  trackBallControls.update(clock.getDelta());

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
