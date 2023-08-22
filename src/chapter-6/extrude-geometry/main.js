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

        this.amount = 2;
        this.bevelThickness = 2;
        this.bevelSize = 0.5;
        this.bevelEnabled = true;
        this.bevelSegments = 3;
        this.bevelEnabled = true;
        this.curveSegments = 12;
        this.steps = 1;
    }

    redraw = () => {
        redrawGeometryAndUpdateUI(gui, scene, controls, () => {
            const options = {
                amount: this.amount,
                bevelThickness: this.bevelThickness,
                bevelSize: this.bevelSize,
                bevelSegments: this.bevelSegments,
                bevelEnabled: this.bevelEnabled,
                curveSegments: this.curveSegments,
                steps: this.steps

            }
            const geometry = new THREE.ExtrudeGeometry(drawShape(), options);
            geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-20, 0, 0));
            geometry.applyMatrix4(new THREE.Matrix4().makeScale(0.4, 0.4, 0.4));
            return geometry;
        })
    };
}

let camera, renderer;

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

function drawShape() {
    const shape = new THREE.Shape();
    // start point
    shape.moveTo(10, 10);
    // straight line upwards
    shape.lineTo(10, 40);
    // the top of the figure, curve to the right
    shape.bezierCurveTo(15, 25, 25, 25, 30, 40);
    // spline back down
    // Connects a new SplineCurve onto the path.
    shape.splineThru(
        [
            new THREE.Vector2(32, 30),
            new THREE.Vector2(28, 20),
            new THREE.Vector2(30, 10),
        ]
    );

    // curve at the bottom
    shape.quadraticCurveTo(20, 15, 10, 10);

    // add 'eye' hole one
    const hole1 = new THREE.Path();
    // Adds an absolutely positioned EllipseCurve to the path.
    hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
    shape.holes.push(hole1);

    // add 'eye hole 2'
    const hole2 = new THREE.Path();
    hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
    shape.holes.push(hole2);

    // add 'mouth'
    const hole3 = new THREE.Path();
    hole3.absarc(20, 16, 2, 0, Math.PI, true);
    shape.holes.push(hole3);

    // return the shape
    return shape;
}

const gui = new GUI();
const controls = new Controls();
gui.add(controls, 'amount', 0, 20).onChange(controls.redraw);
gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.redraw);
gui.add(controls, 'bevelSize', 0, 10).onChange(controls.redraw);
gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.redraw);
gui.add(controls, 'bevelEnabled').onChange(controls.redraw);
gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.redraw);
gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.redraw);

// add a material section, so we can switch between materials
gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial,
    meshStandard: applyMeshStandardMaterial
}).onChange(controls.redraw)

gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

controls.redraw();

let step = 0;
function animate() {
    stats.update();
    step += 0.005;
    controls.mesh.rotation.set(step, step, step);
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
