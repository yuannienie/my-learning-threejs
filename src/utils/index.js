import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// add `?url` as a resource url to import obj file
import gopherObj from '@assets/models/gopher/gopher.obj?url'
import floorWood from '@assets/textures/general/floor-wood.jpg'
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

export const container = document.getElementById("webgl-container");

export function addAxesHelper(scene, helperSize = 50) {
  const axesHelper = new THREE.AxesHelper(helperSize);
  axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff);
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

export function initRenderer(...props) {
  const renderer = new THREE.WebGLRenderer(...props);
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
  initialPosition = new THREE.Vector3(-30, 40, 30),
  lookAtPosition = new THREE.Vector3(0, 0, 0),
  { fov = 45, near = 0.1, far = 1000 } = {}
) {
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.copy(initialPosition);
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
  // folder.add(controls.material, "fog");

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

export function initDefaultLight(scene, initialPosition = new THREE.Vector3(-10, 30, 40)) {
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.copy(initialPosition);
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.fov = 15;
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.05;
  spotLight.name = "spotLight"

  scene.add(spotLight);

  const ambientLight = new THREE.AmbientLight(0x343434);
  ambientLight.name = "ambientLight";
  scene.add(ambientLight);
}

export const applyMeshNormalMaterial = (geometry, material) => {
  if (!material || material.type !== "MeshNormalMaterial") {
    material = new THREE.MeshNormalMaterial();
    material.side = THREE.DoubleSide;
  }

  return new THREE.Mesh(geometry, material)
}

export const applyMeshStandardMaterial = (geometry, material) => {
  if (!material || material.type !== "MeshStandardMaterial") {
    var material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    material.side = THREE.DoubleSide;
  }

  return new THREE.Mesh(geometry, material)
}

export function redrawGeometryAndUpdateUI(gui, scene, controls, geometry) {
  guiRemoveFolder(gui, controls.specificMaterialFolder);
  guiRemoveFolder(gui, controls.currentMaterialFolder);
  if (controls.mesh) scene.remove(controls.mesh)
  const appliedMaterialFn = controls.appliedMaterial;
  if (controls.mesh) {
    controls.mesh = appliedMaterialFn(geometry(), controls.mesh.material);
  } else {
    controls.mesh = appliedMaterialFn(geometry());
  }

  controls.mesh.castShadow = controls.castShadow;
  scene.add(controls.mesh)
  controls.currentMaterialFolder = addBasicMaterialSettings(gui, controls, controls.mesh.material);
  controls.specificMaterialFolder = addSpecificMaterialSettings(gui, controls, controls.mesh.material);
}

/**
 * Remove a folder from the dat.gui
 * 
 * @param {*} gui 
 * @param {*} folder 
 */
function guiRemoveFolder(gui, folder) {
  const title = folder?._title;
  if (title) {
    for (let i = 0; i < gui.folders.length; i++) {
      const f = gui.folders[i];
      if (f?._title === title) {
        f.domElement.parentNode.removeChild(f.domElement);
        delete gui.folders[i];
      }
    }
  }
}

export function createGhostTexture() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'ghost-sprite');
  canvas.width = 32;
  canvas.height = 32;

  const ctx = canvas.getContext('2d');
  // the body
  ctx.translate(-81, -84);

  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(83, 116);
  ctx.lineTo(83, 102);
  // The CanvasRenderingContext2D.bezierCurveTo() method of the Canvas 2D API adds a cubic Bézier curve to the current sub-path. 
  // It requires three points: the first two are control points and the third one is the end point. 
  // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
  ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
  ctx.lineTo(111, 116);
  ctx.lineTo(106.333, 111.333);
  ctx.lineTo(101.666, 116);
  ctx.lineTo(97, 111.333);
  ctx.lineTo(92.333, 116);
  ctx.lineTo(87.666, 111.333);
  ctx.lineTo(83, 116);
  ctx.fill();

  // the eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(91, 96);
  ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
  ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
  ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
  ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
  ctx.moveTo(103, 96);
  ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
  ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
  ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
  ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
  ctx.fill();

  // the pupils
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// optionalTarget will be finnaly returned, so it is required
export const plane = (u, v, optionalTarget) => {
  const result = optionalTarget || new THREE.Vector3();
  const x = u * 40;
  const y = 0;
  const z = v * 50;

  return result.set(x, y, z);
}

export const klein = (u, v, optionalTarget) => {

  const result = optionalTarget || new THREE.Vector3();

  u *= Math.PI;
  v *= 2 * Math.PI;

  u = u * 2;
  var x, y, z;
  if (u < Math.PI) {
    x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
    z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
  } else {
    x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
    z = -8 * Math.sin(u);
  }

  y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

  return result.set(x, y, z);
};

export const radialWave = (u, v, optionalTarget) => {

  var result = optionalTarget || new THREE.Vector3();
  var r = 50;

  var x = Math.sin(u) * r;
  var z = Math.sin(v / 2) * 2 * r;
  var y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

  return result.set(x, y, z);
};

/**
 * Simple base class, which setups a simple scene which is used to 
 * demonstrate the different loaders. This create a scene, three
 * lights, and slowly rotates the model, around the z-axis
 */
export class BaseLoaderScene {
  constructor(camera, updateMesh, shouldAddLights = true, shouldRotate = true) {
    this.camera = camera;
    this.withLights = shouldAddLights;
    this.shouldRotate = shouldRotate;
    this.updateMesh = updateMesh;
    // setup some default elements
    this.scene = new THREE.Scene();
    this.stats = new Stats();
    this.clock = new THREE.Clock();
    // initialize basic renderer
    this.renderer = initRenderer({ antialias: true });
    this.trackballControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * Start the render loop of the provided object
   * 
   * @param {Three.Object3D} mesh render this mesh or object
   * @param {*} camera render using the provided camera settings
   */
  render = (mesh, camera = this.camera) => {
    // add the lights
    if (this.withLights) this._addLights();
    this.scene.add(mesh);
    this.camera = camera;
    this.mesh = mesh;
    this._render();
  }

  /**
   * Interal function, called continously to render the scene
   */
  _render = () => {
    this.stats.update();
    requestAnimationFrame(this._render);
    this.trackballControls.update(this.clock.getDelta());
    if (this.updateMesh) this.updateMesh(this.mesh)
    if (this.shouldRotate) this.mesh.rotation.z += 0.01
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Internal function, which adds a number of lights to the scene.
   */
  _addLights = () => {
    const keyLight = new THREE.SpotLight(0xffffff);
    keyLight.position.set(80, 80, 80);
    keyLight.intensity = 2;
    keyLight.lookAt(new THREE.Vector3(0, 15, 0));
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.mapSize.width = 4096;
    this.scene.add(keyLight);

    const backlight1 = new THREE.SpotLight(0xaaaaaa);
    backlight1.position.set(150, 40, -20);
    backlight1.intensity = 0.5;
    backlight1.lookAt(new THREE.Vector3(0, 15, 0));
    this.scene.add(backlight1);

    const backlight2 = new THREE.SpotLight(0xaaaaaa);
    backlight2.position.set(-150, 40, -20);
    backlight2.intensity = 0.5;
    backlight2.lookAt(new THREE.Vector3(0, 15, 0));
    this.scene.add(backlight2);
  }
}

export const initTrackballControls = (camera, renderer) => {
  const trackballControls = new TrackballControls(camera, renderer.domElement);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 1.2;
  trackballControls.panSpeed = 0.8;
  trackballControls.noZoom = false;
  trackballControls.noPan = false;
  trackballControls.staticMoving = true;
  trackballControls.dynamicDampingFactor = 0.3;
  trackballControls.keys = [65, 83, 68];

  return trackballControls;
};