import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, createGhostTexture } from '../../utils';

class Controls {
  constructor() {
    this.size = 4;
    this.transparent = true;
    this.opacity = 0.6;
    this.vertexColors = true;
    this.color = 0xffffff;
    this.vertexColor = 0x00ff00;
    this.sizeAttenuation = true;
    this.rotate = true;
  }

  redraw = () => {
    if (scene.getObjectByName('particles')) {
      scene.remove(scene.getObjectByName('particles'));
    }

    createParticles(this.size, this.transparent, this.opacity, this.vertexColor, this.sizeAttenuation, this.color, this.vertexColor);
  }
}

const renderer = initRenderer();

const camera = initPerspectiveCamera(new THREE.Vector3(0, 0, 150));  // 2d view

const scene = new THREE.Scene();

let cloud;

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

function createSprites() {
  const spriteGroup = new THREE.Group();
  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
      const material = new THREE.SpriteMaterial({ color: Math.random() * 0xffffff });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(x * 4, y * 4, 0);
      spriteGroup.add(sprite);
    }
  }

  scene.add(spriteGroup);
}

function createPoints() {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
  });

  const positions = [];
  const colors = [];
  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
      positions.push(x * 4, y * 4, 0);
      colors.push(Math.random(), Math.random(), Math.random());
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  cloud = new THREE.Points(geometry, material);
  scene.add(cloud);
}

function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, colorValue, vertexColorValue) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size,
    transparent,
    opacity,
    // Specify whether points' size is attenuated by the camera depth. (Perspective camera only.) Default is true.
    sizeAttenuation,
    color: new THREE.Color(colorValue),
    vertexColors,
    map: createGhostTexture(),
  });

  const range = 500;
  const vertices = [];
  const colors = [];

  // colors array expect the RGB Array, here use 'setHex' to get Color
  const getRandomLColorHex = () => {
    const asHSL = {};
    const color = new THREE.Color().setHex(vertexColorValue);
    color.getHSL(asHSL);
    color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
    return [color.r, color.g, color.b];
  }
  for (let i = 0; i < 15000; i++) {
    vertices.push(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2
    );
    colors.push(...getRandomLColorHex());
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  cloud = new THREE.Points(geometry, material);
  cloud.name = "particles";
  scene.add(cloud);
}

const trackballControls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();

const controls = new Controls();
const gui = new GUI();
gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
gui.add(controls, 'transparent').onChange(controls.redraw);
gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
gui.add(controls, 'vertexColors').onChange(controls.redraw);

gui.addColor(controls, 'color').onChange(controls.redraw);
gui.addColor(controls, 'vertexColor').onChange(controls.redraw);
gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
gui.add(controls, 'rotate');

controls.redraw();

let step = 0;
function animate() {
  stats.update();
  trackballControls.update(clock.getDelta());
  if (controls.rotate) {
    step += 0.01;
    cloud.rotation.x = step;
    cloud.rotation.z = step;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// createSprites();
// createPoints();
animate();