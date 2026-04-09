// ══════════════════════════════════════════════════════
//  AUDIO MANAGER
//  Sonido ambiental cyberpunk con Web Audio API
//  Sintetizadores oscuros, drones, efectos glitch
// ══════════════════════════════════════════════════════

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.activeOscillators = [];
    this.activeSources = [];
    this.isPlaying = false;
    this.initialized = false;
  }

  // ─── INITIALIZE ───
  async init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.4;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch (err) {
      console.warn('[AudioManager] Web Audio not available:', err);
    }
  }

  // ─── RESUME CONTEXT (needed after user gesture) ───
  async resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  // ─── AMBIENT DRONE (Dark Cyberpunk Pad) ───
  startAmbientDrone() {
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;

    // Base drone - low frequency pad
    const drone1 = this._createDrone(55, 'sine', 0.12);     // A1
    const drone2 = this._createDrone(82.41, 'sine', 0.08);  // E2
    const drone3 = this._createDrone(110, 'triangle', 0.05); // A2

    // Detuned layer for uneasiness
    const detune1 = this._createDrone(55.5, 'sine', 0.06);
    const detune2 = this._createDrone(82.8, 'sine', 0.04);

    // High shimmer - holographic overtone
    const shimmer = this._createShimmer();

    // LFO for movement
    this._createLFO(drone1.gainNode, 0.05, 0.03);
    this._createLFO(drone2.gainNode, 0.07, 0.02);
    this._createLFO(shimmer.gainNode, 0.12, 0.04);

    this.activeOscillators.push(
      drone1, drone2, drone3, detune1, detune2, shimmer
    );
  }

  _createDrone(freq, type, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 400 + Math.random() * 200;
    filter.Q.value = 1;

    gain.gain.value = 0;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start();

    // Fade in
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 3);

    return { osc, gainNode: gain, filter };
  }

  _createShimmer() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = 880;

    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 5;

    gain.gain.value = 0;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start();
    gain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 5);

    return { osc, gainNode: gain, filter };
  }

  _createLFO(targetGain, rate, depth) {
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    lfo.type = 'sine';
    lfo.frequency.value = rate;
    lfoGain.gain.value = depth;

    lfo.connect(lfoGain);
    lfoGain.connect(targetGain.gain);

    lfo.start();

    this.activeOscillators.push({ osc: lfo, gainNode: lfoGain });
  }

  // ─── BOOT SOUND EFFECT ───
  playBootBeep(index = 0) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freqs = [440, 554, 659, 880, 1108, 440, 330, 220];
    osc.type = 'square';
    osc.frequency.value = freqs[index % freqs.length];

    gain.gain.value = 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // ─── GLITCH SOUND ───
  playGlitch() {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 1000 + Math.random() * 3000;

    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    source.start();
  }

  // ─── PUZZLE SOLVE SOUND ───
  playPuzzleSolve() {
    if (!this.ctx) return;

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.15 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + i * 0.15);
      osc.stop(this.ctx.currentTime + i * 0.15 + 0.5);
    });
  }

  // ─── KEY OBTAINED SOUND ───
  playKeyObtained() {
    if (!this.ctx) return;

    const notes = [440, 554, 659, 880, 1108, 1318, 1760];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i < 4 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      const delay = i * 0.12;
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + 1);
    });
  }

  // ─── INTERACTION BEEP ───
  playInteract() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 660;
    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // ─── VOLUME CONTROLS ───
  setMasterVolume(val) {
    if (this.masterGain) this.masterGain.gain.value = val / 100;
  }

  setMusicVolume(val) {
    if (this.musicGain) this.musicGain.gain.value = (val / 100) * 0.5;
  }

  setSfxVolume(val) {
    if (this.sfxGain) this.sfxGain.gain.value = val / 100;
  }

  // ─── STOP ALL ───
  stopAll() {
    this.isPlaying = false;
    this.activeOscillators.forEach(({ osc, gainNode }) => {
      try {
        if (gainNode) {
          gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
        }
        setTimeout(() => { try { osc.stop(); } catch(e) {} }, 1200);
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  // ─── CLEANUP ───
  dispose() {
    this.stopAll();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
    }
    this.initialized = false;
  }
}

// Singleton
const audioManager = new AudioManager();
export default audioManager;
