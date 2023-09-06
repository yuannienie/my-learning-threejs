import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane, initTrackballControls } from '../../utils';
import { addGeometry } from '../util';
import plaster from '@assets/textures/general/plaster.jpg?url';
import plasterNormal from '@assets/textures/general/plaster-normal.jpg?url';

class Controls {
    constructor() {
        this.normalScaleX = 1;
        this.normalScaleY = 1;
    }
}

let sphereLightMesh, pointLight, cubeMaterialWithNormalMap;

const renderer = initRenderer();

const lookAt = new THREE.Vector3(0, 20, 40);
const camera = initPerspectiveCamera(lookAt);

const scene = new THREE.Scene();

initDefaultLight(scene);
pointLight = new THREE.PointLight(0xff5808);
scene.add(pointLight);
// create a sphere light to show the normal-mapping effects
const sphereLight = new THREE.SphereGeometry(0.2);
const sphereLightMaterial = new THREE.MeshStandardMaterial({ color: 0xff5808 });
sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
scene.add(sphereLightMesh);

const groundPlane = addLargeGroundPlane(scene, true);
groundPlane.position.y = -10;
scene.add(groundPlane);

const trackControls = initTrackballControls(camera, renderer);

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();
const controls = new Controls();
// How much the normal map affects the material.
gui.add(controls, "normalScaleX", -3, 3, 0.001).onChange(function (e) {
    cubeMaterialWithNormalMap.normalScale.set(controls.normalScaleX, controls.normalScaleY);
});
gui.add(controls, "normalScaleY", -3, 3, 0.001).onChange(function (e) {
    cubeMaterialWithNormalMap.normalScale.set(controls.normalScaleX, controls.normalScaleY);
});

function createObject() {
    const textureLoader = new THREE.TextureLoader();

    const cube = new THREE.BoxGeometry(16, 16, 16);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(plaster),
        metalness: 0.2,
        roughness: 0.07,
    })
    cubeMaterialWithNormalMap = cubeMaterial.clone();
    // The texture to create a normal map. 
    // The RGB values affect the surface normal for each pixel fragment and change the way the color is lit. 
    // Normal maps do not change the actual shape of the surface, only the lighting. 
    cubeMaterialWithNormalMap.normalMap = textureLoader.load(plasterNormal);

    const cubeNoBump = addGeometry({
        geom: cube,
        name: 'cube-1',
        gui,
        controls,
        material: cubeMaterial
    });
    cubeNoBump.position.x = -18;
    cubeNoBump.rotation.y = (1 / 3) * Math.PI;
    scene.add(cubeNoBump);

    const cubeWithBump = addGeometry({
        geom: cube,
        name: 'cube-2',
        gui,
        controls,
        material: cubeMaterialWithNormalMap
    })
    cubeWithBump.position.x = 12;
    cubeWithBump.rotation.y = -(1 / 3) * Math.PI;
    scene.add(cubeWithBump);
}

createObject();

let phase = 0;
let invert = 1;
const clock = new THREE.Clock();
function animate() {
    stats.update();
    const delta = clock.getDelta();
    // Get the seconds passed since the time .oldTime was set and sets .oldTime to the current time.
    trackControls.update(delta);

    if (phase > 2 * Math.PI) {
        invert *= -1;
        phase -= 2 * Math.PI;
    } else {
        phase += 0.02;
    }

    sphereLightMesh.position.z = +(21 * Math.sin(phase));
    sphereLightMesh.position.x = -14 + 14 * Math.cos(phase);
    sphereLightMesh.position.y = 5;

    if (invert === -1) {
        sphereLightMesh.position.x = -sphereLightMesh.position.x;
    }

    pointLight.position.copy(sphereLightMesh.position);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

animate();