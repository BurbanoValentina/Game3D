export function applyMenuTutorialMixin(AudioManagerClass) {
  AudioManagerClass.prototype._menuMusic = function _menuMusic() {
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
  };

  AudioManagerClass.prototype._tutorialMusic = function _tutorialMusic() {
    this._pad(146.83, 'sine', 0.05, 350);
    this._pad(220, 'sine', 0.04, 320);

    const s = this._pad(880, 'sine', 0.008, 800);
    this._lfo(s.gain, 0.15, 0.005);

    const pat = [
      293.66, 0, 369.99, 0, 440, 0, 369.99, 293.66, 0, 0, 440, 0, 523.25, 0,
      440, 369.99,
    ];

    let i = 0;
    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      const n = pat[i % pat.length];
      if (n) this._note(n, 'triangle', 0.02, 0.2);
      i++;
    }, (60 / 110) * 500);
  };
}
