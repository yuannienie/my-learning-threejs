import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane } from '../../utils';
import city from '@assets/models/city/city.obj?url';
import marsColor from '@assets/textures/mars/mars_1k_color.jpg?url';
import marsNormal from '@assets/textures/mars/mars_1k_normal.jpg?url';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = initRenderer();

const camera = initPerspectiveCamera();

const scene = new THREE.Scene();

scene.add(new THREE.AmbientLight(0x222222));

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(50, 10, 0);

scene.add(dirLight);

addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const planetTexture = new THREE.TextureLoader().load(marsColor);
const normalTexture = new THREE.TextureLoader().load(marsNormal);
const planetMaterial = new THREE.MeshLambertMaterial({ map: planetTexture, normalMap: normalTexture });

scene.add(new THREE.Mesh(new THREE.SphereGeometry(20, 50, 50), planetMaterial), camera);
// Object for keeping track of time. This uses performance.now if it is available, otherwise it reverts to the less accurate Date.now.
const clock = new THREE.Clock();

// Orbit controls allow the camera to orbit around a target.
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.autoRotate = true;
// Adds key event listeners to the given DOM element. window is a recommended argument for using this method.
orbitControls.listenToKeyEvents(window);

function animate() {
    stats.update();
    // Get the seconds passed since the time .oldTime was set and sets .oldTime to the current time.
    orbitControls.update(clock.getDelta());
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

animate();