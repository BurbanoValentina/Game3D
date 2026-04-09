// ══════════════════════════════════════════════════════
//  API ROUTE — /api/auth
//  Maneja register, login, session, logout
//  Validación de inputs con límites de caracteres
// ══════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import OasisDatabase from '../../../lib/database';
import { REGISTER_RULES } from '../../../constants/gameConstants';

// ─── SANITIZE INPUT ───
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')         // XSS básico
    .replace(/['";\\]/g, '')      // SQL injection chars
    .replace(/\s{2,}/g, ' ')     // múltiples espacios
    .trim();
}

// ─── VALIDATE FIELD ───
function validateField(value, rule) {
  const clean = sanitize(value);
  if (!clean || clean.length < rule.min) {
    return { valid: false, error: `${rule.label} debe tener al menos ${rule.min} caracteres.` };
  }
  if (clean.length > rule.max) {
    return { valid: false, error: `${rule.label} no puede tener más de ${rule.max} caracteres.` };
  }
  return { valid: true, clean };
}

// ─── VALIDATE EMAIL FORMAT ───
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.includes('..') && email.length <= 100;
}

// ─── VALIDATE PASSWORD STRENGTH ───
function isStrongPassword(pwd) {
  if (pwd.length < 8) return false;
  if (!/[A-Z]/.test(pwd)) return false;
  if (!/[a-z]/.test(pwd)) return false;
  if (!/[0-9]/.test(pwd)) return false;
  return true;
}

// ─── VALIDATE NICKNAME (no spaces, alphanumeric + underscore) ───
function isValidNickname(nick) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(nick);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;
    const db = OasisDatabase.getInstance();

    // ═══════════════════════════════
    //  REGISTER
    // ═══════════════════════════════
    if (action === 'register') {
      const { name, nickname, email, password } = body;

      // Validate all fields
      const nameCheck = validateField(name, REGISTER_RULES.name);
      if (!nameCheck.valid) return NextResponse.json(nameCheck, { status: 400 });

      const nickCheck = validateField(nickname, REGISTER_RULES.nickname);
      if (!nickCheck.valid) return NextResponse.json(nickCheck, { status: 400 });

      if (!isValidNickname(nickCheck.clean)) {
        return NextResponse.json({
          valid: false,
          error: 'Apodo solo puede contener letras, números y guion bajo (_). Sin espacios.',
        }, { status: 400 });
      }

      const emailCheck = validateField(email, REGISTER_RULES.email);
      if (!emailCheck.valid) return NextResponse.json(emailCheck, { status: 400 });

      if (!isValidEmail(emailCheck.clean)) {
        return NextResponse.json({
          valid: false,
          error: 'Formato de correo inválido.',
        }, { status: 400 });
      }

      if (!password || password.length < 8 || password.length > 30) {
        return NextResponse.json({
          valid: false,
          error: 'Contraseña debe tener entre 8 y 30 caracteres.',
        }, { status: 400 });
      }

      if (!isStrongPassword(password)) {
        return NextResponse.json({
          valid: false,
          error: 'Contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 número.',
        }, { status: 400 });
      }

      const result = db.register(nameCheck.clean, nickCheck.clean, emailCheck.clean, password);
      return NextResponse.json(result, { status: result.success ? 201 : 400 });
    }

    // ═══════════════════════════════
    //  LOGIN
    // ═══════════════════════════════
    if (action === 'login') {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json({ success: false, error: 'Correo y contraseña son requeridos.' }, { status: 400 });
      }

      const result = db.login(sanitize(email), password);
      return NextResponse.json(result, { status: result.success ? 200 : 401 });
    }

    // ═══════════════════════════════
    //  VALIDATE SESSION
    // ═══════════════════════════════
    if (action === 'session') {
      const { token } = body;
      const user = db.validateSession(token);

      if (!user) {
        return NextResponse.json({ valid: false, error: 'Sesión expirada o inválida.' }, { status: 401 });
      }
      return NextResponse.json({ valid: true, user });
    }

    // ═══════════════════════════════
    //  LOGOUT
    // ═══════════════════════════════
    if (action === 'logout') {
      const { token } = body;
      db.logout(token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Acción no válida.' }, { status: 400 });
  } catch (err) {
    console.error('[API Auth Error]:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
