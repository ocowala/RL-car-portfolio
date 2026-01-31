import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- 1. SETUP ---
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#f0f0f0'); // Light grey (better contrast than pure white)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// --- 2. CAMERA (Perspective) ---
const camera = new THREE.PerspectiveCamera(
    45,                          // FOV
    sizes.width / sizes.height,  // Aspect Ratio
    0.1,                         // Near clipping
    500                          // Far clipping (increased to see the whole track)
);
camera.position.set(0, 30, 30); // High up, looking down
scene.add(camera);

// --- 3. CONTROLS (Move, Rotate, Zoom) ---
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Smooths the movement
controls.dampingFactor = 0.05;
controls.minDistance = 5;      // Don't zoom through the ground
controls.maxDistance = 100;    // Don't zoom too far away
controls.target.set(0, 0, 0);  // Pivot around the center of the world

// --- 4. LIGHTING ---
// Ambient Light (Soft global fill)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Directional Light (The Sun)
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(10, 50, 20);
sunLight.castShadow = true;
scene.add(sunLight);

// --- 5. LOAD ASSETS ---
const loader = new GLTFLoader();

// Load the Track
loader.load(
    'statics/models/track.glb', // Check if this should be 'statics' or 'static'
    (gltf) => {
        const track = gltf.scene;
        // Fix for Z-Fighting if needed (lowers track slightly)
        track.position.y = -0.01; 
        scene.add(track);
        console.log("Track Loaded Successfully");
    },
    undefined,
    (error) => { console.error('Error loading track:', error); }
);

// Load the Car
loader.load(
    'statics/models/car.glb', // Check if this should be 'statics' or 'static'
    (gltf) => {
        const car = gltf.scene;
        
        // Setup Car Position
        car.position.set(0, 0, 0); // Start at center
        car.rotation.y = Math.PI;  // Rotate 180 degrees if it faces backwards
        
        scene.add(car);
        console.log("Car Loaded Successfully");
    },
    undefined,
    (error) => { console.error('Error loading car:', error); }
);

// --- 6. RENDERER ---
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- 7. RESIZE HANDLER ---
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
});

// --- 8. ANIMATION LOOP ---
const tick = () => {
    // Required for Damping to work
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();