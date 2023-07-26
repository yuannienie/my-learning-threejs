import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initCamera, container, addAxesHelper } from "../utils";
import grassLightBig from "../../../assets/textures/ground/grasslight-big.jpg";
import lensflare0 from "../../../assets/textures/flares/lensflare0.png";
import lensflare3 from "../../../assets/textures/flares/lensflare3.png";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

class Controls {
  constructor() {
    this.rotationSpeed = 0.03;
    this.bouncingSpeed = 0.03;
    this.ambientColor = ambientColor;
    this.pointColor = pointColor;
    this.intensity = 0.1;
    this.distance = 0;
    this.exponent = 30;
    this.angle = 0.1;
    this.debug = false;
    this.castShadow = true;
    this.onlyShadow = false;
    this.target = "Plane";
  }
}

let trackBallControls, camera, renderer, plane, sphere, cube;

const scene = new THREE.Scene();

const cameraPosition = new THREE.Vector3(-20, 10, 45);
const cameraLookAt = new THREE.Vector3(10, 0, 0);
camera = initCamera(cameraPosition, cameraLookAt);

renderer = initRenderer({ alpha: true });

addAxesHelper(scene);

// create texture
const textureGrass = new THREE.TextureLoader().load(grassLightBig);
textureGrass.wrapS = THREE.RepeatWrapping;
textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.repeat.set(10, 10);

// create ground plane
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({
  map: textureGrass,
});
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, 0, 0);
// add the plane to the scene
scene.add(plane);

// create cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xff3333,
});
cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
// position the cube
cube.position.set(-4, 3, 0);
// add the cube to the scene
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
const sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x7777ff,
});
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// position the sphere
sphere.position.set(10, 5, 10);
sphere.castShadow = true;
// add the sphere to the scene
scene.add(sphere);

let ambientColor = "#1c1c1c";
const ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

// add spotlight for a bit of light
const spotLight0 = new THREE.SpotLight(0xcccccc);
spotLight0.position.set(-40, 60, -10);
spotLight0.lookAt(plane);
scene.add(spotLight0);

const target = new THREE.Object3D();
target.position.copy(new THREE.Vector3(5, 0, 0));

let pointColor = "#ffffff";
let spotLight = new THREE.DirectionalLight(pointColor);
spotLight.position.set(30, 10, -50);
spotLight.castShadow = true;
spotLight.shadowCameraNear = 0.1;
spotLight.shadowCameraFar = 100;
spotLight.shadowCameraFov = 50;
spotLight.target = plane;
spotLight.distance = 0;
spotLight.shadowCameraNear = 2;
spotLight.shadowCameraFar = 200;
spotLight.shadowCameraLeft = -100;
spotLight.shadowCameraRight = 100;
spotLight.shadowCameraTop = 100;
spotLight.shadowCameraBottom = -100;
spotLight.shadowMapWidth = 2048;
spotLight.shadowMapHeight = 2048;

scene.add(spotLight);

// add lens-flare
let textureFlare0 = new THREE.TextureLoader().load(lensflare0);
let textureFlare3 = new THREE.TextureLoader().load(lensflare3);
const flareColor = new THREE.Color(0xffaacc);
const lensFlare = new Lensflare();

lensFlare.addElement(new LensflareElement(textureFlare0, 350, 0.0, flareColor));
lensFlare.addElement(new LensflareElement(textureFlare3, 60, 0.6, flareColor));
lensFlare.addElement(new LensflareElement(textureFlare3, 70, 0.7, flareColor));
lensFlare.addElement(new LensflareElement(textureFlare3, 120, 0.9, flareColor));
lensFlare.addElement(new LensflareElement(textureFlare3, 70, 1.0, flareColor));
spotLight.add(lensFlare);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

function addControls() {
  // add gui
  const gui = new GUI();
  const controls = new Controls();
  gui.addColor(controls, "ambientColor").onChange(function (e) {
    ambientLight.color = new THREE.Color(e);
  });

  gui.addColor(controls, "pointColor").onChange(function (e) {
    spotLight.color = new THREE.Color(e);
  });

  gui.add(controls, "intensity", 0, 5).onChange(function (e) {
    spotLight.intensity = e;
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
  // rotate the cube around its axes
  cube.rotation.x += controls.rotationSpeed;
  cube.rotation.y += controls.rotationSpeed;
  cube.rotation.z += controls.rotationSpeed;

  // bounce the sphere up and down
  step += controls.bouncingSpeed;
  sphere.position.x = 20 + 10 * Math.cos(step);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

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
