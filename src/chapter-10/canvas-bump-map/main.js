import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane, initTrackballControls } from '../../utils';
import { addGeometry } from '../util';
import wood from '@assets/textures/general/wood-2.jpg?url';
import { Perlin } from './perlin';

class Controls {
    constructor() { }
}

let sphereMesh;

const renderer = initRenderer();

const lookAt = new THREE.Vector3(0, 20, 40);
const camera = initPerspectiveCamera(lookAt);

const scene = new THREE.Scene();

initDefaultLight(scene);

const groundPlane = addLargeGroundPlane(scene, true);
groundPlane.position.y = -10;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

const trackControls = initTrackballControls(camera, renderer);

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();
const controls = new Controls();

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
document.getElementById('canvas-output').appendChild(canvas);
const ctx = canvas.getContext("2d");
const date = new Date();
const pn = new Perlin('rnd' + date.getTime());

fillWithPerlin(pn, ctx);
function fillWithPerlin(perlin, ctx) {
    for (let x = 0; x < 256; x++) {
        for (let y = 0; y < 256; y++) {
            const base = new THREE.Color(0xffffff);
            const value = perlin.noise(x / 10, y / 10, 0);
            base.multiplyScalar(value);
            ctx.fillStyle = "#" + base.getHexString();
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function createObject() {
    const textureLoader = new THREE.TextureLoader();
    const cube = new THREE.BoxGeometry(23, 10, 16);
    var cubeMaterial = new THREE.MeshStandardMaterial({
        bumpMap: new THREE.Texture(canvas),
        bumpScale: 3,
        metalness: 0,
        roughness: 1,
        color: 0xffffff,
        map: textureLoader.load(wood)
    });

    sphereMesh = new THREE.Mesh(cube, cubeMaterial);
    sphereMesh.castShadow = true;
    scene.add(sphereMesh);
}

createObject();
const clock = new THREE.Clock();
let step = 0;
function animate() {
    stats.update();
    const delta = clock.getDelta();
    // Get the seconds passed since the time .oldTime was set and sets .oldTime to the current time.
    trackControls.update(delta);
    sphereMesh.rotation.y += step + 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

animate();