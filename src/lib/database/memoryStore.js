import { buildUserResponse } from './userUtils';
import { createExpiryIso, createSalt, createToken, hashPassword } from './cryptoUtils';

export function createMemoryStore({ sessionExpiryHours }) {
  const users = new Map();
  const emailIndex = new Map();
  const nicknameIndex = new Map();
  const tokenIndex = new Map();
  let nextId = 1;

  const seedAdmin = () => {
    const salt = createSalt();
    const hash = hashPassword('admin12345', salt);
    const id = nextId++;

    const adminUser = {
      id,
      name: 'Superadmin',
      nickname: 'superadmin',
      email: 'admin@gmail.com',
      password_hash: hash,
      salt,
      is_admin: 1,
      progress: { level: 0, keys: [], credits: 0 },
      session_token: null,
      session_expires: null,
    };

    users.set(id, adminUser);
    emailIndex.set(adminUser.email, id);
    nicknameIndex.set(adminUser.nickname, id);
  };

  seedAdmin();

  const register = (name, nickname, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedNickname = nickname.trim();

    if (emailIndex.has(normalizedEmail)) {
      return { success: false, error: 'El correo ya está registrado.' };
    }
    if (nicknameIndex.has(normalizedNickname)) {
      return { success: false, error: 'El apodo ya está en uso.' };
    }

    const id = nextId++;
    const salt = createSalt();
    const hash = hashPassword(password, salt);
    const token = createToken();
    const expires = createExpiryIso(sessionExpiryHours);

    const user = {
      id,
      name: name.trim(),
      nickname: normalizedNickname,
      email: normalizedEmail,
      password_hash: hash,
      salt,
      is_admin: 0,
      progress: { level: 0, keys: [], credits: 0 },
      session_token: token,
      session_expires: expires,
    };

    users.set(id, user);
    emailIndex.set(normalizedEmail, id);
    nicknameIndex.set(normalizedNickname, id);
    tokenIndex.set(token, id);

    return { success: true, userId: id, token, user: buildUserResponse(user) };
  };

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const userId = emailIndex.get(normalizedEmail);
    if (!userId) return { success: false, error: 'Correo no encontrado.' };

    const user = users.get(userId);
    const hash = hashPassword(password, user.salt);
    if (hash !== user.password_hash) {
      return { success: false, error: 'Contraseña incorrecta.' };
    }

    if (user.session_token) tokenIndex.delete(user.session_token);

    const token = createToken();
    const expires = createExpiryIso(sessionExpiryHours);

    user.session_token = token;
    user.session_expires = expires;
    tokenIndex.set(token, user.id);

    return { success: true, token, user: buildUserResponse(user) };
  };

  const validateSession = (token) => {
    if (!token) return null;

    const userId = tokenIndex.get(token);
    if (!userId) return null;

    const user = users.get(userId);
    if (!user || !user.session_expires) return null;

    const now = new Date();
    const expires = new Date(user.session_expires);

    if (now > expires) {
      tokenIndex.delete(token);
      user.session_token = null;
      user.session_expires = null;
      return null;
    }

    return buildUserResponse(user);
  };

  const updateProgress = (userId, progress) => {
    const user = users.get(Number(userId));
    if (!user) return { success: false, error: 'Usuario no encontrado.' };
    user.progress = progress;
    return { success: true };
  };

  const logout = (token) => {
    if (!token) return { success: true };

    const userId = tokenIndex.get(token);
    if (!userId) return { success: true };

    const user = users.get(userId);
    if (user) {
      user.session_token = null;
      user.session_expires = null;
    }
    tokenIndex.delete(token);
    return { success: true };
  };

  return {
    mode: 'memory',
    register,
    login,
    validateSession,
    updateProgress,
    logout,
  };
}
