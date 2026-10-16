import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// --- Simulation State ---
const simState = {
  temperature: 300,        // Starting temperature (Kelvin)
  tc: 93,                 // YBCO critical temperature (93 K)
  isSuperconducting: false,
  basePelletY: 0.95,       // Resting height on magnet
  levitationHeight: 1.25,  // Levitation height
};

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.4, 1.6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Add VR Button (will show "VR NOT SUPPORTED" on standard desktop without headset, which is normal)
document.body.appendChild(VRButton.createButton(renderer));

// Add Desktop Mouse Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.0, 0);
controls.update();

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight.position.set(2, 4, 2);
dirLight.castShadow = true;
scene.add(dirLight);

// --- Environment: Floor & Table ---
const floorGeo = new THREE.PlaneGeometry(10, 10);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const tableGeo = new THREE.BoxGeometry(1.4, 0.9, 0.9);
const tableMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.set(0, 0.45, 0);
table.receiveShadow = true;
scene.add(table);

// --- Apparatus: Neodymium Magnet Base ---
const magnetGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
const magnetMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
const magnet = new THREE.Mesh(magnetGeo, magnetMat);
magnet.position.set(0, 0.925, 0);
magnet.castShadow = true;
scene.add(magnet);

// --- Superconducting Pellet (YBCO) ---
const pelletGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.03, 32);
const pelletMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.3, metalness: 0.1 });
const pellet = new THREE.Mesh(pelletGeo, pelletMat);
pellet.position.set(0, simState.basePelletY, 0);
pellet.castShadow = true;
scene.add(pellet);

// Glowing Cryo Indicator
const ringGeo = new THREE.TorusGeometry(0.095, 0.005, 16, 32);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
const frostRing = new THREE.Mesh(ringGeo, ringMat);
frostRing.rotation.x = Math.PI / 2;
pellet.add(frostRing);

// --- 3D Spatial Readout Panel ---
function createTextCanvas(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 506, 250);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('YBCO Superconductor', 30, 55);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '28px monospace';
  ctx.fillText(text.temp, 30, 115);
  ctx.fillText(text.tc, 30, 160);

  ctx.fillStyle = text.isSuper ? '#22c55e' : '#ef4444';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(text.state, 30, 210);

  return canvas;
}
const readoutGeo = new THREE.PlaneGeometry(0.6, 0.3);
let readoutTexture = new THREE.CanvasTexture(
  createTextCanvas({
    temp: Temp: ${simState.temperature} K,
    tc: Tc:   ${simState.tc} K,
    state: 'State: Normal Resistance',
    isSuper: false
  })
);
const readoutMat = new THREE.MeshBasicMaterial({ map: readoutTexture });
const readoutScreen = new THREE.Mesh(readoutGeo, readoutMat);
readoutScreen.position.set(0, 1.45, -0.35);
scene.add(readoutScreen);

function updateReadout() {
  const isSuper = simState.temperature < simState.tc;
  const canvas = createTextCanvas({
    temp: Temp: ${Math.round(simState.temperature)} K,
    tc: Tc:   ${simState.tc} K,
    state: isSuper ? 'State: SUPERCONDUCTING' : 'State: NORMAL RESISTANCE',
    isSuper: isSuper
  });
  readoutTexture.image = canvas;
  readoutTexture.needsUpdate = true;
}

// --- Toggle Interaction (Spacebar / Click / VR Trigger) ---
function toggleCooling() {
  if (simState.temperature > simState.tc) {
    simState.temperature = 77; // Liquid nitrogen temp
  } else {
    simState.temperature = 300; // Room temp
  }
  updateReadout();
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') toggleCooling();
});

window.addEventListener('pointerdown', (e) => {
  // Only trigger if clicking directly in the canvas (not on overlay)
  if (e.target.tagName.toLowerCase() === 'canvas') {
    toggleCooling();
  }
});

// VR Controller setup
const controller1 = renderer.xr.getController(0);
controller1.addEventListener('selectstart', toggleCooling);
scene.add(controller1);

const controller2 = renderer.xr.getController(1);
controller2.addEventListener('selectstart', toggleCooling);
scene.add(controller2);

// --- Resize Handling ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Main Animation Loop ---
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  const elapsedTime = clock.getElapsedTime();
  simState.isSuperconducting = simState.temperature < simState.tc;

  if (simState.isSuperconducting) {
    // Levitation with smooth bobbing and flux pinning rotation
    const targetY = simState.levitationHeight + Math.sin(elapsedTime * 2.5) * 0.008;
    pellet.position.y = THREE.MathUtils.lerp(pellet.position.y, targetY, 0.05);
    pellet.rotation.y += 0.015;
    frostRing.material.opacity = THREE.MathUtils.lerp(frostRing.material.opacity, 0.9, 0.05);
  } else {
    // Sinks back onto magnet base
    pellet.position.y = THREE.MathUtils.lerp(pellet.position.y, simState.basePelletY, 0.08);
    frostRing.material.opacity = THREE.MathUtils.lerp(frostRing.material.opacity, 0, 0.05);
  }

  renderer.render(scene, camera);
});