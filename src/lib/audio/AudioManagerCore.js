class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.compressor = null;

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
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }

    const t = this.ctx?.currentTime || 0;
    this.sceneNodes.forEach(({ osc, gain, source }) => {
      try {
        if (gain) gain.gain.linearRampToValueAtTime(0, t + fade);
        setTimeout(() => {
          try {
            if (osc) osc.stop();
          } catch (e) {}
          try {
            if (source) source.stop();
          } catch (e) {}
        }, (fade + 0.2) * 1000);
      } catch (e) {}
    });

    this.sceneNodes = [];
  }

  // ─── Legacy ───
  startMusic() {
    this.playScene('gameplay');
  }

  startAmbientDrone() {
    this.playScene('gameplay');
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;

    if (this.musicEnabled && this.currentScene) {
      const s = this.currentScene;
      this.currentScene = null;
      this.playScene(s);
    } else if (!this.musicEnabled) {
      this._stopScene(0.5);
    }

    return this.musicEnabled;
  }

  stopMusic() {
    this._stopScene(1);
    this.isPlaying = false;
    this.currentScene = null;
  }

  setMasterVolume(v) {
    if (this.masterGain) this.masterGain.gain.value = v / 100;
  }

  setMusicVolume(v) {
    if (this.musicGain) this.musicGain.gain.value = (v / 100) * 0.4;
  }

  setSfxVolume(v) {
    if (this.sfxGain) this.sfxGain.gain.value = v / 100;
  }

  stopAll() {
    this.stopMusic();
  }

  dispose() {
    this.stopAll();
    if (this.ctx) this.ctx.close().catch(() => {});
    this.initialized = false;
  }
}

export default AudioManager;
