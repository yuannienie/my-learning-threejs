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

        this.radius = 10;
        this.detail = 0; // How many levels to subdivide the geometry. The more detail, the smoother the shape.
        this.type = 'Icosahedron';
    }

    getPolyhedron = (type) => {
        let polyhedron = null;
        switch (type) {
            case 'Icosahedron':
                polyhedron = new THREE.IcosahedronGeometry(this.radius, this.detail);
                break;
            case 'Tetrahedron':
                polyhedron = new THREE.TetrahedronGeometry(this.radius, this.detail);
                break;
            case 'Octahedron':
                polyhedron = new THREE.OctahedronGeometry(this.radius, this.detail);
                break;
            case 'Dodecahedron':
                polyhedron = new THREE.DodecahedronGeometry(this.radius, this.detail);
                break;
            case 'Custom':
                const verticesOfCube = [
                    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
                    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
                ];
                const indicesOfFaces = [
                    2, 1, 0, 0, 3, 2,
                    0, 4, 7, 7, 3, 0,
                    0, 1, 5, 5, 4, 0,
                    1, 2, 6, 6, 5, 1,
                    2, 3, 7, 7, 6, 2,
                    4, 5, 6, 6, 7, 4
                ];
                polyhedron = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, this.radius, this.detail);
                break;
            default:
                polyhedron = new THREE.SphereGeometry(this.radius);
                break;
        }

        return polyhedron;
    }

    redraw = () => {
        redrawGeometryAndUpdateUI(
            gui,
            scene,
            controls,
            () => this.getPolyhedron(this.type),
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
gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
gui.add(controls, 'detail', 0, 5).step(1).onChange(controls.redraw);
gui.add(controls, 'type', ['Icosahedron', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Custom']).onChange(controls.redraw);
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
