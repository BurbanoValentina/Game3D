// ══════════════════════════════════════════════════════
//  STREET BUILDER — Roads, sidewalks, crosswalks
//  Reduced world: 250x250
// ══════════════════════════════════════════════════════

import { WORLD_SIZE } from '../../../constants/gameConstants';

export function buildStreets(scene, THREE) {
  const streetMat = new THREE.MeshPhongMaterial({ color: 0x333338, emissive: 0x111115, shininess: 20 });
  const streetW = 8;
  const roadLen = WORLD_SIZE;

  // North-South main road
  const nsStreet = new THREE.Mesh(new THREE.BoxGeometry(streetW, 0.15, roadLen), streetMat);
  nsStreet.position.set(0, 0.08, 0);
  scene.add(nsStreet);

  // East-West main road
  const ewStreet = new THREE.Mesh(new THREE.BoxGeometry(roadLen, 0.15, streetW), streetMat);
  ewStreet.position.set(0, 0.08, 0);
  scene.add(ewStreet);

  // Secondary diagonal streets
  for (let s = 0; s < 4; s++) {
    const angle = (Math.PI / 4) + (Math.PI / 2) * s;
    const secStreet = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 160), streetMat);
    secStreet.position.set(Math.cos(angle) * 25, 0.06, Math.sin(angle) * 25);
    secStreet.rotation.y = angle;
    scene.add(secStreet);
  }

  // Lane markings
  for (let axis = 0; axis < 2; axis++) {
    for (let d = -120; d < 120; d += 8) {
      const dashGeo = new THREE.BoxGeometry(axis === 0 ? 0.3 : 3, 0.17, axis === 0 ? 3 : 0.3);
      const dash = new THREE.Mesh(dashGeo, new THREE.MeshBasicMaterial({
        color: 0xffbb33, transparent: true, opacity: 0.5,
      }));
      dash.position.set(axis === 0 ? 0 : d, 0.09, axis === 0 ? d : 0);
      scene.add(dash);
    }
  }

  // Sidewalks
  const sidewalkMat = new THREE.MeshPhongMaterial({ color: 0x555550, emissive: 0x111110, shininess: 10 });
  for (let side = -1; side <= 1; side += 2) {
    const swNS = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, roadLen), sidewalkMat);
    swNS.position.set(side * (streetW / 2 + 0.75), 0.13, 0);
    scene.add(swNS);
    const swEW = new THREE.Mesh(new THREE.BoxGeometry(roadLen, 0.25, 1.5), sidewalkMat);
    swEW.position.set(0, 0.13, side * (streetW / 2 + 0.75));
    scene.add(swEW);
  }

  // Crosswalk markings at intersection
  const crosswalkMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  for (let dir = 0; dir < 4; dir++) {
    const angle = (Math.PI / 2) * dir;
    for (let stripe = 0; stripe < 5; stripe++) {
      const stripeGeo = new THREE.BoxGeometry(0.5, 0.17, streetW - 1);
      const s = new THREE.Mesh(stripeGeo, crosswalkMat);
      const offset = (stripe - 2) * 1.2;
      s.position.set(
        Math.cos(angle) * (streetW / 2 + 4) + Math.sin(angle) * offset,
        0.09,
        Math.sin(angle) * (streetW / 2 + 4) - Math.cos(angle) * offset
      );
      s.rotation.y = angle;
      scene.add(s);
    }
  }

  return streetW;
}
