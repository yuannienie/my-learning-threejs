import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

class Controls {
    constructor() {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;
    };
    
    removeCube() {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh && lastObject !== plane) {
            scene.remove(lastObject);
            this.numberOfObjects = scene.children.length;
        }
    };

    addCube() {
        const cubeSize = Math.ceil((Math.random() * 3));
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = "cube-" + scene.children.length;
        // position the cube randomly in the scene
        cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
        cube.position.y = Math.round((Math.random() * 5));
        cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

        // add the cube to the scene
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
    };

   outputObjects() {
        console.log(scene.children);
    }
};

const width = window.innerWidth;
const height = window.innerHeight;
const w2hRatio = width / height;
const container = document.querySelector('#webgl-container');

let plane;

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

const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = 0;
plane.position.z = 0;

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x3c3c3c);
scene.add(ambientLight);

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

scene.add(plane);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();
const controls = new Controls();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'addCube');
gui.add(controls, 'removeCube');
gui.add(controls, 'outputObjects');
gui.add(controls, 'numberOfObjects').listen();

const trackBallControls = new OrbitControls(camera, renderer.domElement);
trackBallControls.addEventListener("change", render);
trackBallControls.minDistance = 10;
trackBallControls.maxDistance = 100;
trackBallControls.enablePan = false;

const clock = new THREE.Clock();

function render() {
    renderer.render(scene, camera);
}

function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());
    scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj !== plane) {
            obj.rotation.x += controls.rotationSpeed;
            obj.rotation.y += controls.rotationSpeed;
            obj.rotation.z += controls.rotationSpeed;
        }
    })
    requestAnimationFrame(animate);
    render();
}

animate();

// add the output of the renderer to the html element
container.appendChild(renderer.domElement);

