export function applyDrumsMixin(AudioManagerClass) {
  AudioManagerClass.prototype._kick = function _kick(t) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.12);

    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    o.connect(g);
    g.connect(this.compressor);
    o.start(t);
    o.stop(t + 0.35);
  };

  AudioManagerClass.prototype._hat = function _hat(t, v) {
    const sz = this.ctx.sampleRate * 0.04;
    const buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);

    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * 0.5;

    const s = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();

    s.buffer = buf;
    f.type = 'highpass';
    f.frequency.value = 8000;

    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    s.connect(f);
    f.connect(g);
    g.connect(this.compressor);
    s.start(t);
  };

  AudioManagerClass.prototype._snare = function _snare(t) {
    const sz = this.ctx.sampleRate * 0.1;
    const buf = this.ctx.createBuffer(1, sz, this.ctx.sampleRate);

    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;

    const s = this.ctx.createBufferSource();
    const ng = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();

    s.buffer = buf;
    f.type = 'highpass';
    f.frequency.value = 2000;

    ng.gain.setValueAtTime(0.2, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    s.connect(f);
    f.connect(ng);
    ng.connect(this.compressor);
    s.start(t);

    const o = this.ctx.createOscillator();
    const og = this.ctx.createGain();

    o.type = 'triangle';
    o.frequency.value = 180;

    og.gain.setValueAtTime(0.15, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    o.connect(og);
    og.connect(this.compressor);
    o.start(t);
    o.stop(t + 0.1);
  };

  AudioManagerClass.prototype._bass = function _bass(t, freq) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();

    o.type = 'sawtooth';
    o.frequency.value = freq;
    f.type = 'lowpass';
    f.frequency.value = 200;
    f.Q.value = 8;

    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    o.connect(f);
    f.connect(g);
    g.connect(this.compressor);
    o.start(t);
    o.stop(t + 0.35);
  };

  AudioManagerClass.prototype._synth = function _synth(t, freq) {
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();

    o1.type = 'square';
    o1.frequency.value = freq;
    o2.type = 'sawtooth';
    o2.frequency.value = freq * 1.003;

    f.type = 'lowpass';
    f.frequency.value = 1500;
    f.Q.value = 3;

    g.gain.setValueAtTime(0.04, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    o1.connect(f);
    o2.connect(f);
    f.connect(g);
    g.connect(this.compressor);

    o1.start(t);
    o2.start(t);
    o1.stop(t + 0.4);
    o2.stop(t + 0.4);
  };

  AudioManagerClass.prototype._arp = function _arp(t, freq) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = 'triangle';
    o.frequency.value = freq;

    g.gain.setValueAtTime(0.03, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    o.connect(g);
    g.connect(this.compressor);
    o.start(t);
    o.stop(t + 0.25);
  };
}
