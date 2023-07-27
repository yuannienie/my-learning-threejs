import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {
  initRenderer,
  initPerspectiveCamera,
  container,
  addAxesHelper,
  addBasicMaterialSettings,
} from "../../utils";

class Controls {
  constructor() {
    this.rotationSpeed = 0.02;
    this.color = meshMaterial.color.getStyle();
    this.selectedMesh = "cube";
  }
}

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

const cameraPosition = new THREE.Vector3(-20, 50, 40);
const lookAtPosition = new THREE.Vector3(10, 0, 0);
camera = initPerspectiveCamera(cameraPosition, lookAtPosition);

renderer = initRenderer();

addAxesHelper(scene);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 4, 4),
  new THREE.MeshBasicMaterial({ color: 0x777777 })
);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = -20;
scene.add(groundMesh);

const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

// Basic Material
const meshMaterial = new THREE.MeshBasicMaterial({
  color: 0x7777ff,
  name: "Basic Material",
});

const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
const plane = new THREE.Mesh(planeGeometry, meshMaterial);

const objPosition = new THREE.Vector3(0, 3, 2);
sphere.position.copy(objPosition);
cube.position.copy(objPosition);
plane.position.copy(objPosition);

scene.add(cube);

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

// add gui
const gui = new GUI();
const controls = new Controls();

addBasicMaterialSettings(gui, controls, meshMaterial);

const spGui = gui.addFolder("THREE.MeshBasicMaterial");
spGui.addColor(controls, "color").onChange(function (e) {
  meshMaterial.color.setStyle(e);
});
spGui.add(meshMaterial, "wireframe");
// Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms linewidth will always be 1 regardless of the set value.
spGui.add(meshMaterial, "wireframeLinewidth", 0, 20);
gui
  .add(controls, "selectedMesh", ["cube", "sphere", "plane"])
  .onChange(function (e) {
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

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

let selectedMesh = cube;

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
