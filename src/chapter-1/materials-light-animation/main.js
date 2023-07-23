import * as THREE from 'three';

// stats
// const stats = initStats();

const width = window.innerWidth;
const height = window.innerHeight;
const w2hRatio = width / height;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, w2hRatio, 0.1, 1000);
camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(width, height);

const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

// create a plane
function createPlane() {
    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xAAAAAA });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(15, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);
    return plane;
}

// create a cube
function createCube() {
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xFF0000,
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);
    return cube;
}

// create a sphere
function createSphere() {
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777FF,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);
    return sphere;
}

// create light
// 1. spotLight
// 2. ambientLight
function createLight() {
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

createPlane();
const cube = createCube();
const sphere = createSphere();
createLight();

renderer.shadowMap.enabled = true;

let step = 0;
function renderScene() {
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    cube.rotation.z += 0.02;

    step += 0.04;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
}

renderScene();
// add the output of the renderer to the html element
document.getElementById("webgl-container").appendChild(renderer.domElement);
