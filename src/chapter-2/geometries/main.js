import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

class Controls {
    constructor(cube) {
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.positionX = 0;
        this.positionY = 5;
        this.positionZ = 0;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;

        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.visible = true;

        this.target = cube;
    };

    reset() {
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.positionX = 0;
        this.positionY = 5;
        this.positionZ = 0;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;

        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.target.position.x = this.positionX;
        this.target.position.y = this.positionY;
        this.target.position.z = this.positionZ;
        this.target.scale.set(this.scaleX, this.scaleY, this.scaleZ);
        this.target.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

        this.visible = true;
    }

    translate() {
        cube.translateX(this.translateX);
        cube.translateY(this.translateY);
        cube.translateZ(this.translateZ);

        this.positionX = cube.position.x;
        this.positionY = cube.position.y;
        this.positionZ = cube.position.z;
    }
};

const width = window.innerWidth;
const height = window.innerHeight;
const w2hRatio = width / height;
const container = document.querySelector('#webgl-container');

let plane, cube;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, w2hRatio, 0.1, 1000);
camera.position.set(-30, 40, 40);
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

// add cube
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 5;
cube.castShadow = true;
scene.add(cube)

const controls = new Controls(cube);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

const trackBallControls = new OrbitControls(camera, renderer.domElement);
trackBallControls.addEventListener("change", render);
trackBallControls.minDistance = 10;
trackBallControls.maxDistance = 100;
trackBallControls.enablePan = false;

const clock = new THREE.Clock();

// add gui
const gui = new GUI();
const guiScale = gui.addFolder('scale');
guiScale.add(controls, 'scaleX', 0, 5).listen();
guiScale.add(controls, 'scaleY', 0, 5).listen();
guiScale.add(controls, 'scaleZ', 0, 5).listen();

const guiPosition = gui.addFolder('position');
const contX = guiPosition.add(controls, 'positionX', -10, 10).listen();
const contY = guiPosition.add(controls, 'positionY', -4, 20).listen();
const contZ = guiPosition.add(controls, 'positionZ', -10, 10).listen();
contX.onChange(function (value) {
    cube.position.x = controls.positionX;
});
contY.onChange(function (value) {
    cube.position.y = controls.positionY;
});
contZ.onChange(function (value) {
    cube.position.z = controls.positionZ;
});

const guiRotation = gui.addFolder('rotation');
guiRotation.add(controls, 'rotationX', -4, 4).listen();
guiRotation.add(controls, 'rotationY', -4, 4).listen();
guiRotation.add(controls, 'rotationZ', -4, 4).listen();

const guiTranslate = gui.addFolder('translate');
guiTranslate.add(controls, 'translateX', -10, 10).listen();
guiTranslate.add(controls, 'translateY', -10, 10).listen();
guiTranslate.add(controls, 'translateZ', -10, 10).listen();
guiTranslate.add(controls, 'translate');

gui.add(controls, 'visible');
gui.add(controls, 'reset');

function render() {
    renderer.render(scene, camera);
}

function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());

    cube.visible = controls.visible;

    cube.rotation.x = controls.rotationX;
    cube.rotation.y = controls.rotationY;
    cube.rotation.z = controls.rotationZ;

    cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
    requestAnimationFrame(animate);
    render();
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

// add the output of the renderer to the html element
container.appendChild(renderer.domElement);
