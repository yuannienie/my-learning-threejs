import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {
    initRenderer,
    initPerspectiveCamera,
    container,
    addAxesHelper,
    addLargeGroundPlane,
    initDefaultLight,
    applyMeshNormalMaterial,
    applyMeshStandardMaterial,
    redrawGeometryAndUpdateUI,
} from "../../utils";
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

class Controls {
    constructor() {
        this.appliedMaterial = applyMeshNormalMaterial;
        this.castShadow = true;
        this.groundPlaneVisible = true;
    }

    redraw = () => {
        redrawGeometryAndUpdateUI(
            gui,
            scene,
            controls,
            () => generatePoints(),
        );
    };
}

let spGroup, camera, renderer;

const scene = new THREE.Scene();

camera = initPerspectiveCamera();

renderer = initRenderer();

initDefaultLight(scene);

const stats = new Stats();
container.append(stats.domElement);

// addAxesHelper(scene);

const groundPlane = addLargeGroundPlane(scene);
groundPlane.position.y = -30;
scene.add(groundPlane);

const gui = new GUI();
const controls = new Controls();
// add a material section, so we can switch between materials
gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial,
    meshStandard: applyMeshStandardMaterial
}).onChange(controls.redraw)
gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })
gui.add(controls, 'redraw');

controls.redraw();

let step = 0;
function animate() {
    stats.update();

    step += 0.005;
    controls.mesh.rotation.set(step, step, step);
    if (spGroup) {
        spGroup.rotation.set(step, step, step);
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function generatePoints() {
    if (spGroup) scene.remove(spGroup);
    const points = [];
    for (let i = 0; i < 20; i++) {
        points.push(new THREE.Vector3(
            -15 + Math.round(Math.random() * 30),
            -15 + Math.round(Math.random() * 30),
            -15 + Math.round(Math.random() * 30),
        ))
    }

    spGroup = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
        color: 0xFF00000,
        transparent: false,
    });
    // for seeing the points clearly
    points.forEach(point => {
        const spGeom = new THREE.SphereGeometry(0.2);
        const spMesh = new THREE.Mesh(spGeom, material);
        spMesh.position.copy(point);
        spGroup.add(spMesh);
    })
    scene.add(spGroup);
    // ConvexGeometry can be used to generate a convex hull for a given array of 3D points. The average time complexity for this task is considered to be O(nlog(n)).
    return new ConvexGeometry(points);
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
