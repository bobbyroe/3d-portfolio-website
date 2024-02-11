import * as THREE from "three";
import { LineMaterial } from "jsm/lines/LineMaterial.js";
import { LineGeometry } from "jsm/lines/LineGeometry.js";
import { Line2 } from "jsm/lines/Line2.js";
import * as TWEEN from "../../libs/tween.esm.js";
const w = window.innerWidth;
const h = window.innerHeight;
const points = [-1, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 0, -1, 0, 0];
const lineGeo = new LineGeometry();
lineGeo.setPositions(points);

export function getLine({ index, numPlanes, startHue, showBorder, size }) {
  let lightness = index / numPlanes;
  const lineMat = new LineMaterial({
    color: new THREE.Color().setHSL(startHue, 1, lightness),
    linewidth: 3,
    vertexColors: false,
    transparent: true,
    opacity: showBorder ? 1 : 0,
    dashed: true,
    dashSize: 0,
    gapSize: 6,
    dashOffset: 0,
  });
  lineMat.resolution.set(w, h); // resolution of the viewport
  const mesh = new Line2(lineGeo, lineMat);
  mesh.position.z = 0.01;
  mesh.rotation.z = Math.PI * 0.25;
  mesh.scale.multiplyScalar(size * 0.7);
  mesh.computeLineDistances();

  let alphaTween;
  let goalOpacity = 0.0;
  let delay = numPlanes * 80 - index * 80;
  let duration = 500;
  let lineTween;
  let goalDashSize = 6;
  let DashDuration = 2000 - index * 50;
  let colorTween;
  const col = new THREE.Color();

  function transition({ startHue, showBorder: isVisible }) {
    goalOpacity = isVisible ? 1.0 : 0.0;
    goalDashSize = isVisible ? 6 : 0;
    alphaTween = new TWEEN.Tween(lineMat)
      .easing(TWEEN.Easing.Linear.None)
      .to({ opacity: goalOpacity }, duration)
      .delay(delay)
      .start();
    lineTween = new TWEEN.Tween(lineMat)
      .easing(TWEEN.Easing.Linear.None)
      .to({ dashSize: goalDashSize }, DashDuration)
      .delay(delay)
      .start();
    colorTween = new TWEEN.Tween(lineMat.color.getHSL(col))
      .easing(TWEEN.Easing.Linear.None)
      .to({ h: startHue, s: 1, l: lightness }, duration)
      .onUpdate((hsl) => lineMat.color.setHSL(hsl.h, hsl.s, hsl.l))
      .delay(delay)
      .start();
  }
  return { mesh, transition };
}
