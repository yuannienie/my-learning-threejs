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
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import bitstream from '@assets/fonts/bitstream_vera_sans_mono_roman.typeface.json?url';
import helve_bold from '@assets/fonts/helvetiker_bold.typeface.json?url';
import helve_regular from '@assets/fonts/helvetiker_regular.typeface.json?url';

class Controls {
    constructor() {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.size = 90;
        this.height = 90;
        this.bevelThickness = 2;
        this.bevelSize = 0.5;
        this.bevelEnabled = true;
        this.bevelSegments = 3;
        this.bevelEnabled = true;
        this.curveSegments = 12;
        this.steps = 1;
        this.fontName = "bitstream vera sans mono";
    }

    redraw = () => {
        switch (this.fontName) {
            case 'bitstream vera sans mono':
                this.font = font_bitstream;
                break;
            case 'helvetiker':
                this.font = font_helvetiker_regular;
                break;
            case 'helvetiker bold':
                this.font = font_helvetiker_bold;
                break;
        }
        redrawGeometryAndUpdateUI(
            gui,
            scene,
            controls,
            () => {
                const options = {
                    size: this.size,
                    height: this.height,
                    weight: this.weight,
                    font: this.font,
                    bevelThickness: this.bevelThickness,
                    bevelSize: this.bevelSize,
                    bevelSegments: this.bevelSegments,
                    bevelEnabled: this.bevelEnabled,
                    curveSegments: this.curveSegments,
                    steps: this.steps
                };
                // based on THREE.ExtrudeGeometry to create 3D text
                // also font import is expensive, not an ideal texture for use
                const geom = new TextGeometry('Hello Three.js', options);
                geom.applyMatrix4(new THREE.Matrix4().makeScale(0.05, 0.05, 0.05));
                geom.center();
                return geom;
            }
        )
    };
}

let camera, renderer, font_bitstream, font_helvetiker_regular, font_helvetiker_bold;

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
gui.add(controls, 'size', 0, 200).onChange(controls.redraw);
gui.add(controls, 'height', 0, 200).onChange(controls.redraw);
gui.add(controls, 'fontName', ['bitstream vera sans mono', 'helvetiker', 'helvetiker bold']).onChange(controls.redraw);
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


new FontLoader().load(bitstream, (response) => {
    controls.font = response;
    font_bitstream = response;
    controls.redraw();
})

new FontLoader().load(helve_bold, (response) => {
    font_helvetiker_bold = response;
})

new FontLoader().load(helve_regular, (response) => {
    font_helvetiker_regular = response;
})

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
