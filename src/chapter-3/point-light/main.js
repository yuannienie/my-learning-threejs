import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initCamera, addHouseAndTree, container, addAxesHelper } from '../utils';

class Controls {
    constructor(ambientLight) {
        this.rotationSpeed = 0.01;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambientLight.color.getStyle();;
        this.pointColor = pointLight.color.getStyle();;
        this.intensity = 1;
        this.distance = pointLight.distance;
    };
};

let trackBallControls, camera, renderer;

const scene = new THREE.Scene();

camera = initCamera();

renderer = initRenderer();

addAxesHelper(scene);

const ambientLight = new THREE.AmbientLight('#0c0c0c', 1);
scene.add(ambientLight);

const pointLight = new THREE.SpotLight('#ccffcc');
pointLight.castShadow = true;
pointLight.decay = 0.1;
scene.add(pointLight);

const helper = new THREE.PointLightHelper(pointLight);
const shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);

// scene.add(helper);
scene.add(shadowHelper);

const sphereLight = new THREE.SphereGeometry(0.2);
const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
sphereLightMesh.position.copy(new THREE.Vector3(3, 0, 5));
scene.add(sphereLightMesh);

addHouseAndTree(scene);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

// add gui
const gui = new GUI();
const controls = new Controls(ambientLight);
gui.addColor(controls, 'ambientColor').onChange(function (e) {
    ambientLight.color = new THREE.Color(e);
});

gui.addColor(controls, 'pointColor').onChange(function (e) {
    pointLight.color = new THREE.Color(e);
});

gui.add(controls, 'distance', 0, 100).onChange(function (e) {
    pointLight.distance = e;
});

gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
    pointLight.intensity = e;
});

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

let phase = 0, invert = 1;
function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());

    // helper.update();
    shadowHelper.update();
    // move the light simulation
    if (phase > 2 * Math.PI) {
        invert = invert * -1;
        phase -= 2 * Math.PI;
    } else {
        phase += controls.rotationSpeed;
    }
    sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
    sphereLightMesh.position.y = 5;
    sphereLightMesh.position.z = +(25 * (Math.sin(phase)));

    if (invert < 0) {
        const pivot = 14;
        sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
    }

    pointLight.position.copy(sphereLightMesh.position);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

