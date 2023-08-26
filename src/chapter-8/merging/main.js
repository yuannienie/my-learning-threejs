import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane } from '../../utils';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

class Controls {
    constructor() {
        this.cameraNear = camera.near;
        this.cameraFar = camera.far;
        this.rotationSpeed = 0.02;
        this.combined = false;

        this.numberOfObjects = 500;
    }

    redraw = () => {
        const toRemove = [];
        scene.traverse(e => {
            if (e instanceof THREE.Mesh) {
                toRemove.push(e);
            }
        });
        toRemove.forEach(e => { scene.remove(e) });
        // add a large number of cubes
        if (this.combined) {
            const geometryArray = [];
            for (let i = 0; i < this.numberOfObjects; i++) {
                const cubeMesh = this.addCube();
                // It recalculates the matrix to reflect any changes made to the object's transformation.
                cubeMesh.updateMatrix();
                geometryArray.push(cubeMesh.geometry);
            }
            // improve performance by combining multiple geometries into a single geometry.
            const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometryArray, true);
            // FIXME: why just show a single object?
            scene.add(new THREE.Mesh(mergedGeometry, cubeMaterial));
        } else {
            for (let i = 0; i < this.numberOfObjects; i++) {
                scene.add(this.addCube());
            }
        }
    }

    addCube = () => {
        const cubeSize = 1.0;
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube randomly in the scene
        cube.position.x = -60 + Math.round((Math.random() * 100));
        cube.position.y = Math.round((Math.random() * 10));
        cube.position.z = -150 + Math.round((Math.random() * 175));

        // add the cube to the scene
        return cube;
    };

    outputObjects = () => {
        console.log(scene.children);
    }

}

const renderer = initRenderer();

const camera = initPerspectiveCamera(new THREE.Vector3(0, 40, 50));

const scene = new THREE.Scene();

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const controls = new Controls();
const gui = new GUI();
gui.add(controls, 'numberOfObjects', 0, 20000);
gui.add(controls, 'combined').onChange(controls.redraw);
gui.add(controls, 'redraw');

const cubeMaterial = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
});

controls.redraw();

let step = 0;
function animate() {
    stats.update();
    step += 0.005;

    camera.position.x = Math.sin(step) * 50;
    camera.position.z = Math.cos(step) * 50;
    camera.lookAt(scene.position);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();