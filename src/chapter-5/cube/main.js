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

        const baseGeom = new THREE.BoxGeometry(4, 10, 10, 4, 4, 4);
        this.width = baseGeom.parameters.width;
        this.height = baseGeom.parameters.height;
        this.depth = baseGeom.parameters.depth;

        this.widthSegments = baseGeom.parameters.widthSegments;
        this.heightSegments = baseGeom.parameters.heightSegments;
        this.depthSegments = baseGeom.parameters.depthSegments;
    }

    redraw = () => {
        redrawGeometryAndUpdateUI(
            gui,
            scene,
            controls,
            () => new THREE.BoxGeometry(
                this.width,
                this.height,
                this.depth,
                Math.round(this.widthSegments), Math.round(this.heightSegments), Math.round(this.depthSegments)
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
gui.add(controls, 'width', 0, 40).onChange(controls.redraw);
gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
gui.add(controls, 'depth', 0, 40).onChange(controls.redraw);
gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw);
gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw);
gui.add(controls, 'depthSegments', 0, 10).onChange(controls.redraw);
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
