// ══════════════════════════════════════════════════════
//  DATABASE SINGLETON — SQLite para registro de usuarios
//  Mantiene API pública: getInstance(), register/login/session/logout/progress
//  Fallback: modo memoria si SQLite no está disponible
// ══════════════════════════════════════════════════════

import { DB_PATH, IS_VERCEL, SESSION_EXPIRY_HOURS } from './database/constants';
import { loadBetterSqlite3 } from './database/loadBetterSqlite3';
import { createMemoryStore } from './database/memoryStore';
import { createSqliteStore } from './database/sqliteStore';

class OasisDatabase {
  static instance = null;

  constructor() {
    if (OasisDatabase.instance) return OasisDatabase.instance;

    this.db = null;
    this.mode = 'sqlite';
    this.store = null;

    this._initStorage();
    OasisDatabase.instance = this;
  }

  static getInstance() {
    if (!OasisDatabase.instance) new OasisDatabase();
    return OasisDatabase.instance;
  }

  _initStorage() {
    try {
      const BetterSqlite3 = loadBetterSqlite3();
      this.db = new BetterSqlite3(DB_PATH);
      this.store = createSqliteStore({ db: this.db, sessionExpiryHours: SESSION_EXPIRY_HOURS });
      this.mode = 'sqlite';
    } catch (err) {
      this.mode = 'memory';
      this.db = null;

      console.warn('[DB] SQLite no disponible, activando modo memoria:', err?.message || err);
      this.store = createMemoryStore({ sessionExpiryHours: SESSION_EXPIRY_HOURS });

      if (IS_VERCEL) {
        console.warn(
          '[DB] En Vercel el modo memoria no persiste entre invocaciones. Usa una DB gestionada para producción.',
        );
      }
    }
  }

  register(name, nickname, email, password) {
    return this.store.register(name, nickname, email, password);
  }

  login(email, password) {
    return this.store.login(email, password);
  }

  validateSession(token) {
    return this.store.validateSession(token);
  }

  updateProgress(userId, progress) {
    return this.store.updateProgress(userId, progress);
  }

  logout(token) {
    return this.store.logout(token);
  }
}

export default OasisDatabase;
