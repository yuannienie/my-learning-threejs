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

class Controls {
    constructor() {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.segments = 12;
        this.phiStart = 0;
        this.phiLength = 2 * Math.PI;
    }

    redraw = () => {
        redrawGeometryAndUpdateUI(
            gui,
            scene,
            controls,
            () => generatePoints(this.segments, this.phiStart, this.phiLength),
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
gui.add(controls, 'segments', 0, 50).step(1).onChange(controls.redraw);
gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);

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

function generatePoints(segments, phiStart, phiLength) {
    if (spGroup) scene.remove(spGroup);
    const points = [];
    const [height, count] = [5, 30];
    for (let i = 0; i < count; i++) {
        points.push(
            new THREE.Vector2(
                (Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12,
                (i - count) + count / 2
            )
        )
    }

    spGroup = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
        transparent: false,
    });
    // for seeing the points clearly
    points.forEach(point => {
        const spGeom = new THREE.SphereGeometry(0.2);
        const spMesh = new THREE.Mesh(spGeom, material);
        spMesh.position.set(point.x, point.y, 0);
        spGroup.add(spMesh);
    })
    scene.add(spGroup);
    // Creates meshes with axial symmetry like vases. The lathe rotates around the Y axis.
    return new THREE.LatheGeometry(points, segments, phiStart, phiLength);
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
