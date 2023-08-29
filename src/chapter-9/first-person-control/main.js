import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane } from '../../utils';
import city from '@assets/models/city/city.obj?url';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import chroma from 'chroma-js';
import { setRandomColors } from './util';

const renderer = initRenderer();

const camera = initPerspectiveCamera();

const scene = new THREE.Scene();

initDefaultLight(scene);

const fpControls = new FirstPersonControls(camera, document);
fpControls.lookSpeed = 0.4;
fpControls.movementSpeed = 20;
fpControls.lookVertical = true;
fpControls.constrainVertical = true;
fpControls.verticalMin = 1.0;
fpControls.verticalMax = 2.0;

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const loader = new OBJLoader();
loader.load(
    city,
    (obj) => {
        // scale is a function that maps numeric values to a color palette. 
        const scale = chroma.scale(['red', 'green', 'blue']);
        setRandomColors(obj, scale);
        scene.add(obj);
    }
)

// Object for keeping track of time. This uses performance.now if it is available, otherwise it reverts to the less accurate Date.now.
const clock = new THREE.Clock();

function animate() {
    stats.update();
    // Get the seconds passed since the time .oldTime was set and sets .oldTime to the current time.
    fpControls.update(clock.getDelta());
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

animate();