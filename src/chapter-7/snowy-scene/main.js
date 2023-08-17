import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { initRenderer, initPerspectiveCamera, container, addAxesHelper, createGhostTexture } from '../../utils';
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import texture1 from '../../../assets/textures/particles/snowflake1_t.png';
import texture2 from '../../../assets/textures/particles/snowflake2_t.png';
import texture3 from '../../../assets/textures/particles/snowflake3_t.png';
import texture4 from '../../../assets/textures/particles/snowflake4_t.png';

class Controls {
  constructor() {
    this.size = 10;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;
    this.sizeAttenuation = true;
  }

  redraw = () => {
    scene.children.forEach((child) => {
      if (child instanceof THREE.Points) {
        scene.remove(child);
      }
    });
    createPointInstances(
      this.size,
      this.transparent,
      this.opacity,
      this.sizeAttenuation,
      this.color
    );
  };
}

function createPointCloud(name, texture, size, transparent, opacity, sizeAttenuation, _color) {
  const geometry = new THREE.BufferGeometry();
  const color = new THREE.Color(_color);
  const { h, s, l } = color.getHSL();
  color.setHSL(h, s, Math.random() * l);
  const material = new THREE.PointsMaterial({
    size,
    transparent,
    opacity,
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    // Specify whether points' size is attenuated by the camera depth. (Perspective camera only.) Default is true.
    sizeAttenuation,
    color,
  });

  const range = 40;
  const vertices = [];
  for (let i = 0; i < 150; i++) {
    const vertex = [
      Math.random() * range - range / 2,
      Math.random() * range * 1.5,
      Math.random() * range - range / 2,
    ];
    const particle = new THREE.Vector3(...vertex);
    const velocity = new THREE.Vector3(
      0.1 + Math.random() / 5,
      (Math.random() - 0.5) / 3,
      (Math.random() - 0.5) / 3,
    );
    // TODO: how to represent velocity in new version
    vertices.push(...vertex);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const system = new THREE.Points(geometry, material);
  system.name = name;
  scene.add(cloud);
}

function createPointInstances(size, transparent, opacity, sizeAttenuation, color) {
  const loader = new THREE.TextureLoader();
  
  const _texture1 = loader.load(texture1);
  const _texture2 = loader.load(texture2);
  const _texture3 = loader.load(texture3);
  const _texture4 = loader.load(texture4);

  scene.add(createPointCloud('system1', _texture1, size, transparent, opacity, sizeAttenuation, color));
  scene.add(createPointCloud('system2', _texture2, size, transparent, opacity, sizeAttenuation, color));
  scene.add(createPointCloud('system3', _texture3, size, transparent, opacity, sizeAttenuation, color));
  scene.add(createPointCloud('system4', _texture4, size, transparent, opacity, sizeAttenuation, color));
}

const renderer = initRenderer();

const initialPosition = new THREE.Vector3(20, 0, 150);
const lookAtPosition = new THREE.Vector3(20, 30, 0);
const camera = initPerspectiveCamera(initialPosition, lookAtPosition);

const scene = new THREE.Scene();

// addAxesHelper(scene);

const stats = new Stats();
container.appendChild(stats.domElement);

const gui = new GUI();
const controls =  new Controls();
gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
gui.add(controls, 'transparent').onChange(controls.redraw);
gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
gui.addColor(controls, 'color').onChange(controls.redraw);
gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

controls.redraw();

const trackballControls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
function animate() {
    stats.update();
    trackballControls.update(clock.getDelta());
    scene.children.forEach(child => {
      if (child instanceof THREE.Points) {
        const vertices = child.geometry.vertices;
        // TODO: need to update below
        vertices.forEach(function (v) {
          v.y = v.y - (v.velocityY);
          v.x = v.x - (v.velocityX);
          v.z = v.z - (v.velocityZ);

          if (v.y <= 0) v.y = 60;
          if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
          if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;
        });

        child.geometry.verticesNeedUpdate = true;
      }
    });
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

createSprites();
animate();