import * as THREE from "three";
import { getLine } from "./getLine.js";
import * as TWEEN from "../../libs/tween.esm.js";
import { getCurl } from "../../libs/noise/curl.js";

const size = 4;
const geometry = new THREE.PlaneGeometry(size, size);

export function getPlane({
  index,
  numPlanes,
  startHue,
  showBorder,
  useNoise: needsNoise,
}) {
  let multiplier = 1 / numPlanes;
  let lightness = 0.2 + index * multiplier;
  let hue = startHue;
  const saturation = 1;
  const color = new THREE.Color().setHSL(hue, saturation, lightness);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.0,
  });
  const mesh = new THREE.Mesh(geometry, material);
  let currentScale = 0.1;
  mesh.scale.setScalar(currentScale);
  mesh.position.z = index * 0.002;
  let rate = 0.2 * index + 0.2;
  let goalScale = 1 - index * multiplier + multiplier * 0.1;
  let goalAlpha = 0.2;

  const line = getLine({ index, numPlanes, startHue, showBorder, size });
  mesh.add(line.mesh);

  let curl;
  const noiseOffset = Math.random();
  const noiseMult = 0.05;
  let noiseiness = 0;
  let goalNoisiness = 0;
  const noiseRate = 0.1;
  function update(t) {
    if (needsNoise) {
      curl = getCurl(noiseOffset + t * 0.001, 0, 0);
      goalNoisiness = curl.x * noiseMult;
    } else {
      goalNoisiness = 0;
    }
    noiseiness -= (noiseiness - goalNoisiness) * noiseRate;
    mesh.rotation.z = Math.cos(noiseiness + t * 0.0002) * rate;
  }
  let colorTween;
  let scaleTween;
  let alphaTween;
  let delay = index * 100;
  let duration = 1000;
  const col = new THREE.Color();
  function transition({
    startHue = Math.random(),
    showBorder = Math.random() < 0.5,
    useNoise = Math.random() < 0.5,
    numPlanes: newNumPlanes = Math.floor(Math.random() * 20),
    useManyColors = false,
  }) {
    hue = useManyColors ? startHue + index * multiplier : startHue;
    colorTween = new TWEEN.Tween(material.color.getHSL(col))
      .easing(TWEEN.Easing.Linear.None)
      .to({ h: hue, s: saturation, l: lightness }, duration)
      .onUpdate((hsl) => material.color.setHSL(hsl.h, hsl.s, hsl.l))
      .delay(delay)
      .start();
    scaleTween = new TWEEN.Tween(mesh.scale)
      .easing(TWEEN.Easing.Linear.None)
      .to({ x: goalScale, y: goalScale, z: goalScale }, duration)
      .delay(delay)
      .start();
    alphaTween = new TWEEN.Tween(material)
      .easing(TWEEN.Easing.Linear.None)
      .to({opacity: goalAlpha}, duration)
      .delay(delay)
      .start();
    line.transition({ startHue, showBorder });
    needsNoise = useNoise;

    if (newNumPlanes !== numPlanes) {
      numPlanes = newNumPlanes;
      multiplier = 1 / numPlanes;
      lightness = 0.2 + index * multiplier;
      goalScale = Math.max(0, 1 - index * multiplier + multiplier * 0.1);
    }
  }
  return { mesh, update, index, transition };
}
