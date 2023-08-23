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
    radialWave,
    klein,
    plane,
} from "../../utils";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

class Controls {
    constructor() {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;
        this.slices = 50;
        this.stacks = 50;

        this.renderFunction = "radialWave"
    }

    redraw = () => {
        redrawGeometryAndUpdateUI(
            gui,
            scene,
            controls,
            () => {
                let geom;
                // Generate geometry representing a parametric surface.
                switch (this.renderFunction) {
                    case 'radialWave':
                        geom = new ParametricGeometry(radialWave, this.slices, this.stacks);
                        geom.center();
                        return geom;
                    case 'klein':
                        geom = new ParametricGeometry(klein, this.slices, this.stacks);
                        geom.center();
                        return geom;
                    case 'plane':
                        geom = new ParametricGeometry(plane, this.slices, this.stacks);
                        geom.center();
                        return geom;
                }
            }
        )
    };
}

let camera, renderer;

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
gui.add(controls, 'renderFunction', ["radialWave", "klein", "plane"]).onChange(controls.redraw);
gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial,
    meshStandard: applyMeshStandardMaterial
}).onChange(controls.redraw)

gui.add(controls, 'slices', 10, 120, 1).onChange(controls.redraw);
gui.add(controls, 'stacks', 10, 120, 1).onChange(controls.redraw);
gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

controls.redraw();

let step = 0;
function animate() {
    stats.update();
    step += 0.005;
    controls.mesh.rotation.y = step;
    controls.mesh.rotation.x = step;
    controls.mesh.rotation.z = step;
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
