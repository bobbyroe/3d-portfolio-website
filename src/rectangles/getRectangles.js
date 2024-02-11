import * as THREE from "three";
import { getPlane } from "./getPlane.js";
import * as TWEEN from "../../libs/tween.esm.js";

const props = {
    "duration": 40,
    "chapters": [
      {
        "showBorder": false,
        "startHue": 0.0,
        "useNoise": false,
        "numPlanes": 20
      },
      {
        "showBorder": false,
        "startHue": 0.8,
        "useManyColors": true,
        "useNoise": true,
        "numPlanes": 15
      },
      {
        "showBorder": true,
        "startHue": 0.33,
        "useNoise": false,
        "numPlanes": 16
      },
      {
        "showBorder": false,
        "startHue": 0.66,
        "useNoise": true,
        "numPlanes": 40
      },
      {
        "showBorder": false,
        "startHue": 0.8,
        "useNoise": true,
        "numPlanes": 12
      },
      {}
    ]
  };
function getRectangles() {
  const { chapters, duration } = props;
  
  function findMaxNumPlanes (chptrs) {
    let max = 0;
    chptrs.forEach(c => {
      max = c.numPlanes ? Math.max(max, c.numPlanes) : max;
    });
    return max;
  }

  function getPlaneManager() {
    let currentIndex = 0;
    let planes = [];
    const planesGroup = new THREE.Group();
    const maxNumPlanes = findMaxNumPlanes(chapters);
    function init() {
      for (let i = 0; i < maxNumPlanes; i += 1) {
        addPlane({ index: i, maxNumPlanes, ...chapters[currentIndex] });
      }
    }
    function addPlane(opts) {
      let plane = getPlane(opts);
      planes.push(plane);
      planesGroup.add(plane.mesh);
    }
    let nextTime = 0;
    function update(t) {
        planes.forEach((p) => p.update(t));
      if (t > nextTime) {
        planeManager.transition();
        nextTime = t + duration;
      }
      TWEEN.update();
    }
    function transition() {
      planes.forEach((p) => p.transition(chapters[currentIndex]));
      currentIndex += 1;
      if (currentIndex >= chapters.length) {
        currentIndex = 0;
      }
    }
    return { init, obj: planesGroup, update, transition };
  }

  const planeManager = getPlaneManager();
  planeManager.init();

  let nextTime = 0;
  function animate(timeStep) {
    requestAnimationFrame(animate);
    planeManager.update(timeStep * 1);
    if (timeStep > nextTime) {
      planeManager.transition();
      nextTime = timeStep + duration;
    }
    TWEEN.update();
    renderer.render(scene, camera);
  }
//   animate(0);
return planeManager;
}

export { getRectangles };