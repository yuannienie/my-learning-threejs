import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const width = window.innerWidth;
const height = window.innerHeight;
const w2hRatio = width / height;
const container = document.querySelector('#webgl-container');
let plane, cube, sphere;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, w2hRatio, 0.1, 1000);
camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

function createObj() {
    // create a plane
    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xAAAAAA });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(15, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    // create a cube
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xFF0000,
    })
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    // create a sphere
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777FF,
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    // create light
    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, 15);
    spotLight.castShadow = true;
    // paramters to control shadow showing
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;

    // add ambient light
    const ambienLight = new THREE.AmbientLight(0x353535);

    scene.add(spotLight);
    scene.add(ambienLight);
}

function initResizeEvent() {
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}

// initial statistics and GUI module
const stats = new Stats();
const params = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03,
};
const gui = new GUI();
gui.add(params, "rotationSpeed", 0, 0.5);
gui.add(params, "bouncingSpeed", 0, 0.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", render);
controls.minDistance = 10;
controls.maxDistance = 100;
controls.enablePan = false;
container.appendChild(stats.domElement);

const clock = new THREE.Clock();
let step = 0;
function animate() {
    stats.update();
    controls.update(clock.getDelta());
    cube.rotation.x += params.rotationSpeed;
    cube.rotation.y += params.rotationSpeed;
    cube.rotation.z += params.rotationSpeed;

    step += params.bouncingSpeed;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

createObj();
initResizeEvent();
animate();

// add the output of the renderer to the html element
container.appendChild(renderer.domElement);

