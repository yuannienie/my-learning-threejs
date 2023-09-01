import * as THREE from 'three';
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, initDefaultLight, addLargeGroundPlane } from '../../utils';
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import horse from '@assets/models/horse/horse.glb?url';

class MixerControls {
    constructor() {
        this.time = 0;
        this.timeScale = 1;
        this.repetitions = Infinity;
        // wrap
        this.warpStartTimeScale = 1;
        this.warpEndTimeScale = 1;
        this.warpDurationInSeconds = 2;
        this.fadeDurationInSeconds = 2;
        this.effectiveWeight = 0;
        this.effectiveTimeScale = 0;
    }
    stopAllAction = () => {
        mixer.stopAllAction();
    }
    warp = () => {
        clipAction.warp(this.warpStartTimeScale, this.warpEndTimeScale, this.warpDurationInSeconds);
    }
    fadeIn = () => {
        clipAction.fadeIn(this.fadeDurationInSeconds);
    }
    fadeOut = () => {
        clipAction.fadeOut(this.fadeDurationInSeconds);
    }
}

let mixer, clipAction;

const renderer = initRenderer();

const camera = initPerspectiveCamera();

const scene = new THREE.Scene();

initDefaultLight(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();
const mixerControls = new MixerControls();
const mixerFolder = gui.addFolder("AnimationMixer")
mixerFolder.add(mixerControls, "time").listen()
mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) { mixer.timeScale = timeScale });
mixerFolder.add(mixerControls, "stopAllAction").listen()
const actionFolder = gui.addFolder("AnimationAction")
actionFolder.add(mixerControls, "repetitions", 0, 100).listen().onChange(function (e) {
    if (clipAction.loop == THREE.LoopOnce || clipAction.loop == THREE.LoopPingPong) {
        clipAction.reset();
        clipAction.repetitions = undefined
        clipAction.setLoop(parseInt(clipAction.loop), undefined);
    } else {
        clipAction.setLoop(parseInt(e), mixerControls.repetitions);
    }
});
actionFolder.add(mixerControls, "effectiveWeight", 0, 1, 0.01).listen()
actionFolder.add(mixerControls, "effectiveTimeScale", 0, 5, 0.01).listen()
actionFolder.add(mixerControls, "warpStartTimeScale", 0, 10, 0.01)
actionFolder.add(mixerControls, "warpEndTimeScale", 0, 10, 0.01)
actionFolder.add(mixerControls, "warpDurationInSeconds", 0, 10, 0.01)
actionFolder.add(mixerControls, "warp")
actionFolder.add(mixerControls, "fadeDurationInSeconds", 0, 10, 0.01)
actionFolder.add(mixerControls, "fadeIn")
actionFolder.add(mixerControls, "fadeOut")

createObject();

function createObject() {
    const loader = new GLTFLoader();
    loader.load(
        horse,
        (gltf) => {
            const mesh = gltf.scene.children[0];
            mesh.scale.set(0.1, 0.1, 0.1);
            // The AnimationMixer is a player for animations on a particular object in the scene.
            // When multiple objects in the scene are animated independently, one AnimationMixer may be used for each object.
            mixer = new THREE.AnimationMixer(mesh);
            const clip = gltf.animations[0];
            // Sets the 1s duration for a single loop of this action
            clipAction = mixer.clipAction(clip).setDuration(1).play();
            scene.add(mesh);
        }
    )
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
    const delta = clock.getDelta();
    stats.update();
    trackballControls.update(delta);
    if (mixer && clipAction) {
        mixer.update(delta);
        mixerControls.time = mixer.time.toFixed(2);
        mixerControls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
        mixerControls.effectiveWeight = clipAction.getEffectiveWeight();
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