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
    this.cameraNear = camera.near;
    this.cameraFar = camera.far;
    this.rotationSpeed = 0.02;
    this.numberOfObjects = scene.children.length;
  }

  addCube() {
    const cubeSize = Math.ceil(3 + (Math.random() * 3));
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube randomly in the scene
    cube.position.x = -60 + Math.round((Math.random() * 100));
    cube.position.y = Math.round((Math.random() * 10));
    cube.position.z = -100 + Math.round((Math.random() * 150));

    // add the cube to the scene
    scene.add(cube);
    this.numberOfObjects = scene.children.length;
  }

  removeCube() {
    const allChildren = scene.children;
    const lastObj = allChildren.at(-1);
    if (lastObj instanceof THREE.Mesh) {
      scene.remove(lastObj);
      this.numberOfObjects = scene.children.length;
    }
  }
}

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

// A material for drawing geometry by depth. Depth is based off of the camera near and far plane. White is nearest, black is farthest.
const depthMaterial = new THREE.MeshDepthMaterial();
scene.overrideMaterial = depthMaterial;

const cameraPosition = new THREE.Vector3(-50, 40, 50);
camera = initPerspectiveCamera(cameraPosition, scene.position, { near: 50, far: 110 });

renderer = initRenderer();

addAxesHelper(scene);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

// add gui
function addControls() {
  const gui = new GUI();
  const controls = new Controls();
  addBasicMaterialSettings(gui, controls, depthMaterial);
  const spGui = gui.addFolder("THREE.MeshDepthMaterial");
  spGui.add(depthMaterial, 'wireframe');
  // Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms linewidth will always be 1 regardless of the set value.
  spGui.add(depthMaterial, 'wireframeLinewidth', 0, 20);

  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'addCube');
  gui.add(controls, 'removeCube');
  gui.add(controls, 'cameraNear', 0, 100).onChange(function (e) {
    camera.near = e;
    camera.updateProjectionMatrix();
  });
  gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
    camera.far = e;
    camera.updateProjectionMatrix();
  });

  return controls;
}

const controls = addControls();
let i = 0;
while (i++ < 10) {
  controls.addCube();
}

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

function animate() {
  stats.update();
  trackBallControls.update(clock.getDelta());

  scene.traverse(e => {
    if (e instanceof THREE.Mesh) {
      e.rotation.x += controls.rotationSpeed;
      e.rotation.y += controls.rotationSpeed;
      e.rotation.z += controls.rotationSpeed;
    }
  })

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
