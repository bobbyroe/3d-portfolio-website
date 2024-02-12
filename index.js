import * as THREE from "three";
import getLayer from "./libs/getLayer.js";
import { getText } from "./src/text/getText.js";
import { getCharacter } from "./src/character/getCharacter.js";
import { getSphereWithLights } from "./src/pointLights/getSphereWithLights.js";
import { getRectangles } from "./src/rectangles/getRectangles.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// master scrolling container
let scrollPosY = 0;
const mousePos = new THREE.Vector2();
const stuffGroup = new THREE.Group();
scene.add(stuffGroup);

// Hero Text
const text = await getText(w, h);
text.position.y = 1.5;
stuffGroup.add(text);

const rectangles = getRectangles();
rectangles.obj.position.y = -4;
stuffGroup.add(rectangles.obj);

// add cards for youtube
function getCard({ index, yPos = 0 }) {
  const cardGeo = new THREE.PlaneGeometry(1.6, 0.9, 16, 9);
  const map = new THREE.TextureLoader().load(`./src/cards/${index}.jpg`);
  map.colorSpace = THREE.SRGBColorSpace;
  const cardMat = new THREE.MeshBasicMaterial({
    map,
  });
  const card = new THREE.Mesh(cardGeo, cardMat);
  card.scale.setScalar(2.5);
  card.position.set(index * 1 - 1.5, yPos, -1 + index * 1);
  let midPoint = 0.4 + index * 0.1;
  let mouseMult = 0.5;
  function update() {
    card.rotation.x = (mousePos.y - midPoint) * mouseMult;
    card.rotation.y = (mousePos.x - midPoint) * mouseMult;
  }
  card.userData.update = update;
  return card;
}
const cardsGroup = new THREE.Group();
stuffGroup.add(cardsGroup);
for (let i = 0; i < 3; i += 1) {
  let card = getCard({ index: i, yPos: -11 - i });
  cardsGroup.add(card);
}

// icosphere (or torus knot) with lights
const sphereWithLights = getSphereWithLights();
sphereWithLights.position.y = -18;
stuffGroup.add(sphereWithLights);

// mocap guy
const guy = await getCharacter();
guy.position.y = -32;
stuffGroup.add(guy);

// Hero Sprites BG
const heroSprites = getLayer({
  hue: 0.8,
  numSprites: 4,
  opacity: 0.2,
  radius: 2,
  size: 12,
  z: -3.5,
});
heroSprites.position.y = 1;
stuffGroup.add(heroSprites);

// Footer Sprites BG
const midSprites = getLayer({
  hue: 0.0,
  numSprites: 4,
  opacity: 0.2,
  radius: 4,
  size: 24,
  z: -10.5,
});
midSprites.position.y = -32;
stuffGroup.add(midSprites);

function animate(t = 0) {
  requestAnimationFrame(animate);
  text.userData.update(t, mousePos);
  rectangles.update(t * 0.01);
  guy.userData.update(scrollPosY);
  cardsGroup.children.forEach((c) => c.userData.update());
  sphereWithLights.userData.update(t);
  stuffGroup.position.y = scrollPosY;
  renderer.render(scene, camera);
}
handleScroll();
animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

function handleScroll() {
  scrollPosY = (window.scrollY / window.innerHeight) * 6;
  // console.log(scrollPosY); // debug
}
window.addEventListener("scroll", handleScroll);

window.addEventListener("pointermove", (evt) => {
  let x = evt.clientX / window.innerWidth;
  let y = evt.clientY / window.innerHeight;
  mousePos.set(x, y);
});
