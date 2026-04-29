import { buildUserResponse } from './userUtils';
import { createExpiryIso, createSalt, createToken, hashPassword } from './cryptoUtils';

function initSchema(db) {
  db.exec(`
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
      session_expires DATETIME DEFAULT NULL,
      is_admin INTEGER DEFAULT 0
    );
  `);

  try {
    db.exec('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0');
  } catch (_) {}
}

function seedAdmin(db) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@gmail.com');
  if (existing) {
    db.prepare('UPDATE users SET is_admin = 1 WHERE email = ?').run('admin@gmail.com');
    return;
  }

  const salt = createSalt();
  const hash = hashPassword('admin12345', salt);
  db.prepare(
    'INSERT INTO users (name, nickname, email, password_hash, salt, is_admin) VALUES (?, ?, ?, ?, ?, ?)'
  ).run('Superadmin', 'superadmin', 'admin@gmail.com', hash, salt, 1);
}

export function createSqliteStore({ db, sessionExpiryHours }) {
  db.pragma('journal_mode = WAL');
  initSchema(db);
  seedAdmin(db);

  const register = (name, nickname, email, password) => {
    const salt = createSalt();
    const hash = hashPassword(password, salt);

    try {
      const result = db
        .prepare('INSERT INTO users (name, nickname, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)')
        .run(name.trim(), nickname.trim(), email.trim().toLowerCase(), hash, salt);

      const token = createToken();
      const expires = createExpiryIso(sessionExpiryHours);

      db.prepare(
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
      if (err?.message?.includes('UNIQUE constraint failed: users.email')) {
        return { success: false, error: 'El correo ya está registrado.' };
      }
      if (err?.message?.includes('UNIQUE constraint failed: users.nickname')) {
        return { success: false, error: 'El apodo ya está en uso.' };
      }
      return { success: false, error: 'Error al registrar. Intenta de nuevo.' };
    }
  };

  const login = (email, password) => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (!user) return { success: false, error: 'Correo no encontrado.' };

    const hash = hashPassword(password, user.salt);
    if (hash !== user.password_hash) {
      return { success: false, error: 'Contraseña incorrecta.' };
    }

    const token = createToken();
    const expires = createExpiryIso(sessionExpiryHours);

    db.prepare(
      'UPDATE users SET session_token = ?, session_expires = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(token, expires, user.id);

    return { success: true, token, user: buildUserResponse(user) };
  };

  const validateSession = (token) => {
    if (!token) return null;

    const user = db.prepare('SELECT * FROM users WHERE session_token = ?').get(token);
    if (!user || !user.session_expires) return null;

    const now = new Date();
    const expires = new Date(user.session_expires);

    if (now > expires) {
      db.prepare('UPDATE users SET session_token = NULL, session_expires = NULL WHERE id = ?').run(user.id);
      return null;
    }

    return buildUserResponse(user);
  };

  const updateProgress = (userId, progress) => {
    db.prepare('UPDATE users SET progress = ? WHERE id = ?').run(JSON.stringify(progress), userId);
    return { success: true };
  };

  const logout = (token) => {
    db.prepare('UPDATE users SET session_token = NULL, session_expires = NULL WHERE session_token = ?').run(token);
    return { success: true };
  };

  return {
    mode: 'sqlite',
    register,
    login,
    validateSession,
    updateProgress,
    logout,
  };
}
