'use strict';
/**
 * fetch-db.js
 *
 * Downloads the SQLite databases + config.json from your office FTP server
 * before the main server starts. Run by scripts/start.js on every cold start.
 *
 * Required environment variables (set these in Render → Environment):
 *   FTP_USER         – FTP username  (dfltphase2@dfltphase2.sdpipk.org)
 *   FTP_PASS         – FTP password
 *   FTP_HOST         – FTP hostname  (default: ftp.sdpipk.org)
 *   FTP_PORT         – FTP port      (default: 21)
 *   FTP_REMOTE_DIR   – Remote folder that contains the DB files
 *                      (default: /bisp_dashboard/)
 */

const ftp  = require('basic-ftp');
const path = require('path');
const fs   = require('fs');

// Load .env when running locally
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const REMOTE_DIR = (process.env.FTP_REMOTE_DIR || '/bisp_dashboard/').replace(/\/?$/, '/');

// Map:  remote filename → local path relative to THIS file's parent (bisp_dashboard/)
const FILES = [
  { remote: 'bisp_dflt2.db', local: path.join(__dirname, '..', 'Database', 'bisp_dflt2.db') },
  { remote: 'user.db',       local: path.join(__dirname, '..', 'Database', 'user.db') },
  { remote: 'config.json',   local: path.join(__dirname, '..', 'confidentials', 'config.json') },
];

async function fetchAll() {
  if (!process.env.FTP_USER || !process.env.FTP_PASS) {
    console.error('[FTP] ERROR: FTP_USER and FTP_PASS environment variables must be set.');
    process.exit(1);
  }

  // Ensure local directories exist
  for (const f of FILES) {
    const dir = path.dirname(f.local);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host:     process.env.FTP_HOST || 'ftp.sdpipk.org',
      user:     process.env.FTP_USER,
      password: process.env.FTP_PASS,
      port:     parseInt(process.env.FTP_PORT || '21', 10),
      secure:   false,   // plain FTP on port 21
    });

    console.log(`[FTP] Connected → ${process.env.FTP_HOST || 'ftp.sdpipk.org'}`);

    for (const f of FILES) {
      const remotePath = REMOTE_DIR + f.remote;
      console.log(`[FTP] Downloading ${f.remote} ...`);
      await client.downloadTo(f.local, remotePath);
      const sizeMB = (fs.statSync(f.local).size / 1024 / 1024).toFixed(1);
      console.log(`[FTP] ✔  ${f.remote}  (${sizeMB} MB)`);
    }

    console.log('[FTP] All files ready.');
  } finally {
    client.close();
  }
}

fetchAll().catch(err => {
  console.error('[FTP] Fatal:', err.message);
  process.exit(1);
});
