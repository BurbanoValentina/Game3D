// ══════════════════════════════════════════════════════
//  AUDIO MANAGER — Multi-Scene Cyberpunk Music Engine
//  (Entry point) Mantiene el export default `audioManager`
// ══════════════════════════════════════════════════════

import AudioManager from './audio/AudioManagerCore';
import { applyDrumsMixin } from './audio/mixins/drumsMixin';
import { applyEndingsMixin } from './audio/mixins/endingsMixin';
import { applyHelpersMixin } from './audio/mixins/helpersMixin';
import { applyMapErrorMemoryMixin } from './audio/mixins/mapErrorMemoryMixin';
import { applyMenuTutorialMixin } from './audio/mixins/menuTutorialMixin';
import { applyNarrationGameplayMixin } from './audio/mixins/narrationGameplayMixin';
import { applySfxMixin } from './audio/mixins/sfxMixin';

applyHelpersMixin(AudioManager);
applyDrumsMixin(AudioManager);
applyMenuTutorialMixin(AudioManager);
applyNarrationGameplayMixin(AudioManager);
applyMapErrorMemoryMixin(AudioManager);
applyEndingsMixin(AudioManager);
applySfxMixin(AudioManager);

const audioManager = new AudioManager();

export default audioManager;
