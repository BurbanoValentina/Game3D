export function applyMapErrorMemoryMixin(AudioManagerClass) {
  AudioManagerClass.prototype._mapMusic = function _mapMusic() {
    this._pad(87.31, 'sine', 0.06, 300);
    this._pad(130.81, 'sine', 0.04, 350);
    this._pad(174.61, 'triangle', 0.03, 280);

    const s = this._pad(349.23, 'sine', 0.015, 500);
    this._lfo(s.gain, 0.1, 0.008);

    const pat = [
      174.61, 0, 220, 0, 261.63, 0, 220, 0, 174.61, 0, 146.83, 0, 174.61,
      0, 0, 0,
    ];

    let i = 0;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      const n = pat[i % pat.length];
      if (n) this._note(n, 'sine', 0.02, 0.4);
      if (i % 4 === 0) this._hat(this.ctx.currentTime, 0.02);
      i++;
    }, 400);
  };

  AudioManagerClass.prototype._errorMusic = function _errorMusic() {
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

      if (b % 8 === 0) {
        this._note(880, 'square', 0.04, 0.15);
        this._note(932.33, 'square', 0.03, 0.1, 0.08);
      }

      this.currentBeat++;
    }, ms);
  };

  AudioManagerClass.prototype._memoryMusic = function _memoryMusic() {
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
  };
}
