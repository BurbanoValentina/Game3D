// ══════════════════════════════════════════════════════
//  LEVEL 3 GAME ELEMENTS — Arena Digital
//  Crimson-themed puzzles, tokens, parkour, key
// ══════════════════════════════════════════════════════

import { LEVEL3_PUZZLES, LEVEL3_CHECKPOINTS, LEVEL3_TOKENS, LEVEL3_PARKOUR } from '../../../constants/level3Constants';

const ARENA_COLORS = [0xDC143C, 0xFF0066, 0x9D00FF, 0xFF4444, 0xFFD700, 0xFF6600, 0x00f0ff, 0xD861FF];

export function buildPuzzleMarkers(scene, THREE, assets) {
  LEVEL3_PUZZLES.forEach((p) => {
    const py = p.position.y || 0;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.7,4,6), new THREE.MeshPhongMaterial({color:0xDC143C,emissive:0x8B0000,transparent:true,opacity:0.15,wireframe:true}));
    pillar.position.set(p.position.x, py+2, p.position.z); scene.add(pillar);
    const cube = new THREE.Mesh(new THREE.OctahedronGeometry(1.0), new THREE.MeshPhongMaterial({color:0xFF4444,emissive:0xDC143C,transparent:true,opacity:0.85,shininess:100}));
    cube.position.set(p.position.x, py+5, p.position.z); scene.add(cube);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2,0.06,8,32), new THREE.MeshBasicMaterial({color:0xDC143C,transparent:true,opacity:0.25}));
    ring.position.set(p.position.x,py+0.3,p.position.z); ring.rotation.x=-Math.PI/2; scene.add(ring);
    const cubeLight = new THREE.PointLight(0xFF4444, 5, 30); cubeLight.position.copy(cube.position); scene.add(cubeLight);
    const beamH=140;
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(0.3,1.5,beamH,8,1,true),new THREE.MeshBasicMaterial({color:0xDC143C,transparent:true,opacity:0.06,side:THREE.DoubleSide}));
    beam.position.set(p.position.x,beamH/2,p.position.z); scene.add(beam);
    const core=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.5,beamH,6,1,true),new THREE.MeshBasicMaterial({color:0xFF4444,transparent:true,opacity:0.12,side:THREE.DoubleSide}));
    core.position.set(p.position.x,beamH/2,p.position.z); scene.add(core);
    assets.lightBeams.push({beam,core,puzzleId:p.id});
    assets.puzzleMarkers.push({pillar,cube,ring,light:cubeLight,puzzleId:p.id});
  });
}

export function buildTokenMarkers(scene, THREE, assets) {
  LEVEL3_TOKENS.forEach((token) => {
    const tc = token.type==='memory'?0xFFD700:0xDC143C;
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.2), new THREE.MeshPhongMaterial({color:tc,emissive:tc,emissiveIntensity:0.3,transparent:true,opacity:0.7,shininess:120}));
    mesh.position.set(token.position.x, 2.5, token.position.z); scene.add(mesh);
    const light = new THREE.PointLight(tc, 2, 15); light.position.set(token.position.x, 3, token.position.z); scene.add(light);
    const circle = new THREE.Mesh(new THREE.RingGeometry(1.5,1.8,32), new THREE.MeshBasicMaterial({color:tc,transparent:true,opacity:0.15,side:THREE.DoubleSide}));
    circle.rotation.x=-Math.PI/2; circle.position.set(token.position.x, 0.05, token.position.z); scene.add(circle);
    assets.tokenMarkers.push({mesh,light,circle,tokenId:token.id,type:token.type,collected:false,phase:Math.random()*Math.PI*2});
  });
}

export function buildParkourBlocks(scene, THREE, assets) {
  LEVEL3_PARKOUR.forEach((parkour) => {
    const pc = ARENA_COLORS[parkour.puzzleId % ARENA_COLORS.length];
    parkour.blocks.forEach((block) => {
      const geo = new THREE.BoxGeometry(block.w,block.h,block.d);
      const hex = '#'+pc.toString(16).padStart(6,'0');
      const c = document.createElement('canvas'); c.width=64; c.height=64;
      const x = c.getContext('2d'); x.fillStyle='rgba(20,0,30,0.9)'; x.fillRect(0,0,64,64);
      x.strokeStyle=hex; x.globalAlpha=0.3; x.lineWidth=1;
      for(let i=0;i<=4;i++){x.beginPath();x.moveTo(i*16,0);x.lineTo(i*16,64);x.stroke();x.beginPath();x.moveTo(0,i*16);x.lineTo(64,i*16);x.stroke();}
      x.globalAlpha=1;
      const mat = new THREE.MeshPhongMaterial({map:new THREE.CanvasTexture(c),color:0x150020,emissive:new THREE.Color(pc).multiplyScalar(0.08),transparent:true,opacity:0.9,shininess:80});
      const m = new THREE.Mesh(geo, mat); m.position.set(block.x,block.y,block.z); scene.add(m);
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({color:pc,transparent:true,opacity:0.5})));
      assets.parkourBlocks.push({mesh:m,x:block.x,y:block.y,z:block.z,w:block.w,h:block.h,d:block.d,baseY:block.y,phase:Math.random()*Math.PI*2});
    });
  });
}

export function buildKeyAndCheckpoints(scene, THREE, assets) {
  const keyGeo = new THREE.TorusKnotGeometry(1.2,0.3,80,12);
  assets.keyMat = new THREE.MeshPhongMaterial({color:0xDC143C,emissive:0xFF0044,transparent:true,opacity:0,shininess:100});
  assets.keyMesh = new THREE.Mesh(keyGeo, assets.keyMat);
  assets.keyMesh.position.set(0,4,-80); scene.add(assets.keyMesh);
  assets.keyLight = new THREE.PointLight(0xDC143C,0,35);
  assets.keyLight.position.set(0,4,-80); scene.add(assets.keyLight);

  LEVEL3_CHECKPOINTS.forEach((cp) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(2,2.3,6), new THREE.MeshBasicMaterial({color:0xDC143C,transparent:true,opacity:0.15,side:THREE.DoubleSide}));
    ring.rotation.x=-Math.PI/2; ring.position.set(cp.x,0.05,cp.z); scene.add(ring);
    const inner = new THREE.Mesh(new THREE.RingGeometry(0.8,1,6), new THREE.MeshBasicMaterial({color:0xDC143C,transparent:true,opacity:0.08,side:THREE.DoubleSide}));
    inner.rotation.x=-Math.PI/2; inner.position.set(cp.x,0.06,cp.z); scene.add(inner);
    assets.checkpointMeshes.push({mesh:ring,inner,...cp,reached:false});
  });
}
