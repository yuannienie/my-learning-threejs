import * as THREE from 'three';
import { addBasicMaterialSettings, addSpecificMaterialSettings } from '../utils';

export const addGeometry = ({ geom, name, gui, controls, material, texture }) => {
    let mat = !material ?
        new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.2,
            roughness: 0.07,
        }) : material;

    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;

    addBasicMaterialSettings(gui, controls, mat, name + "-Material");
    addSpecificMaterialSettings(gui, controls, mat, name + "-StandardMaterial");

    return mesh;
};