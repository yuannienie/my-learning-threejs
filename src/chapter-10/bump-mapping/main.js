import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane, initTrackballControls } from '../../utils';
import { addGeometry } from '../util';
import stone from '@assets/textures/stone/stone.jpg?url';
import stoneBump from '@assets/textures/stone/stone-bump.jpg?url';

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

    const cube = new THREE.BoxGeometry(16, 16, 16);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(stone),
        metalness: 0.2,
        roughness: 0.07,
    })
    const cubeMaterialWithBumpMap = cubeMaterial.clone();
    // The texture to create a bump map. The black and white values map to the perceived depth in relation to the lights. 
    // Bump doesn't actually affect the geometry of the object, only the lighting. If a normal map is defined this will be ignored.
    cubeMaterialWithBumpMap.bumpMap = textureLoader.load(stoneBump);

    const cubeNoBump = addGeometry({
        geom: cube,
        name: 'cubeNoBump',
        gui,
        controls,
        material: cubeMaterial
    });
    cubeNoBump.position.x = -18;
    cubeNoBump.rotation.y = (1 / 3) * Math.PI;
    scene.add(cubeNoBump);

    const cubeWithBump = addGeometry({
        geom: cube,
        name: 'cubeWithBump',
        gui,
        controls,
        material: cubeMaterialWithBumpMap
    })
    cubeWithBump.position.x = 12;
    cubeWithBump.rotation.y = -(1 / 3) * Math.PI;
    scene.add(cubeWithBump);
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