'use client';

import { useCallback } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ═══════════════════════════════════════
//  SVG ANIME ILLUSTRATION: Girls Together
// ═══════════════════════════════════════
function GirlsTogetherSVG() {
  return (
    <svg viewBox="0 0 500 400" className="w-full max-w-md rounded-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(255,0,102,0.15))' }}>
      <defs>
        <radialGradient id="gt_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#050510" />
        </radialGradient>
        <filter id="gt_glow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="gt_soft"><feGaussianBlur stdDeviation="1.5" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="gt_hair_eva" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4E0" /><stop offset="100%" stopColor="#006677" /></linearGradient>
        <linearGradient id="gt_hair_suy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00DD88" /><stop offset="100%" stopColor="#005533" /></linearGradient>
        <linearGradient id="gt_hair_ally_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF3388" /><stop offset="100%" stopColor="#880033" /></linearGradient>
      </defs>
      <rect width="500" height="400" fill="url(#gt_bg)" rx="12" />
      {/* Stars */}
      {Array.from({length: 40}).map((_, i) => <circle key={i} cx={(i*67+30)%490} cy={(i*41+10)%200} r={0.5+i%3*0.4} fill="#fff" opacity={0.2+i%4*0.15} />)}
      {/* Holographic ground line */}
      <line x1="50" y1="340" x2="450" y2="340" stroke="#1A0E0E" strokeWidth="1" opacity="0.15" />
      <line x1="80" y1="342" x2="420" y2="342" stroke="#FF61D8" strokeWidth="0.5" opacity="0.1" />

      {/* ── EVA (Center-Left) ── */}
      <g transform="translate(150, 100)">
        {/* Hair flowing */}
        <path d="M-5,-35 C-25,-30 -35,10 -30,70 C-28,85 -22,95 -18,100" fill="none" stroke="url(#gt_hair_eva)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        <path d="M5,-35 C25,-30 35,10 30,70 C28,85 22,95 18,100" fill="none" stroke="url(#gt_hair_eva)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        <path d="M-15,-30 C-18,-10 -20,20 -25,60" fill="none" stroke="#00B8CC" strokeWidth="4" opacity="0.5" />
        {/* Head */}
        <ellipse cx="0" cy="-5" rx="22" ry="26" fill="#2a2035" stroke="#00D4E0" strokeWidth="1.5" />
        {/* Eyes — large anime style */}
        <ellipse cx="-8" cy="-8" rx="6" ry="7" fill="#001520" />
        <ellipse cx="-8" cy="-8" rx="5" ry="6" fill="#00CCDD" opacity="0.7" />
        <circle cx="-6" cy="-10" r="2" fill="#fff" opacity="0.9" />
        <circle cx="-10" cy="-7" r="1" fill="#fff" opacity="0.5" />
        <ellipse cx="8" cy="-8" rx="6" ry="7" fill="#001520" />
        <ellipse cx="8" cy="-8" rx="5" ry="6" fill="#00CCDD" opacity="0.7" />
        <circle cx="10" cy="-10" r="2" fill="#fff" opacity="0.9" />
        <circle cx="6" cy="-7" r="1" fill="#fff" opacity="0.5" />
        {/* Eyebrows */}
        <path d="M-14,-17 Q-8,-20 -2,-17" fill="none" stroke="#00D4E0" strokeWidth="1.2" />
        <path d="M2,-17 Q8,-20 14,-17" fill="none" stroke="#00D4E0" strokeWidth="1.2" />
        {/* Nose + Mouth */}
        <path d="M0,-1 L-1,3" fill="none" stroke="#00AACC" strokeWidth="0.8" opacity="0.5" />
        <path d="M-5,8 Q0,12 5,8" fill="none" stroke="#FF88AA" strokeWidth="1.2" />
        {/* Body — futuristic suit */}
        <path d="M-16,22 L-20,120 Q0,128 20,120 L16,22 Q0,18 -16,22Z" fill="#0a1a2a" stroke="#00D4E0" strokeWidth="1" opacity="0.9" />
        <line x1="0" y1="25" x2="0" y2="115" stroke="#00D4E0" strokeWidth="0.5" opacity="0.3" />
        {/* Suit glow lines */}
        <path d="M-12,40 L-8,45" stroke="#1A0E0E" strokeWidth="1" opacity="0.6" />
        <path d="M12,40 L8,45" stroke="#1A0E0E" strokeWidth="1" opacity="0.6" />
        <circle cx="0" cy="50" r="3" fill="#1A0E0E" opacity="0.15" filter="url(#gt_glow)" />
        {/* Arms */}
        <path d="M-16,30 Q-28,65 -22,90" fill="none" stroke="#00D4E0" strokeWidth="3" strokeLinecap="round" />
        <path d="M16,30 Q28,65 22,90" fill="none" stroke="#00D4E0" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <line x1="-8" y1="120" x2="-12" y2="180" stroke="#00AACC" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="120" x2="12" y2="180" stroke="#00AACC" strokeWidth="3" strokeLinecap="round" />
        {/* Label */}
        <text x="0" y="200" textAnchor="middle" fill="#1A0E0E" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.8">EVA</text>
      </g>

      {/* ── ALIADA A (Center) ── */}
      <g transform="translate(250, 90)">
        <path d="M-5,-38 C-30,-25 -28,20 -22,80" fill="none" stroke="url(#gt_hair_suy)" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <path d="M5,-38 C30,-25 28,20 22,80" fill="none" stroke="url(#gt_hair_suy)" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="0" cy="-5" rx="22" ry="26" fill="#1a2520" stroke="#00DD88" strokeWidth="1.5" />
        <ellipse cx="-8" cy="-8" rx="6" ry="7" fill="#001510" />
        <ellipse cx="-8" cy="-8" rx="5" ry="6" fill="#00CC77" opacity="0.7" />
        <circle cx="-6" cy="-10" r="2" fill="#fff" opacity="0.9" />
        <ellipse cx="8" cy="-8" rx="6" ry="7" fill="#001510" />
        <ellipse cx="8" cy="-8" rx="5" ry="6" fill="#00CC77" opacity="0.7" />
        <circle cx="10" cy="-10" r="2" fill="#fff" opacity="0.9" />
        <path d="M-14,-17 Q-8,-20 -2,-17" fill="none" stroke="#00DD88" strokeWidth="1.2" />
        <path d="M2,-17 Q8,-20 14,-17" fill="none" stroke="#00DD88" strokeWidth="1.2" />
        <path d="M0,-1 L-1,3" fill="none" stroke="#00AA66" strokeWidth="0.8" opacity="0.5" />
        <path d="M-5,8 Q0,12 5,8" fill="none" stroke="#FF88AA" strokeWidth="1.2" />
        <path d="M-16,22 L-20,125 Q0,133 20,125 L16,22 Q0,18 -16,22Z" fill="#0a201a" stroke="#00DD88" strokeWidth="1" />
        <line x1="0" y1="25" x2="0" y2="120" stroke="#00DD88" strokeWidth="0.5" opacity="0.3" />
        <circle cx="0" cy="50" r="3" fill="#00FF88" opacity="0.15" filter="url(#gt_glow)" />
        <path d="M-16,30 Q-30,70 -20,95" fill="none" stroke="#00DD88" strokeWidth="3" strokeLinecap="round" />
        <path d="M16,30 Q30,70 20,95" fill="none" stroke="#00DD88" strokeWidth="3" strokeLinecap="round" />
        <line x1="-8" y1="125" x2="-12" y2="190" stroke="#00AA66" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="125" x2="12" y2="190" stroke="#00AA66" strokeWidth="3" strokeLinecap="round" />
        <text x="0" y="210" textAnchor="middle" fill="#00FF88" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.8">ALIADA A</text>
      </g>

      {/* ── ALIADA B (Center-Right) ── */}
      <g transform="translate(350, 100)">
        <path d="M-5,-35 C-22,-28 -32,15 -28,75" fill="none" stroke="url(#gt_hair_ally_b)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        <path d="M5,-35 C22,-28 32,15 28,75" fill="none" stroke="url(#gt_hair_ally_b)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="0" cy="-5" rx="22" ry="26" fill="#251520" stroke="#FF3388" strokeWidth="1.5" />
        <ellipse cx="-8" cy="-8" rx="6" ry="7" fill="#150510" />
        <ellipse cx="-8" cy="-8" rx="5" ry="6" fill="#FF2277" opacity="0.7" />
        <circle cx="-6" cy="-10" r="2" fill="#fff" opacity="0.9" />
        <ellipse cx="8" cy="-8" rx="6" ry="7" fill="#150510" />
        <ellipse cx="8" cy="-8" rx="5" ry="6" fill="#FF2277" opacity="0.7" />
        <circle cx="10" cy="-10" r="2" fill="#fff" opacity="0.9" />
        <path d="M-14,-17 Q-8,-20 -2,-17" fill="none" stroke="#FF3388" strokeWidth="1.2" />
        <path d="M2,-17 Q8,-20 14,-17" fill="none" stroke="#FF3388" strokeWidth="1.2" />
        <path d="M0,-1 L-1,3" fill="none" stroke="#CC2266" strokeWidth="0.8" opacity="0.5" />
        <path d="M-5,8 Q0,12 5,8" fill="none" stroke="#FF88AA" strokeWidth="1.2" />
        <path d="M-16,22 L-20,120 Q0,128 20,120 L16,22 Q0,18 -16,22Z" fill="#200a15" stroke="#FF3388" strokeWidth="1" />
        <line x1="0" y1="25" x2="0" y2="115" stroke="#FF3388" strokeWidth="0.5" opacity="0.3" />
        <circle cx="0" cy="50" r="3" fill="#FF0066" opacity="0.15" filter="url(#gt_glow)" />
        <path d="M-16,30 Q-28,65 -22,90" fill="none" stroke="#FF3388" strokeWidth="3" strokeLinecap="round" />
        <path d="M16,30 Q28,65 22,90" fill="none" stroke="#FF3388" strokeWidth="3" strokeLinecap="round" />
        <line x1="-8" y1="120" x2="-12" y2="180" stroke="#CC2266" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="120" x2="12" y2="180" stroke="#CC2266" strokeWidth="3" strokeLinecap="round" />
        <text x="0" y="200" textAnchor="middle" fill="#FF0066" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.8">ALIADA B</text>
      </g>

      {/* Connection particles between them */}
      {[0,1,2,3,4,5].map(i => <circle key={`p${i}`} cx={180+i*30} cy={170+Math.sin(i*1.2)*15} r={1.5} fill={['#1A0E0E','#00FF88','#FF0066'][i%3]} opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${2+i*0.3}s`} repeatCount="indefinite" /></circle>)}
      {/* Dashed connection line */}
      <line x1="170" y1="200" x2="330" y2="200" stroke="#fff" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.12" />

      {/* Title */}
      <text x="250" y="370" textAnchor="middle" fill="#1A0E0E" fontSize="14" fontFamily="monospace" fontWeight="bold" filter="url(#gt_soft)" opacity="0.9">JUNTAS</text>
      <text x="250" y="388" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace" opacity="0.4">// memory_fragment_001</text>
    </svg>
  );
}

// ═══════════════════════════════════════
//  SVG ANIME ILLUSTRATION: Girls Fighting
// ═══════════════════════════════════════
function GirlsFightingSVG() {
  return (
    <svg viewBox="0 0 500 400" className="w-full max-w-md rounded-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(255,0,102,0.15))' }}>
      <defs>
        <radialGradient id="gf_bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a0510" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
        <filter id="gf_glow"><feGaussianBlur stdDeviation="4" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width="500" height="400" fill="url(#gf_bg)" rx="12" />
      {/* Tension energy background */}
      <circle cx="250" cy="200" r="120" fill="none" stroke="#FF0066" strokeWidth="0.5" opacity="0.08"><animate attributeName="r" values="100;140;100" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="250" cy="200" r="80" fill="none" stroke="#1A0E0E" strokeWidth="0.5" opacity="0.06"><animate attributeName="r" values="70;90;70" dur="2.5s" repeatCount="indefinite" /></circle>

      {/* ── EVA (Left, defensive pose) ── */}
      <g transform="translate(130, 100)">
        <path d="M-5,-35 C-25,-30 -35,10 -30,70" fill="none" stroke="#00D4E0" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <path d="M5,-35 C20,-25 25,5 20,50" fill="none" stroke="#00D4E0" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="0" cy="-5" rx="22" ry="26" fill="#1a2030" stroke="#00D4E0" strokeWidth="1.5" />
        {/* Sad/angry eyes */}
        <ellipse cx="-8" cy="-6" rx="5" ry="5.5" fill="#001520" />
        <ellipse cx="-8" cy="-6" rx="4" ry="4.5" fill="#00AACC" opacity="0.8" />
        <circle cx="-7" cy="-8" r="1.5" fill="#fff" opacity="0.8" />
        <ellipse cx="8" cy="-6" rx="5" ry="5.5" fill="#001520" />
        <ellipse cx="8" cy="-6" rx="4" ry="4.5" fill="#00AACC" opacity="0.8" />
        <circle cx="9" cy="-8" r="1.5" fill="#fff" opacity="0.8" />
        {/* Furrowed brows */}
        <path d="M-14,-14 L-2,-17" fill="none" stroke="#00D4E0" strokeWidth="1.5" />
        <path d="M2,-17 L14,-14" fill="none" stroke="#00D4E0" strokeWidth="1.5" />
        {/* Tight mouth */}
        <line x1="-4" y1="9" x2="4" y2="9" stroke="#CC8899" strokeWidth="1.2" />
        {/* Body */}
        <path d="M-16,22 L-18,120 Q0,126 18,120 L16,22Z" fill="#0a1a2a" stroke="#00D4E0" strokeWidth="1" />
        {/* Arm raised defensively */}
        <path d="M-16,30 Q-35,40 -40,20 L-38,15" fill="none" stroke="#00D4E0" strokeWidth="3" strokeLinecap="round" />
        <path d="M16,30 Q25,50 20,80" fill="none" stroke="#00D4E0" strokeWidth="3" strokeLinecap="round" />
        <line x1="-8" y1="120" x2="-14" y2="185" stroke="#00AACC" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="120" x2="14" y2="185" stroke="#00AACC" strokeWidth="3" strokeLinecap="round" />
        {/* Tear */}
        <path d="M-14,-2 Q-15,3 -13,6" fill="none" stroke="#1A0E0E" strokeWidth="1" opacity="0.5" />
      </g>

      {/* ── ALIADA B (Right, aggressive pose) ── */}
      <g transform="translate(370, 100)">
        <path d="M5,-35 C25,-28 38,15 30,70" fill="none" stroke="#FF3388" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <path d="M-5,-35 C-20,-25 -25,5 -20,50" fill="none" stroke="#FF3388" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="0" cy="-5" rx="22" ry="26" fill="#251520" stroke="#FF3388" strokeWidth="1.5" />
        {/* Angry eyes */}
        <ellipse cx="-8" cy="-6" rx="5" ry="4.5" fill="#150510" />
        <ellipse cx="-8" cy="-6" rx="4" ry="3.5" fill="#FF1155" opacity="0.8" />
        <circle cx="-7" cy="-7" r="1.5" fill="#fff" opacity="0.8" />
        <ellipse cx="8" cy="-6" rx="5" ry="4.5" fill="#150510" />
        <ellipse cx="8" cy="-6" rx="4" ry="3.5" fill="#FF1155" opacity="0.8" />
        <circle cx="9" cy="-7" r="1.5" fill="#fff" opacity="0.8" />
        {/* Angry brows */}
        <path d="M-14,-17 L-2,-13" fill="none" stroke="#FF3388" strokeWidth="1.8" />
        <path d="M2,-13 L14,-17" fill="none" stroke="#FF3388" strokeWidth="1.8" />
        {/* Shouting mouth */}
        <ellipse cx="0" cy="10" rx="5" ry="4" fill="#220010" stroke="#FF3388" strokeWidth="0.8" />
        {/* Body */}
        <path d="M-16,22 L-18,120 Q0,126 18,120 L16,22Z" fill="#200a15" stroke="#FF3388" strokeWidth="1" />
        {/* Arm pointing forward aggressively */}
        <path d="M16,30 Q40,35 55,25" fill="none" stroke="#FF3388" strokeWidth="3" strokeLinecap="round" />
        <path d="M-16,30 Q-25,50 -20,80" fill="none" stroke="#FF3388" strokeWidth="3" strokeLinecap="round" />
        <line x1="-8" y1="120" x2="-14" y2="185" stroke="#CC2266" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="120" x2="14" y2="185" stroke="#CC2266" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Lightning / conflict energy between them */}
      <g filter="url(#gf_glow)" opacity="0.7">
        <path d="M200,170 L220,185 L210,200 L235,215 L220,230 L250,250" fill="none" stroke="#FF0066" strokeWidth="2.5"><animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" /></path>
        <path d="M300,170 L280,185 L290,200 L265,215 L280,230 L250,250" fill="none" stroke="#1A0E0E" strokeWidth="2.5"><animate attributeName="opacity" values="0.3;1;0.3" dur="0.7s" repeatCount="indefinite" /></path>
      </g>
      {/* Broken heart */}
      <g transform="translate(250, 200)" opacity="0.5">
        <path d="M0,-8 C-4,-14 -12,-14 -12,-6 C-12,2 0,10 0,10 C0,10 12,2 12,-6 C12,-14 4,-14 0,-8Z" fill="#FF0066" opacity="0.4" />
        <line x1="0" y1="-12" x2="0" y2="12" stroke="#1a0510" strokeWidth="2" />
      </g>

      <text x="250" y="370" textAnchor="middle" fill="#FF0066" fontSize="14" fontFamily="monospace" fontWeight="bold" opacity="0.9">LA PELEA</text>
      <text x="250" y="388" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace" opacity="0.4">// memory_fragment_002</text>
    </svg>
  );
}

// ═══════════════════════════════════════
//  SVG ANIME ILLUSTRATION: Eva + Grandpa
// ═══════════════════════════════════════
function EvaGrandpaSVG() {
  return (
    <svg viewBox="0 0 500 400" className="w-full max-w-md rounded-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(255,187,51,0.15))' }}>
      <defs>
        <radialGradient id="eg_bg" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#1a1408" />
          <stop offset="100%" stopColor="#080605" />
        </radialGradient>
        <filter id="eg_glow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="eg_warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFCC66" stopOpacity="0.1" /><stop offset="100%" stopColor="#FF8800" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width="500" height="400" fill="url(#eg_bg)" rx="12" />
      {/* Warm ambient glow */}
      <ellipse cx="250" cy="250" rx="180" ry="140" fill="url(#eg_warm)" />
      {/* Stars */}
      {Array.from({length: 25}).map((_, i) => <circle key={i} cx={(i*53+20)%490} cy={(i*37+5)%150} r={0.5+i%2*0.3} fill="#FFDDAA" opacity={0.15+i%3*0.1} />)}

      {/* ── Young Eva (smaller, left) ── */}
      <g transform="translate(175, 130) scale(0.85)">
        <path d="M-4,-30 C-18,-25 -25,8 -22,55" fill="none" stroke="#00D4E0" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        <path d="M4,-30 C18,-25 25,8 22,55" fill="none" stroke="#00D4E0" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="0" cy="-3" rx="18" ry="22" fill="#1a2030" stroke="#00D4E0" strokeWidth="1.2" />
        {/* Happy eyes (looking up at grandpa) */}
        <ellipse cx="-7" cy="-5" rx="4.5" ry="5.5" fill="#001520" />
        <ellipse cx="-7" cy="-5" rx="3.5" ry="4.5" fill="#00CCDD" opacity="0.8" />
        <circle cx="-5" cy="-7" r="1.8" fill="#fff" opacity="0.9" />
        <ellipse cx="7" cy="-5" rx="4.5" ry="5.5" fill="#001520" />
        <ellipse cx="7" cy="-5" rx="3.5" ry="4.5" fill="#00CCDD" opacity="0.8" />
        <circle cx="9" cy="-7" r="1.8" fill="#fff" opacity="0.9" />
        {/* Sparkle eyes - happy */}
        <circle cx="-5" cy="-4" r="0.8" fill="#fff" opacity="0.6" />
        <circle cx="9" cy="-4" r="0.8" fill="#fff" opacity="0.6" />
        {/* Big smile */}
        <path d="M-6,7 Q0,14 6,7" fill="none" stroke="#FF99AA" strokeWidth="1.5" />
        {/* Rosy cheeks */}
        <ellipse cx="-12" cy="3" rx="4" ry="2.5" fill="#FF6699" opacity="0.12" />
        <ellipse cx="12" cy="3" rx="4" ry="2.5" fill="#FF6699" opacity="0.12" />
        <path d="M-12,20 L-14,95 Q0,102 14,95 L12,20Z" fill="#0a1a2a" stroke="#00D4E0" strokeWidth="0.8" />
        <path d="M-12,28 Q-20,50 -15,70" fill="none" stroke="#00D4E0" strokeWidth="2.5" strokeLinecap="round" />
        {/* Arm reaching toward screen */}
        <path d="M12,28 Q22,45 35,50" fill="none" stroke="#00D4E0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-6" y1="95" x2="-9" y2="145" stroke="#00AACC" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6" y1="95" x2="9" y2="145" stroke="#00AACC" strokeWidth="2.5" strokeLinecap="round" />
        <text x="0" y="165" textAnchor="middle" fill="#1A0E0E" fontSize="9" fontFamily="monospace" opacity="0.7">EVA</text>
      </g>

      {/* ── GRANDPA (right, taller) ── */}
      <g transform="translate(320, 95)">
        {/* Head — warm tones */}
        <ellipse cx="0" cy="-2" rx="24" ry="28" fill="#2a2018" stroke="#FFBB33" strokeWidth="1.5" />
        {/* Glasses */}
        <rect x="-16" y="-10" width="13" height="11" rx="2" fill="none" stroke="#FFCC55" strokeWidth="1.2" />
        <rect x="3" y="-10" width="13" height="11" rx="2" fill="none" stroke="#FFCC55" strokeWidth="1.2" />
        <line x1="-3" y1="-4" x2="3" y2="-4" stroke="#FFCC55" strokeWidth="0.8" />
        {/* Eyes behind glasses — kind */}
        <circle cx="-9.5" cy="-4" r="2.5" fill="#FFBB33" opacity="0.6" />
        <circle cx="-9.5" cy="-5" r="1" fill="#fff" opacity="0.7" />
        <circle cx="9.5" cy="-4" r="2.5" fill="#FFBB33" opacity="0.6" />
        <circle cx="9.5" cy="-5" r="1" fill="#fff" opacity="0.7" />
        {/* Warm smile */}
        <path d="M-7,10 Q0,17 7,10" fill="none" stroke="#DDAA66" strokeWidth="1.5" />
        {/* Wrinkles — wisdom */}
        <path d="M-16,2 Q-18,5 -16,8" fill="none" stroke="#AA8855" strokeWidth="0.5" opacity="0.4" />
        <path d="M16,2 Q18,5 16,8" fill="none" stroke="#AA8855" strokeWidth="0.5" opacity="0.4" />
        {/* Beard */}
        <path d="M-15,15 Q-10,40 0,45 Q10,40 15,15" fill="rgba(180,160,130,0.15)" stroke="#CCAA77" strokeWidth="0.5" opacity="0.4" />
        {/* Body — lab coat */}
        <path d="M-20,30 L-24,140 Q0,148 24,140 L20,30Z" fill="rgba(255,255,255,0.05)" stroke="#FFBB33" strokeWidth="1" />
        <line x1="0" y1="35" x2="0" y2="135" stroke="#FFBB33" strokeWidth="0.3" opacity="0.3" />
        {/* Arm guiding Eva */}
        <path d="M-20,40 Q-35,70 -30,100" fill="none" stroke="#DDAA55" strokeWidth="3" strokeLinecap="round" />
        <path d="M20,40 Q30,55 25,75" fill="none" stroke="#DDAA55" strokeWidth="3" strokeLinecap="round" />
        <line x1="-10" y1="140" x2="-14" y2="200" stroke="#AA8844" strokeWidth="3" strokeLinecap="round" />
        <line x1="10" y1="140" x2="14" y2="200" stroke="#AA8844" strokeWidth="3" strokeLinecap="round" />
        <text x="0" y="220" textAnchor="middle" fill="#FFBB33" fontSize="9" fontFamily="monospace" opacity="0.7">ABUELO</text>
      </g>

      {/* Computer between them */}
      <g transform="translate(232, 290)">
        <rect x="-25" y="-18" width="50" height="32" rx="2" fill="rgba(255,0,102,0.04)" stroke="#FFBB33" strokeWidth="1" />
        <rect x="-22" y="-15" width="44" height="26" rx="1" fill="#0a0a15" />
        {/* Code on screen */}
        <text x="-18" y="-4" fill="#00FF88" fontSize="5" fontFamily="monospace">print("hola")</text>
        <text x="-18" y="2" fill="#00AAFF" fontSize="5" fontFamily="monospace"># mi primer</text>
        <text x="-18" y="8" fill="#00AAFF" fontSize="5" fontFamily="monospace"># programa</text>
        {/* Screen glow */}
        <rect x="-22" y="-15" width="44" height="26" rx="1" fill="none" stroke="#00FF88" strokeWidth="0.3" opacity="0.3" />
      </g>

      <text x="250" y="365" textAnchor="middle" fill="#FFBB33" fontSize="14" fontFamily="monospace" fontWeight="bold" filter="url(#eg_glow)" opacity="0.9">EL ABUELO</text>
      <text x="250" y="385" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace" opacity="0.4">// memory_fragment_003</text>
    </svg>
  );
}

// ═══════════════════════════════════════
//  MAIN OVERLAY COMPONENT
// ═══════════════════════════════════════
export default function TokenMemoryOverlay() {
  const currentTokenData = useGameStore((s) => s.currentTokenData);
  const setGameState = useGameStore((s) => s.setGameState);

  const handleClose = useCallback(() => {
    useGameStore.setState({ currentTokenData: null });
    setGameState(GameStates.PLAYING);
  }, [setGameState]);

  if (!currentTokenData) return null;

  const IllustrationMap = {
    girls_together: GirlsTogetherSVG,
    girls_fighting: GirlsFightingSVG,
    eva_grandpa: EvaGrandpaSVG,
  };
  const Illustration = IllustrationMap[currentTokenData.image];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(255,240,235,0.95)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-md mx-4 text-center animate-scale-in">
        <div className="mb-4">
          <span className="font-orbitron text-lg tracking-widest" style={{ color: '#FFBB33', textShadow: '0 0 12px rgba(255,187,51,0.4)' }}>
            🔮 {currentTokenData.title}
          </span>
        </div>
        <div className="mb-6 flex justify-center">
          {Illustration && <Illustration />}
        </div>
        <p className="font-rajdhani text-base mb-6 leading-relaxed" style={{ color: 'var(--dark)', opacity: 0.8 }}>
          {currentTokenData.text}
        </p>
        <button onClick={handleClose} className="px-8 py-3 rounded font-orbitron text-xs tracking-widest cursor-pointer transition-all hover:shadow-lg"
          style={{ background: 'rgba(255,0,102,0.04)', border: '1px solid rgba(255,0,102,0.3)', color: 'var(--neon-magenta)' }}>
          CONTINUAR
        </button>
        <div className="mt-3 font-sharetm text-sm" style={{ color: '#FFBB33', opacity: 0.6 }}>+150 monedas</div>
      </div>
    </div>
  );
}
