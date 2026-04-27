// ══════════════════════════════════════════════════════
//  LEVEL 4 AMBIENT — Puente Suspendido
// ══════════════════════════════════════════════════════
import { LEVEL4_GRAFFITI } from '../../../constants/level4Constants';
const LVL_COLORS = [0x00FF88, 0x61FFD8, 0x00f0ff, 0x00AA55, 0xFFD700];

export function buildParticles(scene, THREE, assets) {
  const count=2000; const geo=new THREE.BufferGeometry();
  const pos=new Float32Array(count*3),col=new Float32Array(count*3);
  const pCols=LVL_COLORS.map(c=>[(c>>16&255)/255,(c>>8&255)/255,(c&255)/255]);
  for(let i=0;i<count;i++){pos[i*3]=(Math.random()-0.5)*230;pos[i*3+1]=Math.random()*60;pos[i*3+2]=(Math.random()-0.5)*230;const c=pCols[Math.floor(Math.random()*pCols.length)];col[i*3]=c[0];col[i*3+1]=c[1];col[i*3+2]=c[2];}
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  assets.particles=new THREE.Points(geo,new THREE.PointsMaterial({size:0.2,vertexColors:true,transparent:true,opacity:0.45}));scene.add(assets.particles);
}
export function buildNeonLights(scene, THREE, assets) {
  for(let i=0;i<15;i++){const c=LVL_COLORS[Math.floor(Math.random()*LVL_COLORS.length)];const l=new THREE.PointLight(c,1.5+Math.random()*2.5,25+Math.random()*20);l.position.set((Math.random()-0.5)*200,3+Math.random()*20,(Math.random()-0.5)*200);scene.add(l);assets.neonLights.push({light:l,baseIntensity:l.intensity,phase:Math.random()*Math.PI*2});}
}
export function buildGraffiti(scene, THREE, assets, buildings) {
  const data=LEVEL4_GRAFFITI; const count=Math.min(buildings.length,data.length);
  for(let i=0;i<count;i++){const b=buildings[i],g=data[i],side=Math.random()>0.5?1:-1;const cv=document.createElement('canvas');cv.width=512;cv.height=128;const ctx=cv.getContext('2d');ctx.fillStyle='rgba(5,15,10,0.6)';ctx.fillRect(0,20,512,80);ctx.strokeStyle=g.color;ctx.globalAlpha=0.3;ctx.lineWidth=1;ctx.strokeRect(4,22,504,76);ctx.globalAlpha=1;ctx.font='bold 32px monospace';ctx.fillStyle=g.color;ctx.shadowColor=g.color;ctx.shadowBlur=20;ctx.fillText(g.text,16,68);ctx.shadowBlur=0;const mat=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,side:THREE.DoubleSide,opacity:0.85});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(8,2),mat);mesh.position.set(b.mesh.position.x+side*(b.width/2+0.1),5+Math.random()*8,b.mesh.position.z);mesh.rotation.y=side>0?-Math.PI/2:Math.PI/2;scene.add(mesh);assets.graffitiMeshes.push(mesh);}
}
export function buildNPCs(scene, THREE, assets) {
  for(let i=0;i<5;i++){const c=LVL_COLORS[Math.floor(Math.random()*LVL_COLORS.length)];const npc=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,2.5,6),new THREE.MeshPhongMaterial({color:0x2A2420,emissive:c,emissiveIntensity:0.1,transparent:true,opacity:0.4,wireframe:Math.random()>0.5}));const nx=(Math.random()-0.5)*100,nz=(Math.random()-0.5)*100;npc.position.set(nx,1.25,nz);scene.add(npc);assets.npcs.push({mesh:npc,baseX:nx,baseZ:nz,loopPhase:Math.random()*Math.PI*2});}
}
export function buildGhost(scene, THREE, assets) {
  const ghost=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.6,3.5,6),new THREE.MeshPhongMaterial({color:0x00FF88,emissive:0x00FF88,transparent:true,opacity:0,wireframe:true}));ghost.position.set(0,1.75,0);scene.add(ghost);
  const tp=new Float32Array(30*3);for(let i=0;i<30;i++){tp[i*3]=(Math.random()-0.5)*2;tp[i*3+1]=Math.random()*4;tp[i*3+2]=(Math.random()-0.5)*2;}
  const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(tp,3));scene.add(new THREE.Points(tg,new THREE.PointsMaterial({color:0x00FF88,size:0.15,transparent:true,opacity:0})));
  assets.memoryGhost={mesh:ghost,visible:false,timer:0};
}
export function buildBillboards(scene, THREE) {
  const texts=['PUENTE 4','HALLIDAY.SYS','EVA_∞','ZONA VÍNCULO'];
  for(let i=0;i<4;i++){const c=document.createElement('canvas');c.width=320;c.height=180;const x=c.getContext('2d');x.fillStyle='rgba(5,15,10,0.8)';x.fillRect(0,0,320,180);const bc=['#00FF88','#FFD700','#9D00FF','#00f0ff'][i];x.strokeStyle=bc;x.globalAlpha=0.3;x.lineWidth=2;x.strokeRect(4,4,312,172);x.globalAlpha=1;x.font='bold 24px monospace';x.fillStyle=bc;x.shadowColor=bc;x.shadowBlur=15;x.fillText(texts[i],20,80);x.shadowBlur=0;const bill=new THREE.Mesh(new THREE.PlaneGeometry(7,4.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,side:THREE.DoubleSide,opacity:0.7}));bill.position.set((Math.random()-0.5)*170,18+Math.random()*20,(Math.random()-0.5)*170);bill.rotation.y=Math.random()*Math.PI;scene.add(bill);}
}
