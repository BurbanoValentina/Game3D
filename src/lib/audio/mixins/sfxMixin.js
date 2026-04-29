export function applySfxMixin(AudioManagerClass) {
  AudioManagerClass.prototype.playBootBeep = function playBootBeep(i = 0) {
    if (!this.ctx) return;

    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = 'square';
    o.frequency.value = [440, 554, 659, 880, 1108, 440, 330, 220][i % 8];

    g.gain.value = 0.08;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    o.connect(g);
    g.connect(this.sfxGain);
    o.start();
    o.stop(this.ctx.currentTime + 0.15);
  };

  AudioManagerClass.prototype.playGlitch = function playGlitch() {
    if (!this.ctx) return;

    const sz = this.ctx.sampleRate * 0.08;
    const buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);

    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * 0.3;

    const s = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();

    s.buffer = buf;
    f.type = 'highpass';
    f.frequency.value = 1000 + Math.random() * 3000;

    g.gain.value = 0.15;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    s.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    s.start();
  };

  AudioManagerClass.prototype.playPuzzleSolve = function playPuzzleSolve() {
    if (!this.ctx) return;

    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0;

      g.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.15 + 0.4);

      o.connect(g);
      g.connect(this.sfxGain);
      o.start(this.ctx.currentTime + i * 0.15);
      o.stop(this.ctx.currentTime + i * 0.15 + 0.5);
    });
  };

  AudioManagerClass.prototype.playKeyObtained = function playKeyObtained() {
    if (!this.ctx) return;

    [440, 554, 659, 880, 1108, 1318, 1760].forEach((freq, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      o.type = i < 4 ? 'sine' : 'triangle';
      o.frequency.value = freq;

      g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.8);

      o.connect(g);
      g.connect(this.sfxGain);
      o.start(this.ctx.currentTime + i * 0.12);
      o.stop(this.ctx.currentTime + i * 0.12 + 1);
    });
  };

  AudioManagerClass.prototype.playInteract = function playInteract() {
    if (!this.ctx) return;

    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = 'sine';
    o.frequency.value = 660;
    g.gain.value = 0.1;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    o.connect(g);
    g.connect(this.sfxGain);
    o.start();
    o.stop(this.ctx.currentTime + 0.1);
  };

  AudioManagerClass.prototype.playRocketLaunch = function playRocketLaunch() {
    if (!this.ctx) return;

    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = 'sawtooth';
    o.frequency.setValueAtTime(60, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.5);

    g.gain.setValueAtTime(0.08, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 1);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2);

    o.connect(g);
    g.connect(this.sfxGain);
    o.start();
    o.stop(this.ctx.currentTime + 2.5);
  };

  AudioManagerClass.prototype.playExplosion = function playExplosion() {
    if (!this.ctx) return;

    const sz = this.ctx.sampleRate * 0.5;
    const buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);

    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;

    const n = this.ctx.createBufferSource();
    n.buffer = buf;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.3, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    n.connect(g);
    g.connect(this.sfxGain);
    n.start();
  };

  AudioManagerClass.prototype.playTimerWarning = function playTimerWarning() {
    if (!this.ctx) return;

    this._note(880, 'square', 0.06, 0.12);
    setTimeout(() => this._note(880, 'square', 0.06, 0.12), 150);
  };

  AudioManagerClass.prototype.playCorrectAnswer = function playCorrectAnswer() {
    if (!this.ctx) return;
    [523, 659, 784].forEach((f, i) => this._note(f, 'sine', 0.08, 0.3, i * 0.1));
  };
}
