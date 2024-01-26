import * as THREE from "three";

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

let ballVisibility = 1;
let fadeState: "out" | "in" | undefined;

const controls = {
  zoomed: true,
  greyScale: 0.5, // Default value for grey scale
  thicknessScale: 0.5, // Default value for thickness scale
};

function getCurrentCameraPosition() {
  if (controls.zoomed) {
    return position2;
  }
  return position1;
}

// let isMoving = false;

init();

// Create a new FBXLoader instance

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
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
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

  renderer = new THREE.WebGLRenderer();
  renderer.domElement.id = "orb-renderer";

  outerSphereMaterial.envMap = textureCube;
  outerSphereMaterial.needsUpdate = true;

  innerSphereMaterial.map = textureEquirec;
  innerSphereMaterial.needsUpdate = true;

  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureCube.mapping = THREE.CubeReflectionMapping;

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
