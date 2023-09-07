import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane, initTrackballControls } from '../../utils';
import { addGeometry } from '../util';
import roughness from '@assets/textures/engraved/roughness-map.jpg?url';
import alternative from '@assets/textures/cubemap/2294472375_24a3b8ef46_o.jpg?url';

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
pointLight = new THREE.PointLight(0xff0858);
scene.add(pointLight);
// create a sphere light to show the normal-mapping effects
const sphereLight = new THREE.SphereGeometry(0.2);
const sphereLightMaterial = new THREE.MeshStandardMaterial({ color: 0xff5808 });
sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
scene.add(sphereLightMesh);

const trackControls = initTrackballControls(camera, renderer);

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();
const controls = new Controls();

function createObject() {
    const textureLoader = new THREE.TextureLoader();

    const alternativeMap = textureLoader.load(alternative);
    alternativeMap.mapping = THREE.EquirectangularReflectionMapping;
    alternativeMap.magFilter = THREE.LinearFilter;
    alternativeMap.minFilter = THREE.LinearMipMapLinearFilter;
    scene.background = alternativeMap;

    const sphere = new THREE.SphereGeometry(8, 50, 50);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        // envMap: scene.background,
        envMap: alternativeMap,
        color: 0xffffff,
        metalness: 1,
        roughness: 0.5,
    });

    const cubeMaterialWithMetalMap = cubeMaterial.clone();
    // The blue channel of this texture is used to alter the metalness of the material.
    cubeMaterialWithMetalMap.metalnessMap = textureLoader.load(roughness);
    const cube1 = addGeometry({
        geom: sphere,
        name: 'metal',
        gui,
        controls,
        material: cubeMaterialWithMetalMap
    })
    cube1.position.x = -10;
    cube1.rotation.y = (1 / 3) * Math.PI;
    scene.add(cube1);

    const cubeMaterialWithRoughnessMap = cubeMaterial.clone();
    // The green channel of this texture is used to alter the roughness of the material.
    cubeMaterialWithRoughnessMap.roughnessMap = textureLoader.load(roughness);
    const cube2 = addGeometry({
        geom: sphere,
        name: 'rough',
        gui,
        controls,
        material: cubeMaterialWithRoughnessMap
    })
    cube2.position.x = 10;
    cube2.rotation.y = (-1 / 3) * Math.PI;
    scene.add(cube2);
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