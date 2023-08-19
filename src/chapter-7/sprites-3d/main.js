import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, createGhostTexture } from '../../utils';
import spriteSheet from '@assets/textures/particles/sprite-sheet.png';

const renderer = initRenderer();

const camera = initPerspectiveCamera(new THREE.Vector3(20, 0, 150));

const scene = new THREE.Scene();

// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const getTexture = () => new THREE.TextureLoader().load(spriteSheet);

let group;
function createSprites() {
    group = new THREE.Group();
    const range = 200;
    for (let i = 0; i < 400; i++) {
        group.add(createSprite(10, false, 0.6, 0xffffff, i % 5, range))
    }

    scene.add(group);
}

function createSprite(size, transparent, opacity, color, spriteIndex, range) {
    const spriteMaterial = new THREE.SpriteMaterial({
        opacity,
        color,
        transparent,
        map: getTexture(),
    });

    spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteIndex, 0);
    spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
    spriteMaterial.depthTest = false;
    spriteMaterial.blending = THREE.AdditiveBlending;

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size, size, size);
    sprite.position.set(
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
    )
    return sprite;
}

function animate() {
    stats.update();
    group.rotation.x += 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

createSprites();
animate();