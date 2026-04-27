// ══════════════════════════════════════════════════════
//  LEVEL 4 SKY — Puente Suspendido
//  Deep void, stars above and below, fragile beauty
// ══════════════════════════════════════════════════════
export function buildSky(scene, THREE) {
  const skyGeo = new THREE.BoxGeometry(350, 350, 350);
  const c = document.createElement('canvas'); c.width=1024; c.height=512;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,0,512);
  g.addColorStop(0,'#000508'); g.addColorStop(0.2,'#020A10');
  g.addColorStop(0.4,'#051520'); g.addColorStop(0.5,'#082028');
  g.addColorStop(0.6,'#051520'); g.addColorStop(0.8,'#020A10');
  g.addColorStop(1,'#000508');
  ctx.fillStyle=g; ctx.fillRect(0,0,1024,512);
  // Stars everywhere
  for(let i=0;i<500;i++){
    ctx.fillStyle=['#ffffff','#aaddff','#61FFD8','#00FF88'][Math.floor(Math.random()*4)];
    ctx.globalAlpha=0.2+Math.random()*0.8;
    ctx.beginPath(); ctx.arc(Math.random()*1024,Math.random()*512,0.3+Math.random()*1.5,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;
  // Emerald nebula glow
  const ng=ctx.createRadialGradient(400,200,20,400,200,200);
  ng.addColorStop(0,'rgba(0,255,136,0.08)'); ng.addColorStop(0.5,'rgba(0,240,255,0.04)'); ng.addColorStop(1,'transparent');
  ctx.fillStyle=ng; ctx.fillRect(200,0,400,400);
  // Bridge cable silhouettes
  ctx.strokeStyle='rgba(0,255,136,0.05)'; ctx.lineWidth=1;
  for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,200+i*15);ctx.bezierCurveTo(250,180+i*15+Math.random()*40,750,180+i*15+Math.random()*40,1024,200+i*15);ctx.stroke();}
  // Void below — dark pulsing
  const vg=ctx.createRadialGradient(512,460,0,512,460,200);
  vg.addColorStop(0,'rgba(0,0,0,0.5)'); vg.addColorStop(0.5,'rgba(5,10,20,0.3)'); vg.addColorStop(1,'transparent');
  ctx.fillStyle=vg; ctx.fillRect(0,350,1024,162);
  const skyTexture = new THREE.CanvasTexture(c);
  scene.add(new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({map:skyTexture,side:THREE.BackSide})));
}
