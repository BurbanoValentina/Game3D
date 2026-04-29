import crypto from 'crypto';

export function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function createSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function createExpiryIso(sessionExpiryHours) {
  return new Date(Date.now() + sessionExpiryHours * 60 * 60 * 1000).toISOString();
}
