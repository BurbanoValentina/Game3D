export function applyHelpersMixin(AudioManagerClass) {
  AudioManagerClass.prototype._pad = function _pad(freq, type, vol, fFreq = 400) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = fFreq;
    filter.Q.value = 1;

    gain.gain.value = 0;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);

    osc.start();
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 2);

    this.sceneNodes.push({ osc, gain });
    return { osc, gain, filter };
  };

  AudioManagerClass.prototype._lfo = function _lfo(targetGain, rate, depth) {
    const lfo = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    lfo.type = 'sine';
    lfo.frequency.value = rate;
    g.gain.value = depth;

    lfo.connect(g);
    g.connect(targetGain.gain);
    lfo.start();

    this.sceneNodes.push({ osc: lfo, gain: g });
  };

  AudioManagerClass.prototype._note = function _note(freq, type, vol, dur, delay = 0) {
    if (!this.ctx) return;

    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.start(t);
    osc.stop(t + dur + 0.1);
  };
}
