import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initCamera, addHouseAndTree, container, addAxesHelper } from '../utils';

class Controls {
    constructor(ambientLight) {
        this.intensity = ambientLight.intensity;
        this.ambientColor = ambientLight.color.getStyle();
        this.disableSpotlight = false;
    };
};

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

camera = initCamera();

renderer = initRenderer();

addAxesHelper(scene);

const ambientLight = new THREE.AmbientLight('#606008', 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
spotLight.shadow.mapSize.set(2048, 2048);
spotLight.position.set(-30, 40, -10);
spotLight.castShadow = true;
scene.add(spotLight);

addHouseAndTree(scene);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

// add gui
const gui = new GUI();
const controls = new Controls(ambientLight);
gui.add(controls, 'intensity', 0, 3, 0.1).onChange((e) => {
  ambientLight.color = new THREE.Color(controls.ambientColor);
  ambientLight.intensity = controls.intensity;
});
gui.addColor(controls, 'ambientColor').onChange((e) => {
  ambientLight.color = new THREE.Color(controls.ambientColor);
  ambientLight.intensity = controls.intensity;
});
gui.add(controls, 'disableSpotlight').onChange((e) => {
  spotLight.visible = !e;
});

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

