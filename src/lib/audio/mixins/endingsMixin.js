export function applyEndingsMixin(AudioManagerClass) {
  AudioManagerClass.prototype._victoryMusic = function _victoryMusic() {
    this._pad(130.81, 'sine', 0.06, 400);
    this._pad(164.81, 'triangle', 0.04, 380);
    this._pad(196, 'sine', 0.035, 350);

    [261.63, 329.63, 392, 523.25, 659.26, 783.99, 1046.5].forEach((f, i) => {
      this._note(f, 'sine', 0.03, 1.5, i * 0.3);
    });

    const arp = [523.25, 659.26, 783.99, 1046.5, 783.99, 659.26];
    let i = 0;

    this.beatInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      this._note(arp[i % arp.length], 'triangle', 0.018, 0.5);
      i++;
    }, 600);
  };

  AudioManagerClass.prototype._gameoverMusic = function _gameoverMusic() {
    this._pad(55, 'sine', 0.07, 180);
    this._pad(65.41, 'sine', 0.04, 200);

    const d = this._pad(116.54, 'sine', 0.02, 250);
    this._lfo(d.gain, 0.03, 0.01);

    [440, 415.3, 392, 349.23, 329.63, 293.66, 261.63, 246.94].forEach((f, i) => {
      this._note(f, 'sine', 0.02, 2, i * 0.8);
    });
  };
}
