// ══════════════════════════════════════════════════════
//  DATABASE SINGLETON — SQLite para registro de usuarios
//  Patrón Singleton: una sola instancia de conexión DB
//  Tabla: users (name, nickname, email, password, progress)
//  Sesión expira después de 12 horas
// ══════════════════════════════════════════════════════

import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'oasis-users.db');
const SESSION_EXPIRY_HOURS = 12;

class OasisDatabase {
  static instance = null;
  db = null;

  constructor() {
    if (OasisDatabase.instance) {
      return OasisDatabase.instance;
    }
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this._createTables();
    OasisDatabase.instance = this;
  }

  static getInstance() {
    if (!OasisDatabase.instance) {
      new OasisDatabase();
    }
    return OasisDatabase.instance;
  }

  _createTables() {
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

  // ─── REGISTER ───
  register(name, nickname, email, password) {
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
        progress: JSON.parse(user.progress || '{}'),
      },
    };
  }

  // ─── VALIDATE SESSION (12h expiry) ───
  validateSession(token) {
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
      progress: JSON.parse(user.progress || '{}'),
    };
  }

  // ─── UPDATE PROGRESS ───
  updateProgress(userId, progress) {
    this.db.prepare('UPDATE users SET progress = ? WHERE id = ?')
      .run(JSON.stringify(progress), userId);
    return { success: true };
  }

  // ─── LOGOUT ───
  logout(token) {
    this.db.prepare(
      'UPDATE users SET session_token = NULL, session_expires = NULL WHERE session_token = ?'
    ).run(token);
    return { success: true };
  }
}

export default OasisDatabase;
