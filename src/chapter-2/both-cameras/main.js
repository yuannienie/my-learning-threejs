import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

class Controls {
    constructor() {
        this.perspective = 'Perspective';
    };

    switchCamera() {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera = new THREE.OrthographicCamera(-window.innerWidth / 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, -200, 500);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            this.perspective = "Orthographic";
        } else {
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            this.perspective = "Perspective";
        }
    }
};

const width = window.innerWidth;
const height = window.innerHeight;
const w2hRatio = width / height;
const container = document.querySelector('#webgl-container');

let plane, trackBallControls, camera, eyeball;

const scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(45, w2hRatio, 0.1, 1000);
camera.position.set(120, 60, 180);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

const planeGeometry = new THREE.PlaneGeometry(180, 180);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = 0;
plane.position.z = 0;

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x292929);
scene.add(ambientLight);

// add spotlight for the shadows
const directLight = new THREE.DirectionalLight(0xffffff, 0.7);
directLight.position.set(-20, 40, 60);
scene.add(directLight);

scene.add(plane);

// add small cube to fill plane
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const [unitWidth, unitHeight] = [5, 5];
for (let i = 0; i < planeGeometry.parameters.width / unitWidth; i++) {
    for (let j = 0; j < planeGeometry.parameters.height / unitHeight; j++) {
        const rnd = Math.random() * 0.75 + 0.25;
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(rnd, 0, 0) });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = -(planeGeometry.parameters.width / 2) + 2 + i * unitWidth;
        cube.position.y = 2;
        cube.position.z = -(planeGeometry.parameters.height / 2) + 2 + j * unitHeight;
        scene.add(cube);
    }
}

// add eyeball
const eyeGeometry = new THREE.SphereGeometry(2);
const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
eyeball = new THREE.Mesh(eyeGeometry, eyeMaterial);
scene.add(eyeball);

const controls = new Controls();

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

trackBallControls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();

// add gui
const gui = new GUI();
gui.add(controls, 'switchCamera');
gui.add(controls, 'perspective').listen();

let step = 0;
function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());
    step += 0.02;
    if (camera instanceof THREE.Camera) {
        const x = 10 + (100 * (Math.sin(step)));
        camera.lookAt(new THREE.Vector3(x, 10, 0));
        eyeball.position.copy(new THREE.Vector3(x, 10, 0));
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

// add the output of the renderer to the html element
container.appendChild(renderer.domElement);
