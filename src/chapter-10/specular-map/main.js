import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane, initTrackballControls } from '../../utils';
import { addGeometry } from '../util';
import earth from '@assets/textures/earth/Earth.png?url';
import earthNormal from '@assets/textures/earth/EarthNormal.png?url';
import eartchSpec from '@assets/textures/earth/EarthSpec.png?url';

class Controls {
    constructor() {
    }
}

let sphere;

const renderer = initRenderer();

const lookAt = new THREE.Vector3(0, 20, 40);
const camera = initPerspectiveCamera(lookAt);

const scene = new THREE.Scene();

initDefaultLight(scene);

const trackControls = initTrackballControls(camera, renderer);

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();
const controls = new Controls();

function createObject() {
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load(earth),
        normalMap: textureLoader.load(earthNormal),
        // specular defines how shiny the material is and the color of its shine.
        // The specular map value affects both how much the specular surface highlight contributes and how much of the environment map affects the surface. Default is null.
        specularMap: textureLoader.load(eartchSpec),
        normalScale: new THREE.Vector2(6, 6),
    })

    const sphereGeo = new THREE.SphereGeometry(9, 100, 100);
    sphere = addGeometry({
        geom: sphereGeo,
        name: 'earth',
        gui,
        controls,
        material
    })
    scene.add(sphere)
}

createObject();
const clock = new THREE.Clock();
let step = 0;
function animate() {
    stats.update();
    const delta = clock.getDelta();
    // Get the seconds passed since the time .oldTime was set and sets .oldTime to the current time.
    trackControls.update(delta);
    sphere.rotation.y += step + 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

animate();