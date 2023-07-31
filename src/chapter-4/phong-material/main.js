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
    addLargeGroundPlane,
    addMeshSelection
} from "../../utils";

class Controls {
    constructor() {
        this.color = material.color.getStyle();
        this.emissive = material.emissive.getStyle();
        this.specular = material.specular.getStyle();
    }
}

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

camera = initPerspectiveCamera();

renderer = initRenderer();

// addAxesHelper(scene);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 30, 60);
spotLight.castShadow = true;
spotLight.intensity = 0.6;
scene.add(spotLight);

const material = new THREE.MeshPhongMaterial({
    color: 0x7777ff,
});

addLargeGroundPlane(scene);

// add gui
const gui = new GUI();
const controls = new Controls();

addBasicMaterialSettings(gui, controls, material);
addMeshSelection(gui, controls, material, scene);
const spGui = gui.addFolder("THREE.MeshPhongMaterial");
spGui.addColor(controls, 'color').onChange(function (e) {
    material.color.setStyle(e)
});
spGui.addColor(controls, 'emissive').onChange(function (e) {
    material.emissive = new THREE.Color(e);
});
spGui.addColor(controls, 'specular').onChange(function (e) {
    material.specular = new THREE.Color(e);
});
spGui.add(material, 'shininess', 0, 100,)
spGui.add(material, 'wireframe');
spGui.add(material, 'wireframeLinewidth', 0, 20);

camera.lookAt(controls.selected.position);

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

let step = 0.01;
function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());

    if (controls.selected) controls.selected.rotation.y += step;

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
