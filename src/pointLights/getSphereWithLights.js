import * as THREE from "three";

function getSphereWithLights() {

  const sphereGroup = new THREE.Group();

  // const geo = new THREE.IcosahedronGeometry(2, 2);
  // const mat = new THREE.MeshStandardMaterial({
  //   color: 0xffffff,
  //   flatShading: true,
  //   // wireframe: true,
  // });
  // const icosphere = new THREE.Mesh(geo, mat);
  // sphereGroup.add(icosphere);

  // torus knot
const geometry3 = new THREE.TorusKnotGeometry(1.0, 0.4, 100, 16);
const material3 = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  flatShading: true,
});
const torusKnot = new THREE.Mesh(geometry3, material3);
// torusKnot.position.y = -6;
sphereGroup.add(torusKnot);

  function getPointLight(color) {
    let x = 1;
    let y = 0;
    let z = 1;
    let radius = 2.5;
    let rate = Math.random() * 0.01 + 0.005;
    const pGroup = new THREE.Object3D();
    const intensity = 4 + Math.random() * 4;
    const pLight = new THREE.PointLight(color, intensity, 4.5);
    // light *ball*
    const geo = new THREE.SphereGeometry(0.03, 12, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: color,
    });
    const mesh = new THREE.Mesh(geo, mat);

    const glowMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.15,
    });
    const glowMesh = new THREE.Mesh(geo, glowMat);
    glowMesh.scale.multiplyScalar(1.5);
    const glowMesh2 = new THREE.Mesh(geo, glowMat);
    glowMesh2.scale.multiplyScalar(2.5);
    const glowMesh3 = new THREE.Mesh(geo, glowMat);
    glowMesh3.scale.multiplyScalar(4);
    const glowMesh4 = new THREE.Mesh(geo, glowMat);
    glowMesh4.scale.multiplyScalar(6);

    pLight.position.x = radius;
    mesh.position.x = radius;
    mesh.add(pLight);
    mesh.add(glowMesh);
    mesh.add(glowMesh2);
    mesh.add(glowMesh3);
    mesh.add(glowMesh4);

    const circle = new THREE.Object3D();
    circle.rotation.x = THREE.MathUtils.degToRad(90);
    circle.rotation.y = Math.random() * Math.PI * 2;
    circle.add(mesh);

    pGroup.add(circle);
    pGroup.position.set(0, y, 0);

    function update() {
      circle.rotation.z += rate;
    }
    return {
      obj: pGroup,
      update,
    };
  }
  const lights = [];
  const colors = [0xff0000, 0x00ffff, 0x0000ff, 0x0099ff, 0x00ffff];
  const numLights = 5;
  for (let i = 0; i < numLights; i += 1) {
    let col = colors[i % colors.length];
    let light = getPointLight(col);
    sphereGroup.add(light.obj);
    lights.push(light);
  }

  function update() {
    lights.forEach((l) => l.update());
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.005;
  }
  sphereGroup.userData.update = update;
  return sphereGroup;
}

export { getSphereWithLights };
