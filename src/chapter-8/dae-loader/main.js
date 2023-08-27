import * as THREE from 'three';
import { BaseLoaderScene, initPerspectiveCamera } from "../../utils";
import building from '@assets/models/medieval/Medieval_building.DAE?url';
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";

async function init() {
    const initPosition = new THREE.Vector3(35, 35, 35);
    const camera = initPerspectiveCamera(initPosition);
    camera.lookAt(new THREE.Vector3(0, 45, 0));

    const loaderScene = new BaseLoaderScene(camera);
    loaderScene.render(new THREE.AxesHelper(), camera);
    // a loader to load or parse .dae files
    const loader = new ColladaLoader();
    loader.load(
        building,
        (result) => {
            const meshGroup = new THREE.Group();
            const { scene } = result;
            // add all mesh instance into our own group
            scene.children.forEach(e => {
                if (e instanceof THREE.Mesh) {
                    e.castShadow = true;
                    e.receiveShadow = true;
                    meshGroup.add(e);
                } else {
                    scene.remove(e);
                }
            })
            meshGroup.position.y -= 10;
            meshGroup.rotation.x = -0.5 * Math.PI;
            meshGroup.scale.set(6, 6, 6);
            loaderScene.render(meshGroup, camera);
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