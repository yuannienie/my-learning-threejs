import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper } from '../utils';

class Controls {
  constructor() {
    this.rotationSpeed = 0.03;
    this.bouncingSpeed = 0.03;
    this.ambientColor = ambientColor;
    this.pointColor = pointColor;
    this.intensity = 0.5;
    this.debug = false;
    this.castShadow = true;
    this.onlyShadow = false;
    this.target = "Plane";
  };
};

let trackBallControls, camera, renderer, plane, cube, sphere, sphereLightMesh;

const scene = new THREE.Scene();

camera = initPerspectiveCamera(new THREE.Vector3(-80, 80, 80));

renderer = initRenderer();

addAxesHelper(scene);

// create ground plane
const planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, -5, 0);
// add the plane to the scene
scene.add(plane);

const ambientColor = '#1c1c1c';
const ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

const pointColor = "#ff5808";
const directionalLight = new THREE.DirectionalLight(pointColor);
directionalLight.position.set(-40, 60, -10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 80;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;

directionalLight.intensity = 0.5;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

const shadowCamera = new THREE.CameraHelper(directionalLight.shadow.camera)

// create a cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.position.set(-4, 3, 0);
scene.add(cube);

// create sphere
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
// position the sphere
sphere.position.set(20, 0, 2);
scene.add(sphere);

// add a small sphere simulating the pointlight
const sphereLight = new THREE.SphereGeometry(0.2);
const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
sphereLightMesh.castShadow = true;
sphereLightMesh.position.copy(new THREE.Vector3(3, 20, 3));
scene.add(sphereLightMesh);

// add directional light target
const target = new THREE.Object3D();
target.position.copy(new THREE.Vector3(5, 0, 0));

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

// add gui
const gui = new GUI();
const controls = new Controls(ambientLight);
gui.addColor(controls, 'ambientColor').onChange(function (e) {
  ambientLight.color = new THREE.Color(e);
});

gui.addColor(controls, 'pointColor').onChange(function (e) {
  directionalLight.color = new THREE.Color(e);
});

gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
  directionalLight.intensity = e;
});

gui.add(controls, 'debug').onChange(function (e) {
  e ? scene.add(shadowCamera) : scene.remove(shadowCamera);
});

gui.add(controls, 'castShadow').onChange(function (e) {
  directionalLight.castShadow = e;
});

gui.add(controls, 'onlyShadow').onChange(function (e) {
  directionalLight.onlyShadow = e;
});

gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
  console.log(e);
  switch (e) {
    case "Plane":
      directionalLight.target = plane;
      break;
    case "Sphere":
      directionalLight.target = sphere;
      break;
    case "Cube":
      directionalLight.target = cube;
      break;
  }

});

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

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
  sphere.position.x = 20 + (10 * (Math.cos(step)));
  sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

  sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));
  sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
  sphereLightMesh.position.z = -8;

  directionalLight.position.copy(sphereLightMesh.position);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

