import * as THREE from 'three';
import { BaseLoaderScene, createGhostTexture, initPerspectiveCamera } from "../../utils";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import carCloud from '@assets/models/carcloud/carcloud.ply?url';

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
    const loaderScene = new BaseLoaderScene(camera);
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