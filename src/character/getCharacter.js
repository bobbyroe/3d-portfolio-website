import * as THREE from "three";
import { FBXLoader } from "jsm/loaders/FBXLoader.js";

const loader = new FBXLoader();
const textureLoader = new THREE.TextureLoader();
const path = "./src/character/Y Bot.fbx";

function getMaterial() {
  const material = new THREE.MeshMatcapMaterial({
    matcap: textureLoader.load("./src/character/fire-edge-blue.jpg"),
  });
  return material;
}

async function getCharacter() {

  const charGroup = new THREE.Group();

  const char = await loader.loadAsync(path);
  char.scale.setScalar(0.02);
  char.position.set(0, -1.5, 0);
  char.traverse((c) => {
    if (c.isMesh) {
      if (c.material.name === "Alpha_Body_MAT") {
        c.material = getMaterial();
      }
      c.castShadow = true;
    }
  });
  // actions
  const animations = [
    "Drunk Walk",
    "Floating",
    "Idle",
    "Neutral Idle",
    "Standard Walk",
    "Treading Water",
    "Walking",
  ];
  const aIndex = Math.floor(Math.random() * animations.length);
  const anim = animations[aIndex];
  const apath = "./src/character/animations/";
  const animScene = await loader.loadAsync(`${apath}${anim}.fbx`);
  const firstAnim = animScene.animations[0];
  const mixer = new THREE.AnimationMixer(char);
  let action = mixer.clipAction(firstAnim);
  action.play();

  const sunLight = new THREE.DirectionalLight(0xffffff, 5);
  sunLight.position.set(2, 4, 3);
  sunLight.castShadow = true;
  charGroup.add(sunLight);

  const update = (scrollY) => {
    mixer.update(0.02);
      sunLight.intensity = Math.max(scrollY - 22, 0);
    
  };

  const radius = 10;
  const geometry = new THREE.CircleGeometry(radius, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0x001020,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = Math.PI * -0.5;
  plane.receiveShadow = true;
  plane.position.y = -1.5;
  charGroup.add(plane);

  charGroup.userData = { mixer, update };
  charGroup.add(char);
  return charGroup;
}

export { getCharacter };
