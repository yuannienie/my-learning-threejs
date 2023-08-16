import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, createGhostTexture } from '../../utils';

const renderer = initRenderer();

const camera = initPerspectiveCamera(new THREE.Vector3(20, 0, 150));

const scene = new THREE.Scene();

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

function createSprites() {
    const spriteGroup = new THREE.Group();
    const material = new THREE.SpriteMaterial({
        color: 0xffffff,
        map: createGhostTexture(),
    });
    const range = 500;
    for (let i = 0; i < 1500; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.position.set(
            Math.random() * range - range / 2,
            Math.random() * range - range / 2,
            Math.random() * range - range / 2
        );
        sprite.scale.set(4, 4, 4);
        spriteGroup.add(sprite);
    }
    scene.add(spriteGroup);
}

const trackballControls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
function animate() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

createSprites();
animate();