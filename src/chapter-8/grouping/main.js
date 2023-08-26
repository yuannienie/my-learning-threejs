import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane } from '../../utils';

class Controls {
    constructor() {
        this.cubePosX = 0;
        this.cubePosY = 3;
        this.cubePosZ = 10;

        this.spherePosX = 10;
        this.spherePosY = 5;
        this.spherePosZ = 0;

        this.groupPosX = 10;
        this.groupPosY = 5;
        this.groupPosZ = 0;

        this.grouping = false;
        this.rotate = false;

        this.groupScale = 1;
        this.cubeScale = 1;
        this.sphereScale = 1;
    }

    redraw = () => {
        // remove the old plane
        scene.remove(group);

        // create a new one
        sphere = createMesh(new THREE.SphereGeometry(5, 20, 20));
        cube = createMesh(new THREE.BoxGeometry(6, 6, 6));

        sphere.position.set(this.spherePosX, this.spherePosY, this.spherePosZ);
        sphere.scale.set(this.sphereScale, this.sphereScale, this.sphereScale);
        cube.position.set(this.cubePosX, this.cubePosY, this.cubePosZ);
        cube.scale.set(this.cubeScale, this.cubeScale, this.cubeScale);

        // also create a group, only used for rotating
        group = new THREE.Group();
        group.position.set(this.groupPosX, this.groupPosY, this.groupPosZ);
        group.scale.set(this.groupScale, this.groupScale, this.groupScale);
        group.add(sphere);
        group.add(cube);

        scene.add(group);
        this.positionBoundingBox();

        if (arrow) scene.remove(arrow);
        arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), group.position, 10, 0x0000ff);
        scene.add(arrow);
    }

    positionBoundingBox = () => {
        // add the boundingbox to see group, ignore this implements
    }

}

const renderer = initRenderer();

const camera = initPerspectiveCamera(new THREE.Vector3(30, 30, 30));

const scene = new THREE.Scene();
initDefaultLight(scene);

const groundPlane = addLargeGroundPlane(scene);

let sphere;
let cube;
let group;
let bboxMesh;
let arrow;

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const trackballControls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();

const controls = new Controls();
const gui = new GUI();
const sphereFolder = gui.addFolder("sphere");
sphereFolder.add(controls, "spherePosX", -20, 20).onChange(function (e) {
    sphere.position.x = e;
    controls.positionBoundingBox()
    controls.redraw();
});
sphereFolder.add(controls, "spherePosZ", -20, 20).onChange(function (e) {
    sphere.position.z = e;
    controls.positionBoundingBox();
    controls.redraw();
});
sphereFolder.add(controls, "spherePosY", -20, 20).onChange(function (e) {
    sphere.position.y = e;
    controls.positionBoundingBox();
    controls.redraw();
});
sphereFolder.add(controls, "sphereScale", 0, 3).onChange(function (e) {
    sphere.scale.set(e, e, e);
    controls.positionBoundingBox();
    controls.redraw();
});

const cubeFolder = gui.addFolder("cube");
cubeFolder.add(controls, "cubePosX", -20, 20).onChange(function (e) {
    cube.position.x = e;
    controls.positionBoundingBox();
    controls.redraw();
});
cubeFolder.add(controls, "cubePosZ", -20, 20).onChange(function (e) {
    cube.position.z = e;
    controls.positionBoundingBox();
    controls.redraw();
});
cubeFolder.add(controls, "cubePosY", -20, 20).onChange(function (e) {
    cube.position.y = e;
    controls.positionBoundingBox();
    controls.redraw();
});
cubeFolder.add(controls, "cubeScale", 0, 3).onChange(function (e) {
    cube.scale.set(e, e, e);
    controls.positionBoundingBox();
    controls.redraw();
});

const groupFolder = gui.addFolder("group");
groupFolder.add(controls, "groupPosX", -20, 20).onChange(function (e) {
    group.position.x = e;
    controls.positionBoundingBox();
    controls.redraw();
});
groupFolder.add(controls, "groupPosZ", -20, 20).onChange(function (e) {
    group.position.z = e;
    controls.positionBoundingBox();
    controls.redraw();
});
groupFolder.add(controls, "groupPosY", -20, 20).onChange(function (e) {
    group.position.y = e;
    controls.positionBoundingBox();
    controls.redraw();
});
groupFolder.add(controls, "groupScale", 0, 3).onChange(function (e) {
    group.scale.set(e, e, e);
    controls.positionBoundingBox();
    controls.redraw();
});

gui.add(controls, "grouping");
gui.add(controls, "rotate");

function createMesh(geom) {
    const meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;

    return new THREE.Mesh(geom, meshMaterial);
}

controls.redraw();

let step = 0;
function animate() {
    stats.update();
    step += 0.03;
    // rotate as a group
    if (controls.grouping && controls.rotate) {
        group.rotation.y = step;
    }

    // rotate its own
    if (!controls.grouping && controls.rotate) {
        sphere.rotation.y = step;
        cube.rotation.y = step;
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();