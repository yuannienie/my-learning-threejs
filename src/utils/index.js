import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// add `?url` as a resource url to import obj file
import gopherObj from '@assets/models/gopher/gopher.obj?url'
import floorWood from '@assets/textures/general/floor-wood.jpg'

export const container = document.getElementById("webgl-container");

export function addAxesHelper(scene, helperSize = 50) {
  const axesHelper = new THREE.AxesHelper(helperSize);
  scene.add(axesHelper);
}

function createBoundingWall(scene) {
  const wallLeft = new THREE.BoxGeometry(70, 2, 2);
  const wallRight = new THREE.BoxGeometry(70, 2, 2);
  const wallTop = new THREE.BoxGeometry(2, 2, 50);
  const wallBottom = new THREE.BoxGeometry(2, 2, 50);

  const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xa0552d });

  const wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial);
  const wallRightMesh = new THREE.Mesh(wallRight, wallMaterial);
  const wallTopMesh = new THREE.Mesh(wallTop, wallMaterial);
  const wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial);

  wallLeftMesh.position.set(15, 1, -25);
  wallRightMesh.position.set(15, 1, 25);
  wallTopMesh.position.set(-19, 1, 0);
  wallBottomMesh.position.set(49, 1, 0);

  scene.add(wallLeftMesh);
  scene.add(wallRightMesh);
  scene.add(wallTopMesh);
  scene.add(wallBottomMesh);
}

export function createGroundPlane(scene) {
  const planeGeometry = new THREE.PlaneGeometry(70, 50);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x9acd32 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;

  plane.receiveShadow = true;

  scene.add(plane);
  return plane;
}

function createHouse(scene) {
  const roof = new THREE.ConeGeometry(5, 4); // 圆锥体
  const base = new THREE.CylinderGeometry(5, 5, 6); // 圆柱体

  // create the mesh
  const roofMesh = new THREE.Mesh(
    roof,
    new THREE.MeshPhongMaterial({ color: 0x8b7213 })
  );
  const baseMesh = new THREE.Mesh(
    base,
    new THREE.MeshPhongMaterial({ color: 0xffe4c4 })
  );

  roofMesh.position.set(25, 8, 0);
  baseMesh.position.set(25, 3, 0);

  roofMesh.receiveShadow = true;
  baseMesh.receiveShadow = true;
  roofMesh.castShadow = true;
  baseMesh.castShadow = true;

  scene.add(roofMesh);
  scene.add(baseMesh);
}

function createTree(scene) {
  const trunk = new THREE.BoxGeometry(1, 8, 1);
  const leaves = new THREE.SphereGeometry(4);

  // create the mesh
  const trunkMesh = new THREE.Mesh(
    trunk,
    new THREE.MeshPhongMaterial({ color: 0x8b4513 })
  );
  const leavesMesh = new THREE.Mesh(
    leaves,
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  );

  // position the trunk. Set y to half of height of trunk
  trunkMesh.position.set(-10, 4, 0);
  leavesMesh.position.set(-10, 12, 0);

  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  leavesMesh.castShadow = true;
  leavesMesh.receiveShadow = true;

  scene.add(trunkMesh);
  scene.add(leavesMesh);
}

export function addHouseAndTree(scene) {
  createBoundingWall(scene);
  createGroundPlane(scene);
  createHouse(scene);
  createTree(scene);
}

export function initRenderer(properties) {
  const props =
    typeof properties !== "undefined" && properties ? properties : {};
  const renderer = new THREE.WebGLRenderer(props);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  return renderer;
}

export function initPerspectiveCamera(
  initialPosition,
  lookAtPosition = new THREE.Vector3(0, 0, 0),
  { fov = 45, near = 0.1, far = 1000 } = {}
) {
  const position =
    initialPosition !== undefined
      ? initialPosition
      : new THREE.Vector3(-30, 40, 30);
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.copy(position);
  camera.lookAt(lookAtPosition);

  return camera;
}

export function addDefaultCubeAndSphere(scene) {
  // create a cube
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;

  // position the cube
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;

  // add the cube to the scene
  scene.add(cube);

  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.x = 20;
  sphere.position.y = 0;
  sphere.position.z = 2;
  sphere.castShadow = true;

  // add the sphere to the scene
  scene.add(sphere);

  return { cube, sphere };
}

export function loadGopher(material) {
  const loader = new OBJLoader();
  let mesh = null;
  const p = new Promise((resolve) => {
    loader.load(gopherObj, (loadedMesh) => {
      // this is a group of meshes, so iterate until we reach a THREE.Mesh
      mesh = loadedMesh;
      if (material) {
        // material is defined, so overwrite the default material.
        computeNormalsGroup(mesh);
        setMaterialGroup(material, mesh);
      }
      resolve(mesh);
    });
  });

  return p;
}

/**
 * Add a folder to the gui containing the basic material properties.
 *
 * @param gui the gui to add to
 * @param controls the current controls object
 * @param material the material to control
 * @param geometry the geometry we're working with
 * @param name optionally the name to assign to the folder
 */
export function addBasicMaterialSettings(gui, controls, material, name) {
  var folderName = name !== undefined ? name : "THREE.Material";

  controls.material = material;

  var folder = gui.addFolder(folderName);
  folder.add(controls.material, "id");
  folder.add(controls.material, "uuid");
  folder.add(controls.material, "name");
  folder.add(controls.material, "opacity", 0, 1, 0.01);
  // Defines whether this material is transparent. This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects.
  folder.add(controls.material, "transparent");
  folder.add(controls.material, "visible");
  folder
    .add(controls.material, "side", { FrontSide: 0, BackSide: 1, BothSides: 2 })
    .onChange(side => {
      controls.material.side = parseInt(side);
    });
  // Whether to render the material's color. This can be used in conjunction with a mesh's renderOrder property to create invisible objects that occlude other objects. Default is true. 
  folder.add(controls.material, "colorWrite");
  folder.add(controls.material, "premultipliedAlpha");
  // Whether to apply dithering to the color to remove the appearance of banding. Default is false.
  folder.add(controls.material, "dithering");
  folder.add(controls.material, "shadowSide", {
    FrontSide: 0,
    BackSide: 1,
    BothSides: 2,
  });
  // Defines whether vertex coloring is used. 
  // Default is false. The engine supports RGB and RGBA vertex colors depending on whether a three (RGB) or four (RGBA) component color buffer attribute is used.
  folder
    .add(controls.material, "vertexColors")
    .onChange(vertexColors => {
      material.vertexColors = vertexColors;
    });
  folder.add(controls.material, "fog");

  return folder;
}

export function addSpecificMaterialSettings(gui, controls, material, name) {
  controls.material = material;

  var folderName = name !== undefined ? name : "THREE." + material.type;
  var folder = gui.addFolder(folderName);
  switch (material.type) {
    case "MeshNormalMaterial":
      folder.add(controls.material, "wireframe");
      return folder;

    case "MeshPhongMaterial":
      controls.specular = material.specular.getStyle();
      folder.addColor(controls, "specular").onChange(function (e) {
        material.specular.setStyle(e);
      });
      folder.add(material, "shininess", 0, 100, 0.01);
      return folder;

    case "MeshStandardMaterial":
      controls.color = material.color.getStyle();
      folder.addColor(controls, "color").onChange(function (e) {
        material.color.setStyle(e);
      });
      controls.emissive = material.emissive.getStyle();
      folder.addColor(controls, "emissive").onChange(function (e) {
        material.emissive.setStyle(e);
      });
      folder.add(material, "metalness", 0, 1, 0.01);
      folder.add(material, "roughness", 0, 1, 0.01);
      folder.add(material, "wireframe");

      return folder;
  }
}

export function addArrowHelper(mesh, arrowLength = 2, arrowColor = 0x3333FF) {
  const { geometry } = mesh;
  const positionAttribute = geometry.getAttribute('position');
  const normalAttribute = geometry.getAttribute('normal');

  for (let i = 0; i < positionAttribute.count; i++) {
    const position = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
    const normal = new THREE.Vector3().fromBufferAttribute(normalAttribute, i);
    const arrow = new THREE.ArrowHelper(normal, position, arrowLength, arrowColor, 0.5, 0.5);
    mesh.add(arrow);
  }
}

function setMaterialGroup(material, group) {
  if (group instanceof THREE.Mesh) {
    group.material = material;
  } else if (group instanceof THREE.Group) {
    group.children.forEach(function (child) { setMaterialGroup(material, child) });
  }
}

function computeNormalsGroup(group) {
  if (group instanceof THREE.Mesh) {
    const { geometry } = group;

    // geometry.computeFaceNormals();
    // geometry.mergeVertices();
    geometry.computeVertexNormals();

    geometry.normalsNeedUpdate = true;


  } else if (group instanceof THREE.Group) {
    group.children.forEach(function (child) { computeNormalsGroup(child) });
  }
}

export function addLargeGroundPlane(scene, useTexture) {
  const withTexture = !!useTexture ? useTexture : false;
  const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });

  if (withTexture) {
    planeMaterial.map = new THREE.TextureLoader().load(floorWood);
    planeMaterial.map.wrapS = THREE.RepeatWrapping;
    planeMaterial.map.wrapT = THREE.RepeatWrapping;
    planeMaterial.map.repeat.set(80, 80);
  }

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);
  scene.add(plane);

  return plane;
}

export function addMeshSelection(gui, controls, material, scene) {
  var sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
  var cubeGeometry = new THREE.BoxGeometry(16, 16, 15);
  var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

  var sphere = new THREE.Mesh(sphereGeometry, material);
  var cube = new THREE.Mesh(cubeGeometry, material);
  var plane = new THREE.Mesh(planeGeometry, material);

  sphere.position.x = 0;
  sphere.position.y = 11;
  sphere.position.z = 2;

  cube.position.y = 8;

  controls.selectedMesh = "cube";
  loadGopher(material).then(function (gopher) {

    gopher.scale.x = 5;
    gopher.scale.y = 5;
    gopher.scale.z = 5;
    gopher.position.z = 0
    gopher.position.x = -10
    gopher.position.y = 0

    gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane", "gopher"]).onChange(function (e) {

      scene.remove(controls.selected);

      switch (e) {
        case "cube":
          scene.add(cube);
          controls.selected = cube;
          break;
        case "sphere":
          scene.add(sphere);
          controls.selected = sphere;
          break;
        case "plane":
          scene.add(plane);
          controls.selected = plane;
          break;
        case "gopher":
          scene.add(gopher);
          controls.selected = gopher;
          break;
      }
    });
  });

  controls.selected = cube;
  scene.add(controls.selected);
}