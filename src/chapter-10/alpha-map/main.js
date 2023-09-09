import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane, initTrackballControls } from '../../utils';
import { addGeometry } from '../util';
import alpha from '@assets/textures/alpha/partial-transparency.png?url';

class Controls {
    constructor() {
    }
}


const renderer = initRenderer();

const lookAt = new THREE.Vector3(0, 20, 40);
const camera = initPerspectiveCamera(lookAt);

const scene = new THREE.Scene();

initDefaultLight(scene);

const groundPlane = addLargeGroundPlane(scene, true);
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
    const alphaTexture = textureLoader.load(alpha);
    const material = new THREE.MeshStandardMaterial({
        // The alpha map is a grayscale texture that controls the opacity across the surface 
        // (black: fully transparent; white: fully opaque). Default is null.
        alphaMap: alphaTexture,
        side: THREE.DoubleSide, // look another side acorss the ball
        metalness: 0.02,
        roughness: 0.07,
        color: 0xffffff,
        // Sets the alpha value to be used when running an alpha test. The material will not be rendered if the opacity is lower than this value. Default is 0.
        alphaTest: 0.5,
    })
    material.alphaMap.wrapS = THREE.RepeatWrapping;
    material.alphaMap.wrapT = THREE.RepeatWrapping;
    material.alphaMap.repeat.set(8, 8);
    const sphereGeometry = new THREE.SphereGeometry(10, 100, 100);
    const sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);
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