import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffffff'); // White background

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// --- CAMERA CHANGE: Perspective Projection ---
// Field of View (FOV): 45 degrees is standard (like a normal camera lens). 
// Higher (e.g., 75) looks faster/distorted (GoPro style).
// Lower (e.g., 20) looks flatter (Zoom lens).
const camera = new THREE.PerspectiveCamera(
    45,                          // FOV
    sizes.width / sizes.height,  // Aspect Ratio
    0.1,                         // Near clipping
    100                          // Far clipping
);

// Position: We place it high and to the corner, looking down.
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);
scene.add(camera);

// --- LIGHTS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// --- LOAD THE CAR ---
const loader = new GLTFLoader();

loader.load(
    '/models/car.glb', 
    (gltf) => {
        const car = gltf.scene;
        scene.add(car);

        console.log("Car Loaded:", car);
        
        // Debug: Check if wheels are named correctly for later
        car.traverse((child) => {
            if(child.isMesh) console.log("Found Part:", child.name);
        });

        // Optional: Rotate it slightly to face the camera for a better look
        // car.rotation.y = Math.PI / 4; 
    },
    undefined,
    (error) => {
        console.error('Error loading car:', error);
    }
);

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- RESIZE HANDLER (Different for Perspective) ---
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height; // Only aspect ratio changes in perspective
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
});

// Animation Loop
const tick = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();