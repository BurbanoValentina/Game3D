// ══════════════════════════════════════════════════════
//  PATTERN: Observer (Event Bus Singleton)
//  Comunicación desacoplada entre componentes del juego
// ══════════════════════════════════════════════════════

const EventBus = (() => {
  const listeners = {};
  let debugMode = false;

  return {
    /**
     * Suscribirse a un evento
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Handler
     * @returns {Function} Función para desuscribirse
     */
    on(event, callback) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);

      if (debugMode) {
        console.log(`[EventBus] Subscribed to: ${event}`);
      }

      // Retorna cleanup function
      return () => {
        listeners[event] = listeners[event].filter(l => l !== callback);
        if (debugMode) {
          console.log(`[EventBus] Unsubscribed from: ${event}`);
        }
      };
    },

    /**
     * Suscripción de una sola vez
     */
    once(event, callback) {
      const unsub = this.on(event, (data) => {
        callback(data);
        unsub();
      });
      return unsub;
    },

    /**
     * Emitir un evento
     */
    emit(event, data) {
      if (debugMode) {
        console.log(`[EventBus] Emit: ${event}`, data);
      }
      const handlers = listeners[event];
      if (handlers) {
        handlers.forEach(cb => {
          try {
            cb(data);
          } catch (err) {
            console.error(`[EventBus] Error in handler for ${event}:`, err);
          }
        });
      }
    },

    /**
     * Limpiar todos los listeners
     */
    clear() {
      Object.keys(listeners).forEach(k => delete listeners[k]);
      if (debugMode) {
        console.log('[EventBus] All listeners cleared');
      }
    },

    /**
     * Limpiar listeners de un evento específico
     */
    clearEvent(event) {
      delete listeners[event];
    },

    /**
     * Activar/desactivar modo debug
     */
    setDebug(enabled) {
      debugMode = enabled;
    },

    /**
     * Obtener conteo de listeners por evento
     */
    getListenerCount(event) {
      return (listeners[event] || []).length;
    },
  };
})();

export default EventBus;
