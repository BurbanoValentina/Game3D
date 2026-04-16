// ══════════════════════════════════════════════════════
//  AUDIO MANAGER — Multi-Scene Cyberpunk Music Engine
//  Scene-specific tracks: menu, tutorial, narration,
//  gameplay, map, error, memory, victory, gameover
// ══════════════════════════════════════════════════════

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isPlaying = false;
    this.initialized = false;
    this.musicEnabled = true;
    this.currentScene = null;
    this.sceneNodes = [];
    this.beatInterval = null;
    this.currentBeat = 0;
  }

  async init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.35;
      this.musicGain.connect(this.masterGain);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -20;
      this.compressor.knee.value = 10;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.005;
      this.compressor.release.value = 0.1;
      this.compressor.connect(this.musicGain);
      this.initialized = true;
    } catch (err) {
      console.warn('[AudioManager] Web Audio not available:', err);
    }
  }

  async resume() {
    if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
  }

  // ═══════════════════════════════════════════
  //  SCENE MUSIC SYSTEM
  // ═══════════════════════════════════════════
  playScene(sceneName) {
    if (!this.ctx || !this.musicEnabled) return;
    if (this.currentScene === sceneName) return;
    this._stopScene(0.8);
    this.currentScene = sceneName;
    this.isPlaying = true;
    const fn = {
      menu: () => this._menuMusic(),
      tutorial: () => this._tutorialMusic(),
      narration: () => this._narrationMusic(),
      gameplay: () => this._gameplayMusic(),
      map: () => this._mapMusic(),
      error: () => this._errorMusic(),
      memory: () => this._memoryMusic(),
      victory: () => this._victoryMusic(),
      gameover: () => this._gameoverMusic(),
    }[sceneName];
    if (fn) fn();
  }

  _stopScene(fade = 0.5) {
    if (this.beatInterval) { clearInterval(this.beatInterval); this.beatInterval = null; }
    const t = this.ctx?.currentTime || 0;
    this.sceneNodes.forEach(({ osc, gain, source }) => {
      try {
        if (gain) gain.gain.linearRampToValueAtTime(0, t + fade);
        setTimeout(() => { try { if (osc) osc.stop(); } catch(e) {} try { if (source) source.stop(); } catch(e) {} }, (fade + 0.2) * 1000);
      } catch (e) {}
    });
    this.sceneNodes = [];
  }

  // ─── Helpers ───
  _pad(freq, type, vol, fFreq = 400) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = type; osc.frequency.value = freq;
    filter.type = 'lowpass'; filter.frequency.value = fFreq; filter.Q.value = 1;
    gain.gain.value = 0;
    osc.connect(filter); filter.connect(gain); gain.connect(this.compressor);
    osc.start(); gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 2);
    this.sceneNodes.push({ osc, gain });
    return { osc, gain, filter };
  }

  _lfo(tGain, rate, depth) {
    const lfo = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    lfo.type = 'sine'; lfo.frequency.value = rate; g.gain.value = depth;
    lfo.connect(g); g.connect(tGain.gain); lfo.start();
    this.sceneNodes.push({ osc: lfo, gain: g });
  }

  _note(freq, type, vol, dur, delay = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain); gain.connect(this.compressor);
    osc.start(t); osc.stop(t + dur + 0.1);
  }

  // ═══════════════════════════════════════════
  //  MENU — warm, welcoming, gentle arpeggios
  // ═══════════════════════════════════════════
  _menuMusic() {
    this._pad(130.81, 'sine', 0.06, 300);
    this._pad(164.81, 'sine', 0.04, 280);
    this._pad(196, 'triangle', 0.03, 350);
    const s = this._pad(131.1, 'sine', 0.03, 250);
    this._lfo(s.gain, 0.08, 0.015);
    const arp = [261.63, 329.63, 392, 523.25, 392, 329.63];
    let i = 0;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      this._note(arp[i % arp.length], 'sine', 0.025, 0.6);
      i++;
    }, 800);
  }

  // ═══════════════════════════════════════════
  //  TUTORIAL — curious, digital, playful
  // ═══════════════════════════════════════════
  _tutorialMusic() {
    this._pad(146.83, 'sine', 0.05, 350);
    this._pad(220, 'sine', 0.04, 320);
    const s = this._pad(880, 'sine', 0.008, 800);
    this._lfo(s.gain, 0.15, 0.005);
    const pat = [293.66, 0, 369.99, 0, 440, 0, 369.99, 293.66, 0, 0, 440, 0, 523.25, 0, 440, 369.99];
    let i = 0;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      const n = pat[i % pat.length];
      if (n) this._note(n, 'triangle', 0.02, 0.2);
      i++;
    }, (60 / 110) * 500);
  }

  // ═══════════════════════════════════════════
  //  NARRATION — dark suspense, heartbeat
  // ═══════════════════════════════════════════
  _narrationMusic() {
    this._pad(55, 'sine', 0.07, 200);
    this._pad(110, 'sine', 0.05, 250);
    this._pad(130.81, 'triangle', 0.03, 220);
    const d = this._pad(233.08, 'sine', 0.015, 350);
    this._lfo(d.gain, 0.04, 0.008);
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      this._note(55, 'sine', 0.06, 0.4);
      setTimeout(() => this._note(55, 'sine', 0.04, 0.3), 200);
    }, 2000);
  }

  // ═══════════════════════════════════════════
  //  GAMEPLAY — intense cyberpunk beat
  // ═══════════════════════════════════════════
  _gameplayMusic() {
    this._pad(55, 'sine', 0.08, 350);
    this._pad(82.41, 'sine', 0.05, 300);
    this._pad(110, 'triangle', 0.03, 400);
    const s = this._pad(55.3, 'sine', 0.04, 280);
    this._lfo(s.gain, 0.05, 0.02);
    const sh = this._pad(880, 'sine', 0.012, 2000);
    this._lfo(sh.gain, 0.12, 0.008);
    this.currentBeat = 0;
    const ms = (60 / 85) * 500;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      this._gameBeat(this.currentBeat);
      this.currentBeat = (this.currentBeat + 1) % 32;
    }, ms);
  }

  _gameBeat(b) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (b % 8 === 0) this._kick(t);
    if (b % 2 === 0) this._hat(t, b % 4 === 0 ? 0.06 : 0.03);
    if (b % 8 === 4) this._snare(t);
    const bass = [55,0,0,0,55,0,65.41,0,55,0,0,0,82.41,0,73.42,0,55,0,0,0,55,0,65.41,0,55,0,0,0,73.42,0,82.41,0];
    if (bass[b]) this._bass(t, bass[b]);
    if (b >= 16) {
      const mel = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,440,0,523,0,659,0,523,0,587,0,523,0,440,0,0,0];
      if (mel[b]) this._synth(t, mel[b]);
    }
    if (b >= 8 && b % 4 === 2) {
      const ar = [220, 261.63, 329.63, 392, 440, 523.25];
      this._arp(t, ar[Math.floor(Math.random() * ar.length)]);
    }
  }

  // ═══════════════════════════════════════════
  //  MAP — mellow, explorative
  // ═══════════════════════════════════════════
  _mapMusic() {
    this._pad(87.31, 'sine', 0.06, 300);
    this._pad(130.81, 'sine', 0.04, 350);
    this._pad(174.61, 'triangle', 0.03, 280);
    const s = this._pad(349.23, 'sine', 0.015, 500);
    this._lfo(s.gain, 0.1, 0.008);
    const pat = [174.61, 0, 220, 0, 261.63, 0, 220, 0, 174.61, 0, 146.83, 0, 174.61, 0, 0, 0];
    let i = 0;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      const n = pat[i % pat.length];
      if (n) this._note(n, 'sine', 0.02, 0.4);
      if (i % 4 === 0) this._hat(this.ctx.currentTime, 0.02);
      i++;
    }, 400);
  }

  // ═══════════════════════════════════════════
  //  ERROR — intense alarm, harsh
  // ═══════════════════════════════════════════
  _errorMusic() {
    this._pad(41.2, 'sawtooth', 0.08, 180);
    this._pad(55, 'square', 0.04, 150);
    this._pad(466.16, 'sawtooth', 0.015, 800);
    this.currentBeat = 0;
    const ms = (60 / 140) * 500;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      const b = this.currentBeat % 16;
      const t = this.ctx.currentTime;
      if (b % 4 === 0 || b % 4 === 1) this._kick(t);
      this._hat(t, 0.05);
      if (b % 4 === 2 || b % 4 === 3) this._snare(t);
      if (b % 8 === 0) { this._note(880, 'square', 0.04, 0.15); this._note(932.33, 'square', 0.03, 0.1, 0.08); }
      this.currentBeat++;
    }, ms);
  }

  // ═══════════════════════════════════════════
  //  MEMORY — ethereal, emotional, suspenseful
  // ═══════════════════════════════════════════
  _memoryMusic() {
    this._pad(73.42, 'sine', 0.06, 280);
    this._pad(110, 'sine', 0.04, 320);
    this._pad(146.83, 'triangle', 0.03, 350);
    const g = this._pad(587.33, 'sine', 0.015, 600);
    this._lfo(g.gain, 0.06, 0.008);
    const notes = [293.66, 349.23, 440, 523.25, 440, 349.23, 293.66, 261.63];
    let i = 0;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      this._note(notes[i % notes.length], 'sine', 0.025, 1.2);
      i++;
    }, 1500);
  }

  // ═══════════════════════════════════════════
  //  VICTORY / GAMEOVER
  // ═══════════════════════════════════════════
  _victoryMusic() {
    this._pad(130.81, 'sine', 0.06, 400);
    this._pad(164.81, 'triangle', 0.04, 380);
    this._pad(196, 'sine', 0.035, 350);
    [261.63, 329.63, 392, 523.25, 659.26, 783.99, 1046.5].forEach((f, i) => this._note(f, 'sine', 0.03, 1.5, i * 0.3));
    const arp = [523.25, 659.26, 783.99, 1046.5, 783.99, 659.26];
    let i = 0;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      this._note(arp[i % arp.length], 'triangle', 0.018, 0.5);
      i++;
    }, 600);
  }

  _gameoverMusic() {
    this._pad(55, 'sine', 0.07, 180);
    this._pad(65.41, 'sine', 0.04, 200);
    const d = this._pad(116.54, 'sine', 0.02, 250);
    this._lfo(d.gain, 0.03, 0.01);
    [440, 415.3, 392, 349.23, 329.63, 293.66, 261.63, 246.94].forEach((f, i) => this._note(f, 'sine', 0.02, 2, i * 0.8));
  }

  // ═══════════════════════════════════════════
  //  DRUM INSTRUMENTS
  // ═══════════════════════════════════════════
  _kick(t) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.12);
    g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g); g.connect(this.compressor); o.start(t); o.stop(t + 0.35);
  }
  _hat(t, v) {
    const sz = this.ctx.sampleRate * 0.04, buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
    s.buffer = buf; f.type = 'highpass'; f.frequency.value = 8000;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(this.compressor); s.start(t);
  }
  _snare(t) {
    const sz = this.ctx.sampleRate * 0.1, buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
    const s = this.ctx.createBufferSource(), ng = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
    s.buffer = buf; f.type = 'highpass'; f.frequency.value = 2000;
    ng.gain.setValueAtTime(0.2, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    s.connect(f); f.connect(ng); ng.connect(this.compressor); s.start(t);
    const o = this.ctx.createOscillator(), og = this.ctx.createGain();
    o.type = 'triangle'; o.frequency.value = 180;
    og.gain.setValueAtTime(0.15, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(og); og.connect(this.compressor); o.start(t); o.stop(t + 0.1);
  }
  _bass(t, freq) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.value = freq; f.type = 'lowpass'; f.frequency.value = 200; f.Q.value = 8;
    g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(f); f.connect(g); g.connect(this.compressor); o.start(t); o.stop(t + 0.35);
  }
  _synth(t, freq) {
    const o1 = this.ctx.createOscillator(), o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
    o1.type = 'square'; o1.frequency.value = freq; o2.type = 'sawtooth'; o2.frequency.value = freq * 1.003;
    f.type = 'lowpass'; f.frequency.value = 1500; f.Q.value = 3;
    g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o1.connect(f); o2.connect(f); f.connect(g); g.connect(this.compressor);
    o1.start(t); o2.start(t); o1.stop(t + 0.4); o2.stop(t + 0.4);
  }
  _arp(t, freq) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.03, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g); g.connect(this.compressor); o.start(t); o.stop(t + 0.25);
  }

  // ═══════════════════════════════════════════
  //  SOUND EFFECTS
  // ═══════════════════════════════════════════
  playBootBeep(i = 0) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'square'; o.frequency.value = [440,554,659,880,1108,440,330,220][i % 8];
    g.gain.value = 0.08; g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    o.connect(g); g.connect(this.sfxGain); o.start(); o.stop(this.ctx.currentTime + 0.15);
  }
  playGlitch() {
    if (!this.ctx) return;
    const sz = this.ctx.sampleRate * 0.08, buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
    s.buffer = buf; f.type = 'highpass'; f.frequency.value = 1000 + Math.random() * 3000;
    g.gain.value = 0.15; g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    s.connect(f); f.connect(g); g.connect(this.sfxGain); s.start();
  }
  playPuzzleSolve() {
    if (!this.ctx) return;
    [523,659,784,1047].forEach((freq, i) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.15 + 0.4);
      o.connect(g); g.connect(this.sfxGain);
      o.start(this.ctx.currentTime + i * 0.15); o.stop(this.ctx.currentTime + i * 0.15 + 0.5);
    });
  }
  playKeyObtained() {
    if (!this.ctx) return;
    [440,554,659,880,1108,1318,1760].forEach((freq, i) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = i < 4 ? 'sine' : 'triangle'; o.frequency.value = freq;
      g.gain.value = 0; g.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.8);
      o.connect(g); g.connect(this.sfxGain);
      o.start(this.ctx.currentTime + i * 0.12); o.stop(this.ctx.currentTime + i * 0.12 + 1);
    });
  }
  playInteract() {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine'; o.frequency.value = 660; g.gain.value = 0.1;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    o.connect(g); g.connect(this.sfxGain); o.start(); o.stop(this.ctx.currentTime + 0.1);
  }
  playRocketLaunch() {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(60, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.5);
    g.gain.setValueAtTime(0.08, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 1);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2);
    o.connect(g); g.connect(this.sfxGain); o.start(); o.stop(this.ctx.currentTime + 2.5);
  }
  playExplosion() {
    if (!this.ctx) return;
    const sz = this.ctx.sampleRate * 0.5, buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
    const n = this.ctx.createBufferSource(); n.buffer = buf;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.3, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    n.connect(g); g.connect(this.sfxGain); n.start();
  }
  playTimerWarning() {
    if (!this.ctx) return;
    this._note(880, 'square', 0.06, 0.12);
    setTimeout(() => this._note(880, 'square', 0.06, 0.12), 150);
  }
  playCorrectAnswer() {
    if (!this.ctx) return;
    [523,659,784].forEach((f, i) => this._note(f, 'sine', 0.08, 0.3, i * 0.1));
  }

  // ─── Legacy ───
  startMusic() { this.playScene('gameplay'); }
  startAmbientDrone() { this.playScene('gameplay'); }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled && this.currentScene) {
      const s = this.currentScene; this.currentScene = null; this.playScene(s);
    } else if (!this.musicEnabled) this._stopScene(0.5);
    return this.musicEnabled;
  }
  stopMusic() { this._stopScene(1); this.isPlaying = false; this.currentScene = null; }
  setMasterVolume(v) { if (this.masterGain) this.masterGain.gain.value = v / 100; }
  setMusicVolume(v) { if (this.musicGain) this.musicGain.gain.value = (v / 100) * 0.4; }
  setSfxVolume(v) { if (this.sfxGain) this.sfxGain.gain.value = v / 100; }
  stopAll() { this.stopMusic(); }
  dispose() { this.stopAll(); if (this.ctx) this.ctx.close().catch(() => {}); this.initialized = false; }
}

const audioManager = new AudioManager();
export default audioManager;
