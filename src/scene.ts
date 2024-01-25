import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let textureCube;
let innerSphereMesh: THREE.Mesh;
let innerSphereMaterial: THREE.MeshBasicMaterial;
let outerSphereMesh: THREE.Mesh;

let textureEquirec: THREE.Texture;

let outerSphereMaterial: THREE.MeshPhysicalMaterial;

let camera: THREE.PerspectiveCamera | undefined;
const origin = new THREE.Vector3(0, 0, 0);

const divContainer = document.getElementById("orb-render-area");

const position1 = new THREE.Vector3(0, 2, 6);
const position2 = new THREE.Vector3(0, 0, 4);
// const position3 = new THREE.Vector3(0, 0, 1.3);

// let sphereVisibility = 0;
let ballVisibility = 1;
let fadeState: "out" | "in" | undefined;

const controls = {
  zoomed: true,
  greyScale: 0.5, // Default value for grey scale
  thicknessScale: 0.5, // Default value for thickness scale
};

let loaderCallback: () => void | undefined;

// subtle mouse movements:
// Variables to store the current mouse position
// let mouseX = 0;
// let mouseY = 0;
// const sensitivityX = 0.0025; // Adjust as needed for x-axis sensitivity
// const sensitivityY = 0.0012; // Adjust as needed for y-axis sensitivity

const baseLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);

const fireLight = new THREE.HemisphereLight(0xffa500, 0x000000);
fireLight.lookAt(origin);
fireLight.position.set(0, 20, 60);

// let fireIntensity = 0.5;
// let fireColor = 0xffa500;

// const fireChangeTime = 200;

// function evolveFireIntensity() {
//   fireIntensity = Math.random() * 0.2 + 0.5; // Range between 0.5 and 100
// }

// function evolveFireColor() {
//  fireColor = Math.random() > 0.5 ? 0xe06d60 : 0xe07d60; // Orange and red
// }

// setInterval(evolveFireColor, fireChangeTime * 0.8);
// setInterval(evolveFireIntensity, fireChangeTime * 0.5);

// function flickerLight() {
//   fireLight.intensity = fireIntensity;
//   fireLight.color.setHex(fireColor);
// }

function getCurrentCameraPosition() {
  if (controls.zoomed) {
    return position2;
  }
  return position1;
}

// let isMoving = false;

init();

function addCandleLight(
  scene: THREE.Scene,
  position = { x: 0, y: 0, z: 0 },
  color = 0xffd699,
  intensity = 10,
  distance = 200,
) {
  // Create a PointLight with a warm color
  const candleLight = new THREE.PointLight(color, intensity, distance);

  // Set the position of the light
  candleLight.position.set(position.x, position.y, position.z);

  // Add the light to the scene
  scene.add(candleLight);

  // Optional: Add Lensflare for a glow effect
  // Note: You need to include Lensflare plugin in your project
  // const textureLoader = new THREE.TextureLoader();
  // const textureFlare = textureLoader.load('path_to_lensflare_texture.png');
  // const lensflare = new THREE.Lensflare();
  // lensflare.addElement(new THREE.LensflareElement(textureFlare, 500, 0, candleLight.color));
  // candleLight.add(lensflare);
}

// Usage

// Create a new FBXLoader instance
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
loader.setDRACOLoader(dracoLoader);

// Load your FBX file
loader.load(
  "decor3.glb", // Replace with the path to your FBX file
  (object) => {
    // Add the loaded object to the scene
    scene.add(object.scene);
    object.scene.scale.multiplyScalar(5);
    object.scene.position.y = -5.5;
    object.scene.traverse((child) => {
      if (!child.name.includes("flame") || child.type !== "Mesh") {
        return;
      }
      let position = new THREE.Vector3();
      child.getWorldPosition(position);
      addCandleLight(scene, position);
    });
    loaderCallback?.();
  },
);

function initCamera() {
  const cs = divContainer?.getBoundingClientRect()!;
  camera = new THREE.PerspectiveCamera(70, cs.height / cs.width, 0.1, 100);
  camera.position.set(0, 0, 2.5);
  setCameraPosition(1);
}

function setCameraPosition(duration = 1000) {
  if (!camera) {
    throw new Error("Camera not yet defined!");
  }
  // isMoving = true;
  const newPosition = getCurrentCameraPosition();
  const startPos = camera.position.clone();
  const endPos = newPosition.clone();
  let startTime: number | null = null;

  function animateTransition(time: number) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const t = Math.min(elapsed / duration, 1);

    // Calculate current position
    const currentPosition = new THREE.Vector3();
    currentPosition.lerpVectors(startPos, endPos, t);

    // Update the camera position
    camera!.position.copy(currentPosition);

    // Ensure the camera is always oriented towards the center
    camera!.lookAt(origin);

    // Continue the animation until duration is reached
    if (t < 1) {
      requestAnimationFrame(animateTransition);
    } else {
      //  isMoving = false;
    }
  }

  requestAnimationFrame(animateTransition);
}

// number between 0 and 1
function setSphereGreyness(scale: number) {
  scale = Math.max(0, Math.min(scale, 1));
  var greyValue = Math.floor(scale * 255);
  outerSphereMaterial.color = new THREE.Color(
    (greyValue << 16) + (greyValue << 8) + greyValue,
  );
}

// number between 0 and 1
function setSphereThickness(scale: number) {
  scale = Math.max(0, Math.min(scale, 1));
  outerSphereMaterial.thickness = 18 * (1 - scale) + 1;
}

function init() {
  // CAMERAS
  initCamera();

  // SCENE

  scene = new THREE.Scene();

  // Textures

  const loader = new THREE.CubeTextureLoader();

  textureCube = loader.load([
    "px.webp",
    "nx.webp",
    "py.webp",
    "ny.webp",
    "pz.webp",
    "nz.webp",
  ]);

  const textureLoader = new THREE.TextureLoader();

  textureEquirec = textureLoader.load("./dark-s_nz.jpg");
  // textureEquirec.mapping = THREE.EquirectangularReflectionMapping;

  textureEquirec.colorSpace = THREE.SRGBColorSpace;

  textureEquirec.wrapS = THREE.RepeatWrapping;
  textureEquirec.wrapT = THREE.RepeatWrapping;
  textureEquirec.repeat.set(9, 7);

  scene.background = textureCube;

  // spheres

  const innerSphereGeometry = new THREE.IcosahedronGeometry(1, 15);
  innerSphereMaterial = new THREE.MeshBasicMaterial();
  innerSphereMesh = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
  innerSphereMesh.rotation.y = 1.5;
  scene.add(innerSphereMesh);

  // scratches
  const scratchNormal = textureLoader.load("./damage/ScratchNormal.jpg");
  const scratchOcclusion = textureLoader.load("./damage/ScratchOcclusion.jpg");
  const scratchRoughness = textureLoader.load("./damage/ScratchRoughness.jpg");

  const outerSphereGeometry = new THREE.SphereGeometry(1.1, 50);
  outerSphereMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0.15,
    roughnessMap: scratchRoughness,
    normalMap: scratchNormal,
    iridescenceMap: scratchOcclusion,
    transmission: 1,
    thickness: 2,
    opacity: 0.1,
    color: 0xffffff,
  });
  outerSphereMesh = new THREE.Mesh(outerSphereGeometry, outerSphereMaterial);
  scene.add(outerSphereMesh);

  // stand

  const cylinderGeometry = new THREE.CylinderGeometry(
    0.7,
    1,
    0.8,
    50,
    50,
    true,
  );

  // Material for the stand

  const metalBase = textureLoader.load("./metal/MetalBasecolor.jpg");
  const metalNormal = textureLoader.load("./metal/MetalNormal.jpg");
  const metalOpacity = textureLoader.load("./metal/MetalOpacity.jpg");
  // const metalOcclusion = textureLoader.load("./metal/MetalOcclusion.jpg");
  const metalRoughness = textureLoader.load("./metal/MetalRoughness.jpg");

  const standMaterial = new THREE.MeshPhysicalMaterial({
    roughnessMap: metalRoughness,
    normalMap: metalNormal,
    map: metalBase,
    transparent: true,
    alphaMap: metalOpacity,
  });

  // Create the cylinder mesh
  const stand = new THREE.Mesh(cylinderGeometry, standMaterial);

  // Position the cylinder just below 0,0,0
  stand.position.y = -1.2;

  const tableGeometry = new THREE.CylinderGeometry(4, 4, 0.1, 50, 30);
  const fabricBase = textureLoader.load("./fabric/FabricBasecolor.jpg");
  const fabricNormal = textureLoader.load("./fabric/FabricNormal.jpg");
  const fabricOcclusion = textureLoader.load("./fabric/FabricOcclusion.jpg");
  const fabricRoughness = textureLoader.load("./fabric/FabricRoughness.jpg");
  const tableMaterial = new THREE.MeshPhysicalMaterial({
    roughnessMap: fabricRoughness,
    iridescenceMap: fabricOcclusion,
    normalMap: fabricNormal,
    map: fabricBase,
    transparent: true,
  });
  const table = new THREE.Mesh(tableGeometry, tableMaterial);
  table.position.y = -1.5;
  // scene.add(table);

  // Add the cylinder to the scene
  scene.add(stand);

  // flickering light
  // Create a point light to simulate fire
  scene.add(fireLight);
  scene.add(baseLight);

  // Function to simulate flickering

  // controls

  // const gui = new dat.GUI();
  //  gui
  //   .add(controls, "zoomed")
  //   .name("Camera Switch")
  //   .onChange(() => setCameraPosition());
  //
  // Add grey scale slider
  // gui.add(controls, "greyScale", 0, 1).onChange(function (value) {
  //   setSphereGreyness(value);
  // });
  //
  // // Add thickness scale slider
  // gui.add(controls, "thicknessScale", 0, 1).onChange(function (value) {
  //   setSphereThickness(value);
  // });

  //

  renderer = new THREE.WebGLRenderer();
  renderer.domElement.id = "orb-renderer";

  //

  //controls = new OrbitControls(camera, renderer.domElement);
  //controls.minDistance = 1.5;
  //controls.maxDistance = 6;

  //

  outerSphereMaterial.envMap = textureCube;
  outerSphereMaterial.needsUpdate = true;

  innerSphereMaterial.map = textureEquirec;
  innerSphereMaterial.needsUpdate = true;

  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureCube.mapping = THREE.CubeReflectionMapping;

  // gui again
  //  gui.open();
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  if (!camera) {
    return;
  }
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Event listener for mouse movement
// document.addEventListener("mousemove", (event) => {
//  mouseX = event.clientX - window.innerWidth / 2;
//  mouseY = event.clientY - window.innerHeight / 2;
// });

//function updateCameraWithMouse() {
// if (!camera) {
//   throw new Error("Camera is undefined!");
// }
// // Adjust the camera position or rotation based on mouse position
// // Only update if the camera is not currently transitioning
// if (isMoving) {
//   return;
// }
//
// const currentPosition = getCurrentCameraPosition().clone();
// const zoomFactor = controls.zoomed ? 0.1 : 1;
//
// const deviationX = mouseX * sensitivityX * zoomFactor;
// const deviationY = mouseY * sensitivityY * zoomFactor;
//
// currentPosition.x += deviationX;
// currentPosition.y -= deviationY;
// camera.position.copy(currentPosition);
// camera.lookAt(origin);
// }

// function onDeviceOrientationChangeEvent(event: any) {
//   if (initialAlpha === undefined || initialBeta === undefined) {
//     initialAlpha = event.alpha;
//     initialBeta = event.beta;
//     return;
//   }
//   // Get device orientation
//   var alpha = event.alpha; // Yaw (around y-axis)
//   var beta = event.beta; // Pitch (around x-axis)
//   // var gamma = event.gamma; // Roll (around z-axis)
//
//   // Clamp values
//   // For alpha: Limit to +/- 45 degrees. Adjust according to your initial orientation.
//   var maxHorizontalAngle = 45;
//   alpha = Math.max(
//     -maxHorizontalAngle,
//     Math.min(maxHorizontalAngle, alpha - initialAlpha),
//   );
//
//   // For beta: Limit to +/- 20 degrees from the horizontal plane. Adjust according to your initial orientation.
//   var maxVerticalAngle = 20;
//   beta = Math.max(
//     -maxVerticalAngle,
//     Math.min(maxVerticalAngle, beta - initialBeta),
//   );
//
//   // Convert degrees to radians
//   var euler = new THREE.Euler(
//     THREE.MathUtils.degToRad(beta),
//     THREE.MathUtils.degToRad(alpha),
//     THREE.MathUtils.degToRad(0),
//     "YXZ",
//   );
//   camera?.quaternion.setFromEuler(euler);
// }

// Initial alpha and beta values (to calibrate initial orientation)
// var initialAlpha: number | undefined = undefined; // Adjust as needed
// var initialBeta: number | undefined = undefined; // Adjust as needed

// Add event listener for device orientation
// window.addEventListener(
//   "deviceorientation",
//   onDeviceOrientationChangeEvent,
//   true,
// );
//
//
let camAngle = 0;
let camRadius = 4;
let camSpeed = 0.0005;

function cameraRotate() {
  if (!camera) {
    return;
  }
  camAngle += camSpeed;
  camera.position.x = camRadius * Math.cos(camAngle);
  camera.position.z = camRadius * Math.sin(camAngle);
}

function animate() {
  requestAnimationFrame(animate);
  // updateCameraWithMouse();
  if (fadeState) {
    if (fadeState === "out") {
      ballVisibility -= 0.01;
    } else {
      ballVisibility += 0.01;
    }
    setSphereGreyness(ballVisibility);
    setSphereThickness(ballVisibility);
  }
  cameraRotate();
  render();
}

function render() {
  if (!camera) {
    console.error("No camera!");
    return;
  }
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

export function beginRendering() {
  if (divContainer) {
    divContainer.appendChild(renderer.domElement);
    onWindowResize();
  }
  animate();
}

export function fadeOutBall(time: number) {
  fadeState = "out";
  setTimeout(() => {
    fadeState = undefined;
    ballVisibility = 0;
  }, time);
}

export function fadeInBall(time: number) {
  fadeState = "in";
  setTimeout(() => {
    fadeState = undefined;
    ballVisibility = 1;
  }, time);
}

const camBack = camSpeed * 50;

export function replaceBallImage(imageURI: string) {
  const textureLoader = new THREE.TextureLoader();
  const newTexture = textureLoader.load(imageURI);
  newTexture.colorSpace = THREE.SRGBColorSpace;
  newTexture.wrapS = THREE.RepeatWrapping;
  newTexture.wrapT = THREE.RepeatWrapping;
  newTexture.repeat.set(5, 3);
  innerSphereMaterial.map = newTexture;
  let lookPosition = new THREE.Vector3();
  lookPosition.x = camRadius * Math.cos(camAngle - camBack);
  lookPosition.z = camRadius * Math.sin(camAngle - camBack);
  innerSphereMesh.lookAt(lookPosition);
}

export function onLoad(callback: () => void) {
  loaderCallback = callback;
}
