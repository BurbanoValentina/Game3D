// ══════════════════════════════════════════════════════
//  LEVEL 4 ENVIRONMENT — Bridge pillars and cable structures
//  Code-architecture pillars over void
// ══════════════════════════════════════════════════════

const BRIDGE_CONFIGS = [
  { x: 35, z: -48, w: 5, h: 55, d: 5, rot: 0 },
  { x: -42, z: -38, w: 4, h: 65, d: 4, rot: 0.1 },
  { x: 58, z: 28, w: 6, h: 50, d: 4, rot: 0.3 },
  { x: -35, z: 52, w: 4, h: 60, d: 5, rot: -0.2 },
  { x: 18, z: -72, w: 5, h: 70, d: 4, rot: 0 },
  { x: -68, z: 12, w: 4, h: 45, d: 6, rot: 0.4 },
  { x: 78, z: -22, w: 5, h: 55, d: 4, rot: -0.1 },
  { x: -22, z: -62, w: 4, h: 48, d: 5, rot: 0.15 },
  { x: 52, z: 58, w: 5, h: 52, d: 4, rot: -0.3 },
  { x: -78, z: -52, w: 4, h: 62, d: 5, rot: 0.2 },
  { x: 82, z: 68, w: 5, h: 42, d: 4, rot: 0 },
  { x: -58, z: 68, w: 4, h: 56, d: 5, rot: -0.15 },
  { x: 28, z: 42, w: 5, h: 38, d: 4, rot: 0.25 },
  { x: -12, z: 32, w: 4, h: 58, d: 5, rot: -0.35 },
  { x: 68, z: -62, w: 5, h: 50, d: 4, rot: 0.1 },
];

function createPillarTexture() {
  const canvas = document.createElement('canvas'); canvas.width=256; canvas.height=512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#040810'; ctx.fillRect(0,0,256,512);
  // Visible code lines
  ctx.font = '10px monospace'; ctx.fillStyle = 'rgba(0,255,136,0.08)';
  const codeLines = ['if(trust){','bridge.hold()','sync(players)','await path()','return hope;','}','try {','catch(e){','fall()','balance++'];
  for(let y=0;y<512;y+=12){
    const line = codeLines[Math.floor(Math.random()*codeLines.length)];
    ctx.fillText('  '.repeat(Math.floor(Math.random()*4))+line, 5, y+10);
  }
  // Emerald glow lines
  ctx.strokeStyle='rgba(0,255,136,0.1)'; ctx.lineWidth=1;
  for(let x=0;x<256;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,512);ctx.stroke();}
  // Structural cables
  ctx.strokeStyle='rgba(97,255,216,0.06)'; ctx.lineWidth=0.5;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(0,Math.random()*512);ctx.bezierCurveTo(80,Math.random()*512,170,Math.random()*512,256,Math.random()*512);ctx.stroke();}
  return canvas;
}

export function buildEnvironment(scene, THREE) {
  const buildings = [], colliders = [];
  BRIDGE_CONFIGS.forEach((cfg) => {
    const tex = new THREE.CanvasTexture(createPillarTexture());
    tex.wrapS=THREE.RepeatWrapping; tex.wrapT=THREE.RepeatWrapping;
    const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
    const mat = new THREE.MeshPhongMaterial({map:tex,color:0x103020,emissive:0x051510,emissiveIntensity:0.2,shininess:15});
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(cfg.x, cfg.h/2, cfg.z); mesh.rotation.y=cfg.rot;
    mesh.castShadow=true; mesh.receiveShadow=true; scene.add(mesh);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({color:0x00FF88,transparent:true,opacity:0.15})));
    buildings.push({mesh,width:cfg.w,depth:cfg.d,height:cfg.h});
    const hw=cfg.w/2+1,hd=cfg.d/2+1;
    colliders.push({minX:cfg.x-hw,maxX:cfg.x+hw,minZ:cfg.z-hd,maxZ:cfg.z+hd});
  });
  // Suspension cables between pillars
  for(let i=0;i<BRIDGE_CONFIGS.length-1;i++){
    const a=BRIDGE_CONFIGS[i], b=BRIDGE_CONFIGS[(i+1)%BRIDGE_CONFIGS.length];
    const pts=[];
    for(let t=0;t<=10;t++){
      const f=t/10;
      pts.push(new THREE.Vector3(a.x*(1-f)+b.x*f, a.h*0.7-Math.sin(f*Math.PI)*8, a.z*(1-f)+b.z*f));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const cGeo = new THREE.TubeGeometry(curve,20,0.05,4,false);
    const cMat = new THREE.MeshBasicMaterial({color:0x00FF88,transparent:true,opacity:0.1});
    scene.add(new THREE.Mesh(cGeo, cMat));
  }
  return {buildings,colliders};
}
