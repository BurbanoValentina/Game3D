// ══════════════════════════════════════════════════════
//  DATABASE SINGLETON — SQLite para registro de usuarios
//  Patrón Singleton: una sola instancia de conexión DB
//  Tabla: users (name, nickname, email, password, progress)
//  Sesión expira después de 12 horas
// ══════════════════════════════════════════════════════

import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';

const DB_PATH = path.join(process.cwd(), 'oasis-users.db');
const SESSION_EXPIRY_HOURS = 12;
const IS_VERCEL = process.env.VERCEL === '1';

const require = createRequire(import.meta.url);

class OasisDatabase {
  static instance = null;
  db = null;
  mode = 'sqlite';
  users = new Map();
  emailIndex = new Map();
  nicknameIndex = new Map();
  tokenIndex = new Map();
  nextId = 1;

  constructor() {
    if (OasisDatabase.instance) {
      return OasisDatabase.instance;
    }

    this._initStorage();
    OasisDatabase.instance = this;
  }

  static getInstance() {
    if (!OasisDatabase.instance) {
      new OasisDatabase();
    }
    return OasisDatabase.instance;
  }

  _initStorage() {
    try {
      const BetterSqlite3 = require('better-sqlite3');
      this.db = new BetterSqlite3(DB_PATH);
      this.db.pragma('journal_mode = WAL');
      this._createTables();
      this.mode = 'sqlite';
    } catch (err) {
      // Vercel no garantiza filesystem persistente en runtime serverless.
      // Si SQLite falla, activamos modo memoria para evitar 500 en auth.
      this.mode = 'memory';
      this.db = null;
      console.warn('[DB] SQLite no disponible, activando modo memoria:', err?.message || err);
      if (IS_VERCEL) {
        console.warn('[DB] En Vercel el modo memoria no persiste entre invocaciones. Usa una DB gestionada para producción.');
      }
    }
  }

  _safeProgress(progress) {
    if (!progress) return { level: 0, keys: [], credits: 0 };
    if (typeof progress === 'string') {
      try {
        return JSON.parse(progress);
      } catch {
        return { level: 0, keys: [], credits: 0 };
      }
    }
    return progress;
  }

  _buildUserResponse(user) {
    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      progress: this._safeProgress(user.progress),
    };
  }

  _createTables() {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        nickname TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        progress TEXT DEFAULT '{"level":0,"keys":[],"credits":0}',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME DEFAULT NULL,
        session_token TEXT DEFAULT NULL,
        session_expires DATETIME DEFAULT NULL
      );
    `);
  }

  // ─── HASH PASSWORD ───
  _hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  _registerMemory(name, nickname, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedNickname = nickname.trim();

    if (this.emailIndex.has(normalizedEmail)) {
      return { success: false, error: 'El correo ya está registrado.' };
    }
    if (this.nicknameIndex.has(normalizedNickname)) {
      return { success: false, error: 'El apodo ya está en uso.' };
    }

    const id = this.nextId++;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this._hashPassword(password, salt);
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    const user = {
      id,
      name: name.trim(),
      nickname: normalizedNickname,
      email: normalizedEmail,
      password_hash: hash,
      salt,
      progress: { level: 0, keys: [], credits: 0 },
      session_token: token,
      session_expires: expires,
    };

    this.users.set(id, user);
    this.emailIndex.set(normalizedEmail, id);
    this.nicknameIndex.set(normalizedNickname, id);
    this.tokenIndex.set(token, id);

    return {
      success: true,
      userId: id,
      token,
      user: this._buildUserResponse(user),
    };
  }

  _loginMemory(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const userId = this.emailIndex.get(normalizedEmail);
    if (!userId) {
      return { success: false, error: 'Correo no encontrado.' };
    }

    const user = this.users.get(userId);
    const hash = this._hashPassword(password, user.salt);
    if (hash !== user.password_hash) {
      return { success: false, error: 'Contraseña incorrecta.' };
    }

    if (user.session_token) {
      this.tokenIndex.delete(user.session_token);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    user.session_token = token;
    user.session_expires = expires;
    this.tokenIndex.set(token, user.id);

    return {
      success: true,
      token,
      user: this._buildUserResponse(user),
    };
  }

  _validateSessionMemory(token) {
    if (!token) return null;

    const userId = this.tokenIndex.get(token);
    if (!userId) return null;

    const user = this.users.get(userId);
    if (!user || !user.session_expires) return null;

    const now = new Date();
    const expires = new Date(user.session_expires);

    if (now > expires) {
      this.tokenIndex.delete(token);
      user.session_token = null;
      user.session_expires = null;
      return null;
    }

    return this._buildUserResponse(user);
  }

  _updateProgressMemory(userId, progress) {
    const user = this.users.get(Number(userId));
    if (!user) return { success: false, error: 'Usuario no encontrado.' };
    user.progress = progress;
    return { success: true };
  }

  _logoutMemory(token) {
    if (!token) return { success: true };
    const userId = this.tokenIndex.get(token);
    if (!userId) return { success: true };

    const user = this.users.get(userId);
    if (user) {
      user.session_token = null;
      user.session_expires = null;
    }
    this.tokenIndex.delete(token);
    return { success: true };
  }

  // ─── REGISTER ───
  register(name, nickname, email, password) {
    if (this.mode === 'memory') {
      return this._registerMemory(name, nickname, email, password);
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this._hashPassword(password, salt);

    try {
      const stmt = this.db.prepare(
        'INSERT INTO users (name, nickname, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)'
      );
      const result = stmt.run(name.trim(), nickname.trim(), email.trim().toLowerCase(), hash, salt);

      // Auto-login: generate session token for the new user
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000)
        .toISOString();

      this.db.prepare(
        'UPDATE users SET session_token = ?, session_expires = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?'
      ).run(token, expires, result.lastInsertRowid);

      return {
        success: true,
        userId: result.lastInsertRowid,
        token,
        user: {
          id: result.lastInsertRowid,
          name: name.trim(),
          nickname: nickname.trim(),
          email: email.trim().toLowerCase(),
          progress: { level: 0, keys: [], credits: 0 },
        },
      };
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed: users.email')) {
        return { success: false, error: 'El correo ya está registrado.' };
      }
      if (err.message.includes('UNIQUE constraint failed: users.nickname')) {
        return { success: false, error: 'El apodo ya está en uso.' };
      }
      return { success: false, error: 'Error al registrar. Intenta de nuevo.' };
    }
  }

  // ─── LOGIN ───
  login(email, password) {
    if (this.mode === 'memory') {
      return this._loginMemory(email, password);
    }

    const user = this.db.prepare('SELECT * FROM users WHERE email = ?')
      .get(email.trim().toLowerCase());

    if (!user) {
      return { success: false, error: 'Correo no encontrado.' };
    }

    const hash = this._hashPassword(password, user.salt);
    if (hash !== user.password_hash) {
      return { success: false, error: 'Contraseña incorrecta.' };
    }

    // Generar token de sesión (expira en 12h)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000)
      .toISOString();

    this.db.prepare(
      'UPDATE users SET session_token = ?, session_expires = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(token, expires, user.id);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        progress: this._safeProgress(user.progress),
      },
    };
  }

  // ─── VALIDATE SESSION (12h expiry) ───
  validateSession(token) {
    if (this.mode === 'memory') {
      return this._validateSessionMemory(token);
    }

    if (!token) return null;

    const user = this.db.prepare(
      'SELECT * FROM users WHERE session_token = ?'
    ).get(token);

    if (!user || !user.session_expires) return null;

    const now = new Date();
    const expires = new Date(user.session_expires);

    if (now > expires) {
      // Sesión expirada - limpiar
      this.db.prepare(
        'UPDATE users SET session_token = NULL, session_expires = NULL WHERE id = ?'
      ).run(user.id);
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      progress: this._safeProgress(user.progress),
    };
  }

  // ─── UPDATE PROGRESS ───
  updateProgress(userId, progress) {
    if (this.mode === 'memory') {
      return this._updateProgressMemory(userId, progress);
    }

    this.db.prepare('UPDATE users SET progress = ? WHERE id = ?')
      .run(JSON.stringify(progress), userId);
    return { success: true };
  }

  // ─── LOGOUT ───
  logout(token) {
    if (this.mode === 'memory') {
      return this._logoutMemory(token);
    }

    this.db.prepare(
      'UPDATE users SET session_token = NULL, session_expires = NULL WHERE session_token = ?'
    ).run(token);
    return { success: true };
  }
}

export default OasisDatabase;
