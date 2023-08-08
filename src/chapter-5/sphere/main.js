import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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
        this.appliedMaterial = applyMeshNormalMaterial;
        this.castShadow = true;
        this.groundPlaneVisible = true;

        const baseSphere = new THREE.SphereGeometry(4, 10, 10);
        this.radius = baseSphere.parameters.radius;
        this.widthSegments = baseSphere.parameters.widthSegments;
        this.heightSegments = baseSphere.parameters.heightSegments;
        this.phiStart = 0;
        this.phiLength = Math.PI * 2;
        this.thetaStart = 0;
        this.thetaLength = Math.PI;
    }

    redraw = () => {
        redrawGeometryAndUpdateUI(
            gui,
            scene,
            controls,
            () => new THREE.SphereGeometry(
                this.radius,
                this.widthSegments,
                this.heightSegments,
                this.phiStart,
                this.phiLength,
                this.thetaStart,
                this.thetaLength,
            )
        );
    };
}

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

camera = initPerspectiveCamera();

renderer = initRenderer();

initDefaultLight(scene);

addAxesHelper(scene);

const groundPlane = addLargeGroundPlane(scene);
groundPlane.position.y = -10;
scene.add(groundPlane);

const stats = new Stats();
container.append(stats.domElement);

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

const gui = new GUI();
const controls = new Controls();
gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
gui.add(controls, 'widthSegments', 0, 50).onChange(controls.redraw);
gui.add(controls, 'heightSegments', 0, 50).onChange(controls.redraw);
gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);
// add a material section, so we can switch between materials
gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial,
    meshStandard: applyMeshStandardMaterial
}).onChange(controls.redraw)

gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

controls.redraw();

function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());
    controls.mesh.rotation.x += 0.01;
    controls.mesh.rotation.y += 0.01;
    controls.mesh.rotation.z += 0.01;
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
