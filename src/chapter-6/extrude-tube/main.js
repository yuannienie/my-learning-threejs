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

        this.numberOfPoints = 5;
        this.segments = 64;
        this.radius = 1;
        this.radiusSegments = 8;
        this.closed = false;
        this.points = [];
    }

    newPoints = () => {
        const points = [];
        for (let i = 0; i < controls.numberOfPoints; i++) {
            const randomX = -10 + Math.round(Math.random() * 20);
            const randomY = -5 + Math.round(Math.random() * 10);
            const randomZ = -10 + Math.round(Math.random() * 20);

            points.push(new THREE.Vector3(randomX, randomY, randomZ));
        }
        controls.points = points;
        controls.redraw();
    }

    redraw = () => {
        redrawGeometryAndUpdateUI(
            gui,
            scene,
            controls,
            () => generatePoints(
                this.points,
                this.segments,
                this.radius,
                this.radiusSegments,
                this.closed,
            )
        )
    };
}

let spGroup, camera, renderer;

const scene = new THREE.Scene();

camera = initPerspectiveCamera();

renderer = initRenderer();

initDefaultLight(scene);

const stats = new Stats();
container.append(stats.domElement);

addAxesHelper(scene);

const groundPlane = addLargeGroundPlane(scene);
groundPlane.position.y = -30;
scene.add(groundPlane);

function generatePoints(points, segments, radius, radiusSegments, closed) {
    if (spGroup) scene.remove(spGroup)
    spGroup = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: false
    });
    points.forEach((point) => {
        const spGeom = new THREE.SphereGeometry(0.2);
        const spMesh = new THREE.Mesh(spGeom, material);
        spMesh.position.copy(point);
        spGroup.add(spMesh);
    });
    // add the points as a group to the scene
    scene.add(spGroup);
    // Create a smooth 3d spline curve from a series of points using the Catmull-Rom algorithm.
    const path = new THREE.CatmullRomCurve3(points);
    // define the path and create the tube along the path
    return new THREE.TubeGeometry(path, segments, radius, radiusSegments, closed);
}

const gui = new GUI();
const controls = new Controls();
gui.add(controls, 'newPoints');
gui.add(controls, 'numberOfPoints', 2, 15).step(1).onChange(controls.newPoints);
gui.add(controls, 'segments', 0, 200).step(1).onChange(controls.redraw);
gui.add(controls, 'radius', 0, 10).onChange(controls.redraw);
gui.add(controls, 'radiusSegments', 0, 100).step(1).onChange(controls.redraw);
gui.add(controls, 'closed').onChange(controls.redraw);

gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial,
    meshStandard: applyMeshStandardMaterial
}).onChange(controls.redraw)

gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

controls.newPoints();

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
