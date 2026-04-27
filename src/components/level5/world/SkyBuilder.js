// ══════════════════════════════════════════════════════
//  LEVEL 5 SKY — Corazón del OASIS
//  Fragmenting reality, prismatic colors, collapsing interface
// ══════════════════════════════════════════════════════
export function buildSky(scene, THREE) {
  const skyGeo = new THREE.BoxGeometry(350, 350, 350);
  const c = document.createElement('canvas'); c.width=1024; c.height=512;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,0,512);
  g.addColorStop(0,'#050510'); g.addColorStop(0.15,'#0A0A20');
  g.addColorStop(0.3,'#101030'); g.addColorStop(0.5,'#1A1A40');
  g.addColorStop(0.7,'#101030'); g.addColorStop(0.85,'#0A0A20');
  g.addColorStop(1,'#050510');
  ctx.fillStyle=g; ctx.fillRect(0,0,1024,512);
  // Fragments of all previous level colors
  const keyColors = [{c:'rgba(255,187,51,0.08)',r:70},{c:'rgba(75,0,130,0.08)',r:60},{c:'rgba(220,20,60,0.08)',r:65},{c:'rgba(0,255,136,0.08)',r:55},{c:'rgba(255,255,255,0.1)',r:80}];
  keyColors.forEach((kc,i)=>{
    const cx=150+i*200, cy=100+Math.random()*200;
    const ng=ctx.createRadialGradient(cx,cy,0,cx,cy,kc.r);
    ng.addColorStop(0,kc.c); ng.addColorStop(1,'transparent');
    ctx.fillStyle=ng; ctx.fillRect(cx-kc.r,cy-kc.r,kc.r*2,kc.r*2);
  });
  // Floating memory fragments (rectangles with level colors)
  const fragColors = ['rgba(255,187,51,0.06)','rgba(75,0,130,0.06)','rgba(220,20,60,0.06)','rgba(0,255,136,0.06)','rgba(255,255,255,0.08)'];
  for(let i=0;i<30;i++){
    ctx.save();
    const fx=Math.random()*1024,fy=50+Math.random()*400;
    ctx.translate(fx,fy); ctx.rotate(Math.random()*0.5-0.25);
    ctx.fillStyle=fragColors[Math.floor(Math.random()*fragColors.length)];
    ctx.fillRect(-10,-15,20,30);
    ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=0.5;
    ctx.strokeRect(-10,-15,20,30);
    ctx.restore();
  }
  // Stars
  for(let i=0;i<400;i++){
    ctx.fillStyle=['#fff','#aaddff','#ffddaa','#dd88ff','#88ffdd'][Math.floor(Math.random()*5)];
    ctx.globalAlpha=0.1+Math.random()*0.7;
    ctx.beginPath(); ctx.arc(Math.random()*1024,Math.random()*512,0.3+Math.random()*1.2,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;
  // Central white glow (the Core)
  const cg=ctx.createRadialGradient(512,200,10,512,200,180);
  cg.addColorStop(0,'rgba(255,255,255,0.15)'); cg.addColorStop(0.3,'rgba(255,255,255,0.06)');
  cg.addColorStop(1,'transparent');
  ctx.fillStyle=cg; ctx.fillRect(332,20,360,360);

  scene.add(new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.BackSide})));
}
