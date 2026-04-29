import path from 'path';

export const DB_PATH = path.join(process.cwd(), 'oasis-users.db');
export const SESSION_EXPIRY_HOURS = 12;
export const IS_VERCEL = process.env.VERCEL === '1';
