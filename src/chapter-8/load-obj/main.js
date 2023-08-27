import * as THREE from 'three';
import { BaseLoaderScene, initPerspectiveCamera } from "../../utils";
import butterflyM from '@assets/models/butterfly/butterfly.mtl?url';
import butterflyO from '@assets/models/butterfly/butterfly.obj?url';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

async function init() {
    const initPosition = new THREE.Vector3(50, 50, 50);
    const camera = initPerspectiveCamera(initPosition);
    camera.lookAt(new THREE.Vector3(0, 15, 0));

    const loaderScene = new BaseLoaderScene(camera);

    // ObjectLoader has done some limitation in metadata
    // so the house json file cannot be right parsed
    // const loader = new THREE.ObjectLoader();

    // MTL file defines the using material
    const mtfLoader = new MTLLoader();
    mtfLoader.load(
        // resource URL
        butterflyM,
        (material) => {
            material.preload();
            // OBJ file defines the using geometry
            const objLoader = new OBJLoader();
            objLoader.setMaterials(material);
            objLoader.load(
                butterflyO,
                (object) => {
                    // move wings to more horizontal position
                    [0, 2, 4, 6].forEach(function (i) {
                        object.children[i].rotation.z = 0.3 * Math.PI;
                    });

                    [1, 3, 5, 7].forEach(function (i) {
                        object.children[i].rotation.z = -0.3 * Math.PI;
                    });

                    // configure the wings,
                    let wing2 = object.children[5];
                    let wing1 = object.children[4];

                    wing1.material.opacity = 0.9;
                    wing1.material.transparent = true;
                    wing1.material.depthTest = false;
                    wing1.material.side = THREE.DoubleSide;

                    wing2.material.opacity = 0.9;
                    wing2.material.transparent = true;
                    wing2.material.depthTest = false;
                    wing2.material.side = THREE.DoubleSide;

                    object.scale.set(100, 100, 100);
                    object.rotation.x = 0.2;
                    object.rotation.y = -1.3;

                    loaderScene.render(object, camera);
                }
            )
        },

        // onProgress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
    );

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