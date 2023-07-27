import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper } from '../../utils';
import grassLight from '@assets/textures/ground/grasslight-big.jpg';

class Controls {
    constructor() {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.hemisphere = true;
        this.color = 0x0000ff;
        this.groundColor = 0x00ff00;
        this.intensity = 0.6;
    };
};

let trackBallControls, camera, renderer, plane, cube, sphere;

const scene = new THREE.Scene();

camera = initPerspectiveCamera();

renderer = initRenderer();

addAxesHelper(scene);

// create the texture for plane
const textureGrass = new THREE.TextureLoader().load(grassLight);
textureGrass.wrapS = THREE.RepeatWrapping;
textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.repeat.set(10, 10);

// add plane
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.position.set(15, 0, 0);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

// create a cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;

// position the cube
cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;

// add the cube to the scene
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x7777ff });
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// position the sphere
sphere.position.x = 10;
sphere.position.y = 5;
sphere.position.z = 10;
sphere.castShadow = true;

// add the sphere to the scene
scene.add(sphere);

// add spotlight for a bit of light
const spotLight0 = new THREE.SpotLight(0xcccccc);
spotLight0.position.set(-40, 60, -10);
spotLight0.lookAt(plane);
spotLight0.castShadow = true;
scene.add(spotLight0);

const pointColor = "#ffffff";
const dirLight = new THREE.DirectionalLight(pointColor);
dirLight.position.set(30, 10, -50);
dirLight.castShadow = true;
dirLight.target = plane;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.left = -50;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = -50;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

function addControls() {
    const gui = new GUI();
    const controls = new Controls();
    gui.add(controls, 'hemisphere').onChange(function (e) {
        hemiLight.intensity = !e ? 0 : controls.intensity;
    });
    gui.addColor(controls, 'groundColor').onChange(function (e) {
        hemiLight.groundColor = new THREE.Color(e);
    });
    gui.addColor(controls, 'color').onChange(function (e) {
        hemiLight.color = new THREE.Color(e);
    });
    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        hemiLight.intensity = e;
    });

    return controls;
}

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);
const controls = addControls();

let step = 0;
function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());
    // rotate the cube around its axes
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;
    // bounce the sphere up and down
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

