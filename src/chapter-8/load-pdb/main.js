import * as THREE from 'three';
import { BaseLoaderScene, initPerspectiveCamera } from "../../utils";
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';
import diamond from '@assets/models/molecules/diamond.pdb?url';

async function init() {
    const initPosition = new THREE.Vector3(10, 10, 10);
    const camera = initPerspectiveCamera(initPosition);
    const loaderScene = new BaseLoaderScene(camera);
    // PDB files can describe some object model like molecular
    const loader = new PDBLoader();
    loader.load(
        diamond,
        (pdb) => {
            const group = new THREE.Group();
            const { geometryAtoms, geometryBonds, json } = pdb;
            // create atoms
            for (let i = 0; i < geometryAtoms.attributes.position.count; i++) {
                const startPosition = new THREE.Vector3();
                startPosition.x = geometryAtoms.attributes.position.getX(i);
                startPosition.y = geometryAtoms.attributes.position.getY(i);
                startPosition.z = geometryAtoms.attributes.position.getZ(i);

                const color = new THREE.Color();
                color.r = geometryAtoms.attributes.color.getX(i);
                color.g = geometryAtoms.attributes.color.getY(i);
                color.b = geometryAtoms.attributes.color.getZ(i);

                const material = new THREE.MeshPhongMaterial({ color });

                const sphere = new THREE.SphereGeometry(0.2);
                const mesh = new THREE.Mesh(sphere, material);
                mesh.position.copy(startPosition);
                group.add(mesh);
            }

            // create the binds
            for (let j = 0; j < geometryBonds.attributes.position.count; j += 2) {
                const startPosition = new THREE.Vector3();
                startPosition.x = geometryBonds.attributes.position.getX(j);
                startPosition.y = geometryBonds.attributes.position.getY(j);
                startPosition.z = geometryBonds.attributes.position.getZ(j);

                const endPosition = new THREE.Vector3();
                endPosition.x = geometryBonds.attributes.position.getX(j + 1);
                endPosition.y = geometryBonds.attributes.position.getY(j + 1);
                endPosition.z = geometryBonds.attributes.position.getZ(j + 1);

                // use the start and end to create a curve, and use the curve to draw
                // a tube, which connects the atoms
                const path = new THREE.CatmullRomCurve3([startPosition, endPosition]);
                const tube = new THREE.TubeGeometry(path, 1, 0.04);
                const material = new THREE.MeshPhongMaterial({
                    color: 0xcccccc
                });
                const mesh = new THREE.Mesh(tube, material);
                group.add(mesh);
            }

            loaderScene.render(group, camera);
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