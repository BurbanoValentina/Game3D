// ══════════════════════════════════════════════════════
//  BUILDING TEXTURES — HD canvas textures for facades
//  Code snippets, windows, neon accents
// ══════════════════════════════════════════════════════

const CODE_SNIPPETS = [
  'function init() {', 'const OASIS = new World();', 'if (eva.alive) {',
  'return keyAmbar;', 'class Tower extends Node {', 'async load() {',
  'export default OASIS;', 'while (system.active) {',
  'try { decrypt(); }', 'import { Key } from "halliday";',
  'eva.solve(puzzle);', 'render(scene, camera);',
];

export function createBuildingTexture(width, height, accentColor, THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const hex = typeof accentColor === 'number'
    ? '#' + accentColor.toString(16).padStart(6, '0')
    : accentColor;

  // Base cream color
  ctx.fillStyle = '#E8DDD5';
  ctx.fillRect(0, 0, 256, 512);

  // Gradient overlay
  const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
  baseGrad.addColorStop(0, 'rgba(220,210,200,0.5)');
  baseGrad.addColorStop(0.5, 'rgba(235,225,215,0.3)');
  baseGrad.addColorStop(1, 'rgba(210,200,190,0.6)');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 256, 512);

  // Subtle grid
  ctx.strokeStyle = `${hex}08`;
  ctx.lineWidth = 0.5;
  for (let y = 0; y < 512; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
  }
  for (let x = 0; x < 256; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }

  // Code snippets
  ctx.font = '10px monospace';
  for (let i = 0; i < 20; i++) {
    if (Math.random() > 0.5) continue;
    const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    ctx.fillStyle = Math.random() > 0.85 ? hex : '#8B7766';
    ctx.globalAlpha = Math.random() > 0.85 ? 0.18 : 0.06;
    ctx.fillText(snippet, 8, i * 24 + 12);
  }
  ctx.globalAlpha = 1;

  // Windows
  const cols = Math.max(3, Math.floor(width / 2.5));
  const rows = Math.max(6, Math.floor(height / 4));
  const cellW = 240 / cols;
  const cellH = 480 / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const wx = 8 + col * cellW + 2;
      const wy = 16 + row * cellH + 2;
      const ww = cellW * 0.6;
      const wh = cellH * 0.5;
      if (Math.random() > 0.6) {
        ctx.fillStyle = Math.random() > 0.7 ? hex : '#CCBB99';
        ctx.globalAlpha = 0.06 + Math.random() * 0.14;
        ctx.fillRect(wx, wy, ww, wh);
        ctx.strokeStyle = hex;
        ctx.globalAlpha = 0.08;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(wx, wy, ww, wh);
      } else {
        ctx.fillStyle = '#BBAA99';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(wx, wy, ww, wh);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Accent bands
  for (let b = 0; b < 3; b++) {
    const by = 120 + b * 130 + Math.random() * 40;
    ctx.fillStyle = hex;
    ctx.globalAlpha = 0.06;
    ctx.fillRect(0, by, 256, 2);
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
