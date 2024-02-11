import * as THREE from "three";
import { TTFLoader } from "jsm/loaders/TTFLoader.js";
import { Font } from "jsm/loaders/FontLoader.js";
import { TextGeometry } from "jsm/geometries/TextGeometry.js";

const loader = new TTFLoader();

async function createText({ font, message, w, h }) {
  const textGroup = new THREE.Group();
  const props = {
    font,
    size: 1,
    height: 0.05,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.001,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 1,
  };
  const textGeo = new TextGeometry(message, props);
  textGeo.computeBoundingBox();

  const vsh = await fetch("./src/text/vert.glsl");
  const fsh = await fetch("./src/text/frag.glsl");
  const uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(w, h) },
  };
  const textMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: await vsh.text(),
    fragmentShader: await fsh.text(),
  });

  const textMesh = new THREE.Mesh(textGeo, textMat);
  const centerOffset =
    -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
  textMesh.position.x = centerOffset;
  textGroup.add(textMesh);
  function update (t, mousePos) {
    uniforms.u_time.value = t * 0.005;
    textGroup.rotation.x = mousePos.y * 0.1;
    textGroup.rotation.y = mousePos.x * 0.1;
  }
  textGroup.userData = { update };
  return textGroup;
}

async function getText(w, h) {
  const fontData = await loader.loadAsync("./src/text/miso-bold.ttf");
  const font = new Font(fontData);
  const textObj = await createText({
    font, message: "Robot Bobby", w, h,
  });
  return textObj;
}

export { getText };
