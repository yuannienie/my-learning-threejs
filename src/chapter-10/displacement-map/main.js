import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane, initTrackballControls } from '../../utils';
import { addGeometry } from '../util';
import w_c from '@assets/textures/w_c.jpg?url';
import w_d from '@assets/textures/w_d.png?url';

class Controls {
    constructor() {
        // How much the displacement map affects the mesh (where black is no displacement, and white is maximum displacement). Without a displacement map set, this value is not applied. Default is 1.
        this.displacementScale = 1;
        // The offset of the displacement map's values on the mesh's vertices. Without a displacement map set, this value is not applied. Default is 0.
        this.displacementBias = 0;
    }
}

let sphereMaterial;

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
gui.add(controls, "displacementScale", -5, 5, 0.01).onChange(function (e) {
    sphereMaterial.displacementScale = e;
});
gui.add(controls, "displacementBias", -5, 5, 0.01).onChange(function (e) {
    sphereMaterial.displacementBias = e;
});

function createObj() {
    const textureLoader = new THREE.TextureLoader();
    const sphere = new THREE.SphereGeometry(8, 180, 180);
    sphereMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(w_c),
        // The displacement map affects the position of the mesh's vertices. 
        // Unlike other maps which only affect the light and shade of the material the displaced vertices can cast shadows, 
        // block other objects, and otherwise act as real geometry. 
        // The displacement texture is an image where the value of each pixel (white being the highest) is mapped against, and repositions, the vertices of the mesh.
        displacementMap: textureLoader.load(w_d),
        metalness: 0.02,
        roughness: 0.07,
        color: 0xffffff,
    })
    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    sphereMesh.castShadow = true;
    scene.add(sphereMesh);
}
createObj();
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