import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane, initTrackballControls } from '../../utils';
import { addGeometry } from '../util';
import metalRust from '@assets/textures/general/metal-rust.jpg?url';
import floorWood from '@assets/textures/general/floor-wood.jpg?url';
import brickWall from '@assets/textures/general/brick-wall.jpg?url';

class Controls {
    constructor() { }
}

const renderer = initRenderer();

const lookAt = new THREE.Vector3(0, 20, 40);
const camera = initPerspectiveCamera(lookAt);

const scene = new THREE.Scene();

initDefaultLight(scene);

const groundPlane = addLargeGroundPlane(scene);
groundPlane.position.y = -10;
scene.add(groundPlane);

const trackControls = initTrackballControls(camera, renderer);

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();
const controls = new Controls();

function createObject() {
    const textureLoader = new THREE.TextureLoader();

    const polyhedron = new THREE.IcosahedronGeometry(8, 0);
    const polyhedronMesh = addGeometry({
        geom: polyhedron,
        name: "polyhedron",
        gui,
        controls,
        texture: textureLoader.load(metalRust),
    });
    polyhedronMesh.position.x = 20;

    const sphere = new THREE.SphereGeometry(5, 20, 20);
    const sphereMesh = addGeometry({
        geom: sphere,
        name: "sphere",
        gui,
        controls,
        texture: textureLoader.load(floorWood),
    });

    const cube = new THREE.BoxGeometry(10, 10, 10);
    const cubeMesh = addGeometry({
        geom: cube,
        name: "cube",
        gui,
        controls,
        texture: textureLoader.load(brickWall),
    });
    cubeMesh.position.x = -20;

    scene.add(polyhedronMesh);
    scene.add(sphereMesh);
    scene.add(cubeMesh);
}

createObject();
const clock = new THREE.Clock();
function animate() {
    stats.update();
    const delta = clock.getDelta();
    // Get the seconds passed since the time .oldTime was set and sets .oldTime to the current time.
    trackControls.update(delta);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

animate();