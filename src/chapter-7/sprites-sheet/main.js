import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, createGhostTexture } from '../../utils';
import spriteSheet from '@assets/textures/particles/sprite-sheet.png';

class Controls {
    constructor() {
        this.size = 150;
        this.sprite = 0;
        this.transparent = true;
        this.opacity = 0.6;
        this.color = 0xffffff;
        this.rotateSystem = true;
    }

    redraw = () => {
        sceneOrtho.traverse(child => {
            if (child instanceof THREE.Sprite) sceneOrtho.remove(child);
        })
        createSprite(this.size, this.transparent, this.opacity, this.color, this.sprite);
    }
}

const renderer = initRenderer();

const camera = initPerspectiveCamera(new THREE.Vector3(0, 0, 50));
const cameraOrtho = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, 10);

const scene = new THREE.Scene();
const sceneOrtho = new THREE.Scene();

// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);

const material = new THREE.MeshNormalMaterial();
const geom = new THREE.SphereGeometry(15, 50, 50);
const mesh = new THREE.Mesh(geom, material);
scene.add(mesh);

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const getTexture = () => new THREE.TextureLoader().load(spriteSheet);

function createSprite(size, transparent, opacity, color, spriteIndex) {
    const spriteMaterial = new THREE.SpriteMaterial({
        opacity,
        color,
        transparent,
        map: getTexture(),
    });

    // we have 1 row, with five sprites
    spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteIndex, 0);
    spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
    spriteMaterial.blending = THREE.AdditiveBlending;
    // make sure the object is always rendered at the front
    // here can also be implemented by clearDepth before second render
    spriteMaterial.depthTest = false;

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size, size, size);
    sprite.position.set(100, 50, -10);
    sprite.velocityX = 5;

    sceneOrtho.add(sprite);
}

// delete the code below to fix the view problems
// Orbit controls allow the camera to orbit around a target.
// const trackballControls = new OrbitControls(camera, renderer.domElement);

const controls = new Controls();
const gui = new GUI();
gui.add(controls, 'sprite', 0, 4).step(1).onChange(controls.redraw);
gui.add(controls, 'size', 0, 120).onChange(controls.redraw);
gui.add(controls, 'transparent').onChange(controls.redraw);
gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
gui.addColor(controls, 'color').onChange(controls.redraw);

controls.redraw();

let step = 0;
function animate() {
    stats.update();
    step += 0.01;
    camera.position.y = Math.sin(step) * 20;
    sceneOrtho.traverse(e => {
        if (e instanceof THREE.Sprite) {
            // move the sprite along the bottom
            e.position.x += e.velocityX;
            if (e.position.x > window.innerWidth) {
                e.velocityX = -5;
                controls.sprite += 1;
                e.material.map.offset.set(1 / 5 * (controls.sprite % 4), 0);
            }
            if (e.position.x < 0) {
                e.velocityX = 5;
            }
        }
    });
    requestAnimationFrame(animate);
    renderer.autoClear = true;
    renderer.render(scene, camera);
    // Defines whether the renderer should automatically clear its output before rendering a frame.
    // prevent canvas from being erased with next .render call
    renderer.autoClear = false;
    // renderer.clearDepth();
    renderer.render(sceneOrtho, cameraOrtho);
}

animate();