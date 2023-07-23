import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

function addGeometries(scene) {
    const geoms = [];
    geoms.push(new THREE.CylinderGeometry(1, 4, 4));
    // basic cube
    geoms.push(new THREE.BoxGeometry(2, 2, 2));
    // basic spherer
    geoms.push(new THREE.SphereGeometry(2));
    geoms.push(new THREE.IcosahedronGeometry(4));
    // custom geometry
    const customGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        // 前面四个顶点
        -1, -1, 1,
        1, -1, 1,
        1, 1, 1,
        -1, 1, 1,
        // 后面四个顶点
        -1, -1, -1,
        1, -1, -1,
        1, 1, -1,
        -1, 1, -1
    ]);

    // 创建顶点索引数组
    const indices = new Float32Array([
        // 前面的面
        0, 1, 2,
        2, 3, 0,
        // 后面的面
        4, 6, 5,
        6, 4, 7,
        // 侧面
        4, 5, 0,
        5, 1, 0,
        3, 2, 7,
        2, 6, 7,
        5, 6, 1,
        6, 2, 1,
        3, 7, 0,
        7, 4, 0
    ]);

    // 创建法线向量数组
    const normals = new Float32Array([
        // 前面的面
        0, 1, 2,
        2, 3, 0,
        // 后面的面
        4, 5, 6,
        6, 7, 4,
        // 侧面1
        4, 0, 3,
        3, 7, 4,
        // 侧面2
        1, 5, 6,
        6, 2, 1,
        // 侧面3
        4, 5, 1,
        1, 0, 4,
        // 侧面4
        3, 2, 6,
        6, 7, 3
    ]);
    // 设置顶点坐标属性
    const positionAttribute = new THREE.BufferAttribute(vertices, 3);
    customGeometry.setAttribute('position', positionAttribute);
    // 设置顶点索引属性
    const indexAttribute = new THREE.BufferAttribute(indices, 1);
    customGeometry.setIndex(indexAttribute);
    // 设置法线向量属性
    const normalAttribute = new THREE.BufferAttribute(normals, 3);
    customGeometry.setAttribute('normal', normalAttribute);
    geoms.push(customGeometry);
    let j = 0;
    for (let i = 0; i < geoms.length; i++) {
        const materials = [
            new THREE.MeshBasicMaterial({ color: Math.random() * 0xFFFFFF, wireframe: true }),
            new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true })
        ];

        const mesh = new THREE.Mesh(geoms[i], materials[i % 2]);
        mesh.castShadow = true;
        mesh.position.x = -24 + ((i % 4) * 12);
        mesh.position.y = 4;
        mesh.position.z = -4 + (j * 12);
        if ((i + 1) % 4 == 0) j++;
        scene.add(mesh);
    }
}

const width = window.innerWidth;
const height = window.innerHeight;
const w2hRatio = width / height;
const container = document.querySelector('#webgl-container');

let plane;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, w2hRatio, 0.1, 1000);
camera.position.set(-50, 20, 10);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = 0;
plane.position.z = 0;

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x3c3c3c);
scene.add(ambientLight);

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

scene.add(plane);
addGeometries(scene);

// initial statistics and GUI module
const stats = new Stats();
container.appendChild(stats.domElement);

const trackBallControls = new OrbitControls(camera, renderer.domElement);
trackBallControls.addEventListener("change", render);
trackBallControls.minDistance = 10;
trackBallControls.maxDistance = 100;
trackBallControls.enablePan = false;

const clock = new THREE.Clock();

function render() {
    renderer.render(scene, camera);
}

function animate() {
    stats.update();
    trackBallControls.update(clock.getDelta());
    requestAnimationFrame(animate);
    render();
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

animate();

// add the output of the renderer to the html element
container.appendChild(renderer.domElement);
