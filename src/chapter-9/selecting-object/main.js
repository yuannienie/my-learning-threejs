import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane } from '../../utils';

class Controls {
    constructor() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.scalingSpeed = 0.03;
        this.showRay = false;
    }
}

let cube, sphere, cylinder;

const renderer = initRenderer();

const camera = initPerspectiveCamera();

const scene = new THREE.Scene();

initDefaultLight(scene);

const groudPlane = addLargeGroundPlane(scene);
groudPlane.position.y = 0;

addObjects(scene);

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const pointer = new THREE.Vector3();

const controls = new Controls();
const gui = new GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'bouncingSpeed', 0, 0.5);
gui.add(controls, 'scalingSpeed', 0, 0.5);
gui.add(controls, 'showRay').onChange(function (e) {
    if (tube) scene.remove(tube)
});


function addObjects(scene) {
    // create a cube
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -10;
    cube.position.y = 4;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    // add the sphere to the scene
    scene.add(sphere);

    const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);
    const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x77ff77 });
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.castShadow = true;
    cylinder.position.set(0, 0, 1);

    scene.add(cylinder);
}

let step = 0, scalingStep = 0;
function animate() {
    stats.update();
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    // bounce the sphere up and down
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    // scale the cylinder
    scalingStep += controls.scalingSpeed;
    const scaleX = Math.abs(Math.sin(scalingStep / 4));
    const scaleY = Math.abs(Math.cos(scalingStep / 5));
    const scaleZ = Math.abs(Math.sin(scalingStep / 7));
    cylinder.scale.set(scaleX, scaleY, scaleZ);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

let INTERSECTED;

document.addEventListener('mousemove', (e) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    let vector = new THREE.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
    // Projects this vector from the camera's normalized device coordinate (NDC) space into world space.
    vector = vector.unproject(camera);
    // Raycasting is used for mouse picking (working out what objects in the 3d space the mouse is over) amongst other things.
    const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    const intersects = raycaster.intersectObjects([sphere, cube, cylinder]);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0x0000ff);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }
}, false);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

animate();