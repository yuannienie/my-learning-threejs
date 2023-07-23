import * as THREE from 'three';

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
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(15, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);
    return plane;
}

// create a cube
function createCube() {
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: true // render as wireframe, not a solid object
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);
    return cube;
}

// create a sphere
function createSphere() {
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777FF,
        wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    scene.add(sphere);
    return sphere;
}

createPlane();
createCube();
createSphere();

renderer.render(scene, camera);

// add the output of the renderer to the html element
document.getElementById("webgl-container").appendChild(renderer.domElement);
