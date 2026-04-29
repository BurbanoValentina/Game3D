import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export function loadBetterSqlite3() {
  return require('better-sqlite3');
}
