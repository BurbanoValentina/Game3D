// ══════════════════════════════════════════════════════
//  ILLUSTRATION BUILDER — Canvas-based illustrations
//  Memory images: girls together, girls fighting, grandpa
// ══════════════════════════════════════════════════════

export function buildIllustrations(THREE) {
  return {
    girls_together: createIllustration('girls_together', THREE),
    girls_fighting: createIllustration('girls_fighting', THREE),
    eva_grandpa: createIllustration('eva_grandpa', THREE),
  };
}

function createIllustration(type, THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  if (type === 'girls_together') {
    ctx.fillStyle = 'rgba(255,240,235,0.9)'; ctx.fillRect(0, 0, 512, 512);
    const grd = ctx.createRadialGradient(256, 300, 50, 256, 300, 250);
    grd.addColorStop(0, 'rgba(0,240,255,0.15)'); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 512, 512);
    drawGirl(ctx, 160, 180, '#00F0FF', '#0088AA', 'E');
    drawGirl(ctx, 256, 170, '#00FF88', '#00AA55', 'S');
    drawGirl(ctx, 352, 180, '#FF0066', '#AA0044', 'Z');
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(190, 250); ctx.lineTo(326, 250); ctx.stroke();
    ctx.setLineDash([]);
    drawTitle(ctx, 'JUNTAS', '#00F0FF');
  } else if (type === 'girls_fighting') {
    ctx.fillStyle = 'rgba(255,235,225,0.9)'; ctx.fillRect(0, 0, 512, 512);
    const grd = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
    grd.addColorStop(0, 'rgba(255,0,102,0.2)'); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 512, 512);
    drawGirl(ctx, 140, 180, '#00F0FF', '#005577', 'E');
    drawGirl(ctx, 372, 180, '#FF0066', '#770022', 'Z');
    // Lightning
    ctx.strokeStyle = '#FF0066'; ctx.lineWidth = 2;
    ctx.shadowColor = '#FF0066'; ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(210, 230); ctx.lineTo(240, 250); ctx.lineTo(220, 270);
    ctx.lineTo(260, 290); ctx.lineTo(240, 310); ctx.lineTo(280, 330);
    ctx.stroke();
    ctx.strokeStyle = '#00F0FF';
    ctx.beginPath();
    ctx.moveTo(302, 230); ctx.lineTo(272, 250); ctx.lineTo(292, 270);
    ctx.lineTo(252, 290); ctx.lineTo(272, 310); ctx.lineTo(232, 330);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,0,102,0.5)'; ctx.font = '40px serif'; ctx.textAlign = 'center';
    ctx.fillText('💔', 256, 270);
    drawTitle(ctx, 'LA PELEA', '#FF0066');
  } else if (type === 'eva_grandpa') {
    ctx.fillStyle = 'rgba(255,245,240,0.9)'; ctx.fillRect(0, 0, 512, 512);
    const grd = ctx.createRadialGradient(256, 280, 50, 256, 280, 220);
    grd.addColorStop(0, 'rgba(255,187,51,0.15)'); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 512, 512);
    drawGirl(ctx, 200, 200, '#00F0FF', '#005577', 'E', 0.8);
    drawGrandpa(ctx, 312, 160);
    // Computer
    ctx.fillStyle = 'rgba(0,240,255,0.1)'; ctx.strokeStyle = '#FFBB33'; ctx.lineWidth = 1;
    ctx.fillRect(230, 340, 52, 35); ctx.strokeRect(230, 340, 52, 35);
    ctx.font = '6px monospace'; ctx.fillStyle = '#00FF88'; ctx.textAlign = 'left';
    ctx.fillText('print("hola")', 234, 355);
    ctx.fillText('# mi primer', 234, 363);
    drawTitle(ctx, 'EL ABUELO', '#FFBB33');
  }
  return new THREE.CanvasTexture(canvas);
}

function drawGirl(ctx, x, y, color, darkColor, letter, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fillStyle = darkColor; ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
  // Hair
  ctx.beginPath(); ctx.moveTo(-28, -5); ctx.quadraticCurveTo(-40, 30, -25, 70);
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(28, -5); ctx.quadraticCurveTo(40, 30, 25, 70); ctx.stroke();
  // Eyes
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(-10, -3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(10, -3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  // Mouth
  ctx.beginPath(); ctx.arc(0, 10, 6, 0, Math.PI);
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  // Body
  ctx.beginPath();
  ctx.moveTo(-20, 35); ctx.lineTo(-25, 120); ctx.lineTo(25, 120); ctx.lineTo(20, 35);
  ctx.closePath(); ctx.fillStyle = darkColor; ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  // Arms + legs
  ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-20, 45); ctx.lineTo(-35, 90); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, 45); ctx.lineTo(35, 90); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-10, 120); ctx.lineTo(-15, 180); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, 120); ctx.lineTo(15, 180); ctx.stroke();
  // Letter badge
  ctx.font = 'bold 14px monospace'; ctx.fillStyle = color; ctx.textAlign = 'center';
  ctx.fillText(letter, 0, 80);
  ctx.restore();
}

function drawGrandpa(ctx, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fillStyle = '#554433'; ctx.fill();
  ctx.strokeStyle = '#FFBB33'; ctx.lineWidth = 2; ctx.stroke();
  // Glasses
  ctx.strokeStyle = '#FFBB33'; ctx.lineWidth = 1.5;
  ctx.strokeRect(-18, -8, 14, 12); ctx.strokeRect(4, -8, 14, 12);
  ctx.beginPath(); ctx.moveTo(-4, -2); ctx.lineTo(4, -2); ctx.stroke();
  // Eyes
  ctx.fillStyle = '#FFBB33';
  ctx.beginPath(); ctx.arc(-11, -2, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(11, -2, 2.5, 0, Math.PI * 2); ctx.fill();
  // Smile
  ctx.beginPath(); ctx.arc(0, 10, 8, 0.1, Math.PI - 0.1);
  ctx.strokeStyle = '#FFBB33'; ctx.lineWidth = 1.5; ctx.stroke();
  // Body
  ctx.beginPath();
  ctx.moveTo(-25, 40); ctx.lineTo(-30, 160); ctx.lineTo(30, 160); ctx.lineTo(25, 40);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
  ctx.strokeStyle = '#FFBB33'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.strokeStyle = '#FFBB33'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-25, 50); ctx.lineTo(-40, 110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(25, 50); ctx.lineTo(40, 110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-12, 160); ctx.lineTo(-15, 220); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, 160); ctx.lineTo(15, 220); ctx.stroke();
  ctx.restore();
}

function drawTitle(ctx, text, color) {
  ctx.font = 'bold 18px monospace'; ctx.fillStyle = color;
  ctx.shadowColor = color; ctx.shadowBlur = 10;
  ctx.textAlign = 'center'; ctx.fillText(text, 256, 460);
  ctx.shadowBlur = 0;
}
