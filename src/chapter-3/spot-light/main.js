import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initCamera, addDefaultCubeAndSphere, container, addAxesHelper, createGroundPlane } from '../utils';

class Controls {
    constructor() {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambientLight.color.getStyle();
        this.pointColor = spotLight.color.getStyle();
        this.intensity = 1;
        this.distance = 0;
        this.angle = 0.1;
        this.shadowDebug = false;
        this.castShadow = true;
        this.target = "Plane";
        this.stopMovingLight = false;
        this.penumbra = 0;
    };
};

let trackBallControls, camera, renderer, plane;

const scene = new THREE.Scene();

camera = initCamera();

renderer = initRenderer();

plane = createGroundPlane(scene);

// addAxesHelper(scene);

const { cube, sphere } = addDefaultCubeAndSphere(scene);

const ambientLight = new THREE.AmbientLight('#1c1c1c', 1);
scene.add(ambientLight);

// add target and light
const target = new THREE.Object3D();
target.position.copy(new THREE.Vector3(5, 0, 0));
const spotLight = new THREE.SpotLight("#ffffff", 1, 0, 0.4);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 100;
spotLight.shadow.camera.fov = 120;
spotLight.target = plane;
scene.add(spotLight);

const debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);

const pp = new THREE.SpotLightHelper(spotLight)
scene.add(pp)

// add a small sphere simulating the pointlight
const sphereLight = new THREE.SphereGeometry(0.2);
const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
sphereLightMesh.castShadow = true;

sphereLightMesh.position.copy(new THREE.Vector3(3, 20, 3));
scene.add(sphereLightMesh);


// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

// add gui
const gui = new GUI();
const controls = new Controls();
gui.addColor(controls, 'ambientColor').onChange(function (e) {
    ambientLight.color = new THREE.Color(e);
});

gui.addColor(controls, 'pointColor').onChange(function (e) {
    spotLight.color = new THREE.Color(e);
});

gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
    spotLight.angle = e;
});

gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
    spotLight.intensity = e;
});

gui.add(controls, 'penumbra', 0, 1).onChange(function (e) {
    spotLight.penumbra = e;
});

gui.add(controls, 'distance', 0, 200).onChange(function (e) {
    spotLight.distance = e;
});

gui.add(controls, 'shadowDebug').onChange(function (e) {
    e ? scene.add(debugCamera) : scene.remove(debugCamera);
});

gui.add(controls, 'castShadow').onChange(function (e) {
    spotLight.castShadow = e;
});

gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
    switch (e) {
        case "Plane":
            spotLight.target = plane;
            break;
        case "Sphere":
            spotLight.target = sphere;
            break;
        case "Cube":
            spotLight.target = cube;
            break;
    }

});

gui.add(controls, 'stopMovingLight').onChange(function (e) {
    stopMovingLight = e;
});

const clock = new THREE.Clock();
trackBallControls = new OrbitControls(camera, renderer.domElement);

let step = 0, invert = 1, phase = 0;
function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());

    // rotate the cube around its axes
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    // bounce the sphere up and down
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    // move the light simulation
    if (!controls.stopMovingLight) {
        if (phase > 2 * Math.PI) {
            invert *= -1;
            phase -= 2 * Math.PI;
        } else {
            phase += controls.rotationSpeed;
        }

        sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
        sphereLightMesh.position.y = 15;
        sphereLightMesh.position.z = +(7 * (Math.sin(phase)));

        if (invert < 0) {
            var pivot = 14;
            sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
        }

        // spotlight track the sphere position
        spotLight.position.copy(sphereLightMesh.position);
    }


    pp.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

