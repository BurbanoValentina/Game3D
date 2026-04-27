// ══════════════════════════════════════════════════════
//  LEVEL 5 ENVIRONMENT — Corazón del OASIS
//  Floating memory fragments, crystal structures, all level colors
// ══════════════════════════════════════════════════════

const CORE_CONFIGS = [
  { x: 38, z: -50, w: 6, h: 40, d: 6, rot: 0.2, color: 0xFFBB33 },
  { x: -45, z: -38, w: 5, h: 50, d: 5, rot: -0.1, color: 0x4B0082 },
  { x: 62, z: 28, w: 7, h: 35, d: 5, rot: 0.4, color: 0xDC143C },
  { x: -32, z: 55, w: 5, h: 45, d: 6, rot: -0.3, color: 0x00FF88 },
  { x: 15, z: -72, w: 6, h: 55, d: 5, rot: 0, color: 0xFFFFFF },
  { x: -68, z: 10, w: 5, h: 32, d: 7, rot: 0.5, color: 0xFFBB33 },
  { x: 78, z: -20, w: 6, h: 42, d: 5, rot: -0.2, color: 0x4B0082 },
  { x: -20, z: -62, w: 5, h: 38, d: 6, rot: 0.15, color: 0xDC143C },
  { x: 55, z: 58, w: 7, h: 36, d: 5, rot: -0.4, color: 0x00FF88 },
  { x: -78, z: -52, w: 5, h: 48, d: 6, rot: 0.3, color: 0xFFFFFF },
  { x: 80, z: 68, w: 6, h: 30, d: 5, rot: 0, color: 0x9D00FF },
  { x: -55, z: 68, w: 5, h: 40, d: 6, rot: -0.15, color: 0xFF0066 },
  { x: 25, z: 45, w: 6, h: 34, d: 5, rot: 0.25, color: 0x00f0ff },
  { x: -10, z: 30, w: 5, h: 52, d: 6, rot: -0.35, color: 0xFFBB33 },
  { x: 68, z: -60, w: 6, h: 44, d: 5, rot: 0.1, color: 0xFFFFFF },
];

function createCrystalTexture(color) {
  const canvas = document.createElement('canvas'); canvas.width=256; canvas.height=512;
  const ctx = canvas.getContext('2d');
  const hex = '#'+color.toString(16).padStart(6,'0');
  ctx.fillStyle = '#0A0A15'; ctx.fillRect(0,0,256,512);
  // Crystal facets
  ctx.strokeStyle = hex; ctx.globalAlpha=0.08; ctx.lineWidth=0.5;
  for(let i=0;i<20;i++){
    ctx.beginPath();
    const cx=Math.random()*256,cy=Math.random()*512,s=30+Math.random()*40;
    for(let v=0;v<6;v++){const a=(Math.PI/3)*v;ctx.lineTo(cx+s*Math.cos(a)*0.5,cy+s*Math.sin(a)*0.7);}
    ctx.closePath(); ctx.stroke();
  }
  ctx.globalAlpha=1;
  // Inner glow
  const g=ctx.createRadialGradient(128,256,0,128,256,200);
  g.addColorStop(0,hex.replace(')',',0.08)').replace('rgb','rgba'));
  g.addColorStop(1,'transparent');
  ctx.fillStyle=`rgba(${(color>>16)&255},${(color>>8)&255},${color&255},0.04)`;
  ctx.fillRect(0,0,256,512);
  // Prismatic sparkles
  for(let i=0;i<200;i++){
    ctx.fillStyle=`rgba(255,255,255,${0.02+Math.random()*0.05})`;
    ctx.fillRect(Math.random()*256,Math.random()*512,1,1);
  }
  return canvas;
}

export function buildEnvironment(scene, THREE) {
  const buildings = [], colliders = [];
  CORE_CONFIGS.forEach((cfg) => {
    const tex = new THREE.CanvasTexture(createCrystalTexture(cfg.color));
    const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
    const mat = new THREE.MeshPhongMaterial({
      map:tex, color:0x1A1A30,
      emissive:new THREE.Color(cfg.color), emissiveIntensity:0.05,
      transparent:true, opacity:0.85, shininess:60,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(cfg.x, cfg.h/2, cfg.z); mesh.rotation.y=cfg.rot;
    mesh.castShadow=true; mesh.receiveShadow=true; scene.add(mesh);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({color:cfg.color,transparent:true,opacity:0.15})));
    buildings.push({mesh,width:cfg.w,depth:cfg.d,height:cfg.h});
    const hw=cfg.w/2+1,hd=cfg.d/2+1;
    colliders.push({minX:cfg.x-hw,maxX:cfg.x+hw,minZ:cfg.z-hd,maxZ:cfg.z+hd});
  });
  return {buildings,colliders};
}
