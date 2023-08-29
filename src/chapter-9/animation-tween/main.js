import * as THREE from 'three';
import { BaseLoaderScene, createGhostTexture, initPerspectiveCamera } from "../../utils";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import carCloud from '@assets/models/carcloud/carcloud.ply?url';
import * as TWEEN from '@tweenjs/tween.js'

function generateSprite() {
    // using canvas to generate the map for sprite
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');

    // draw the sprites
    // The createRadialGradient() method is specified by six parameters, three defining the gradient's start circle, and three defining the end circle.
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // create the texture
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

async function init() {
    const initPosition = new THREE.Vector3(30, 30, 30);
    const camera = initPerspectiveCamera(initPosition);
    const posSrc = { pos: 1 };
    // create the tween animation
    const tween = new TWEEN.Tween(posSrc).to({ pos: 0 }, 2000);
    tween.easing(TWEEN.Easing.Bounce.InOut);
    const tweenBack = new TWEEN.Tween(posSrc).to({ pos: 1 }, 2000);
    tweenBack.easing(TWEEN.Easing.Bounce.InOut);

    // chain each other for infinite loop
    tweenBack.chain(tween);
    tween.chain(tweenBack);

    // Start the tween immediately.
    tween.start();

    const updateMesh = (mesh) => {
        TWEEN.update();

        const positionArray = mesh.geometry.attributes['position'];
        const originPosition = mesh.geometry.originPosition;

        for (let i = 0; i < positionArray.count; i++) {
            const oldPosX = originPosition.getX(i);
            const oldPosY = originPosition.getY(i);
            const oldPosZ = originPosition.getZ(i);
            positionArray.setX(i, oldPosX * posSrc.pos);
            positionArray.setY(i, oldPosY * posSrc.pos);
            positionArray.setZ(i, oldPosZ * posSrc.pos);
        }

        positionArray.needsUpdate = true;

    };
    const loaderScene = new BaseLoaderScene(camera, updateMesh, false, false);
    // create a particle system from PLY files 
    const loader = new PLYLoader();
    loader.load(
        carCloud,
        (geometry) => {
            const material = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 1,
                opacity: 0.6,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                // map: createGhostTexture(),
                map: generateSprite(),
            })

            // copy the original position, so we can referene that when tweening
            geometry.originPosition = geometry.attributes['position'].clone()

            const points = new THREE.Points(geometry, material);
            points.scale.set(3, 3, 3);

            loaderScene.render(points, camera);
        }
    )

    window.addEventListener(
        "resize",
        () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            loaderScene.renderer.setSize(window.innerWidth, window.innerHeight);
        },
        false
    );
}

init();