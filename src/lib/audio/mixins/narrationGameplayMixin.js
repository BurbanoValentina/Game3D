export function applyNarrationGameplayMixin(AudioManagerClass) {
  AudioManagerClass.prototype._narrationMusic = function _narrationMusic() {
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
  };

  AudioManagerClass.prototype._gameplayMusic = function _gameplayMusic() {
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
  };

  AudioManagerClass.prototype._gameBeat = function _gameBeat(b) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    if (b % 8 === 0) this._kick(t);
    if (b % 2 === 0) this._hat(t, b % 4 === 0 ? 0.06 : 0.03);
    if (b % 8 === 4) this._snare(t);

    const bass = [
      55, 0, 0, 0, 55, 0, 65.41, 0, 55, 0, 0, 0, 82.41, 0, 73.42, 0,
      55, 0, 0, 0, 55, 0, 65.41, 0, 55, 0, 0, 0, 73.42, 0, 82.41, 0,
    ];

    if (bass[b]) this._bass(t, bass[b]);

    if (b >= 16) {
      const mel = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 440, 0, 523, 0,
        659, 0, 523, 0, 587, 0, 523, 0, 440, 0, 0, 0,
      ];
      if (mel[b]) this._synth(t, mel[b]);
    }

    if (b >= 8 && b % 4 === 2) {
      const ar = [220, 261.63, 329.63, 392, 440, 523.25];
      this._arp(t, ar[Math.floor(Math.random() * ar.length)]);
    }
  };
}
