/**
 * A material rendered with custom shaders. A shader is a small program written in GLSL that runs on the GPU.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import {
    initRenderer,
    initPerspectiveCamera,
    container,
    addAxesHelper,
} from "../../utils";

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

camera = initPerspectiveCamera();

renderer = initRenderer();

addAxesHelper(scene);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

const meshMaterial1 = createMaterial('vertex-shader', 'fragment-shader-1');
const meshMaterial2 = createMaterial('vertex-shader', 'fragment-shader-2');
const meshMaterial3 = createMaterial('vertex-shader', 'fragment-shader-3');
const meshMaterial4 = createMaterial('vertex-shader', 'fragment-shader-4');
const meshMaterial5 = createMaterial('vertex-shader', 'fragment-shader-5');
const meshMaterial6 = createMaterial('vertex-shader', 'fragment-shader-6');

const material = [meshMaterial1, meshMaterial2, meshMaterial3, meshMaterial4, meshMaterial5, meshMaterial6];
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(20, 20, 20),
    material
)

scene.add(cube);

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

let step = 0.01;
function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());

    cube.rotation.x += step;
    cube.rotation.y += step;
    cube.rotation.z += step;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener(
    "resize",
    () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
);

animate();

function createMaterial(vertexShader, fragmentShader) {
    const vertexShaderSource = document.getElementById(vertexShader).innerHTML;
    const fragmentShaderSource = document.getElementById(fragmentShader).innerHTML;

    const attributes = {};
    const uniforms = {
        time: {
            type: 'f',
            value: 0.2
        },
        scale: {
            type: 'f',
            value: 0.2
        },
        alpha: {
            type: 'f',
            value: 0.6
        },
        resolution: {
            type: "v2",
            value: new THREE.Vector2()
        }
    };

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;

    const meshMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        transparent: true
    });


    return meshMaterial;
}