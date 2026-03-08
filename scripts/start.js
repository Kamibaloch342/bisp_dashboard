'use strict';
/**
 * start.js – Production entry point used by Render.
 *
 * 1. Downloads the latest databases + config from the office FTP server.
 * 2. Then boots server.js.
 *
 * Start command on Render:  node scripts/start.js
 */

const { execFileSync } = require('child_process');
const path = require('path');

console.log('=== [startup] Fetching latest databases from FTP ===');
try {
  execFileSync(process.execPath, [path.join(__dirname, 'fetch-db.js')], {
    stdio: 'inherit',
    timeout: 5 * 60 * 1000,  // 5-minute hard cap for the download
  });
} catch {
  console.error('[startup] Database fetch failed – aborting.');
  process.exit(1);
}

console.log('=== [startup] Starting BISP Dashboard server ===');
require('../server.js');
