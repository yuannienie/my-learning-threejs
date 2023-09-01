import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane } from '../../utils';
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

let mixer, clipAction;

const renderer = initRenderer();

const camera = initPerspectiveCamera();

const scene = new THREE.Scene();

initDefaultLight(scene);

addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();

createObject();

function createObject() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    // A Track of vector keyframe values.
    // VectorKeyframeTrack( name : String, times : Array, values : Array )
    // The first parameter name can specify the node either using its name or its uuid (although it needs to be in the subtree of the scene graph node passed into the mixer).
    // Or, if the track name starts with a dot, the track applies to the root node that was passed into the mixer.
    // Position
    const positionKF = new THREE.VectorKeyframeTrack('.position', [0, 1, 2], [0, 0, 0, 30, 0, 0, 0, 0, 0]);
    // Scale
    const scaleKF = new THREE.VectorKeyframeTrack('.scale', [0, 1, 2], [1, 1, 1, 2, 2, 2, 1, 1, 1]);
    // set up rotation about x axis
    const xAxis = new THREE.Vector3(1, 0, 0);
    // Quaternions are used in three.js to represent rotations.
    // Iterating through a Quaternion instance will yield its components (x, y, z, w) in the corresponding order.
    const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
    const quaternionKF = new THREE.QuaternionKeyframeTrack(".quaternion", [0, 1, 2], [qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w]);
    // Color
    const colorKF = new THREE.ColorKeyframeTrack(".material.color", [0, 1, 2], [1, 0, 0, 0, 1, 0, 0, 0, 1], THREE.InterpolateDiscrete);
    // Opacity
    const opacityKF = new THREE.NumberKeyframeTrack(".material.opacity", [0, 1, 2], [1, 0, 1]);
    // create an animation sequence with the tracks
    // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
    const clip = new THREE.AnimationClip("Action", 3, [scaleKF, positionKF, quaternionKF, colorKF, opacityKF]);
    mixer = new THREE.AnimationMixer(mesh);
    // create a ClipAction and set it to play
    const clipAction = mixer.clipAction(clip);
    clipAction.play();
}

const trackballControls = new TrackballControls(camera, renderer.domElement);
trackballControls.rotateSpeed = 1.0;
trackballControls.zoomSpeed = 1.2;
trackballControls.panSpeed = 0.8;
trackballControls.noZoom = false;
trackballControls.noPan = false;
trackballControls.staticMoving = true;
trackballControls.dynamicDampingFactor = 0.3;
trackballControls.keys = [65, 83, 68];

const clock = new THREE.Clock();
function animate() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);
    if (mixer) {
        mixer.update(delta);
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

animate();