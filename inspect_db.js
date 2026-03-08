const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database/bisp_dflt2.db', sqlite3.OPEN_READONLY);

db.all("SELECT name, type FROM sqlite_master WHERE type IN ('table','view') ORDER BY type, name", (err, tables) => {
  if (err) { console.error('Error:', err.message); db.close(); return; }
  console.log('=== TABLES/VIEWS ===');
  console.log(JSON.stringify(tables, null, 2));

  let pending = tables.length;
  if (pending === 0) { db.close(); return; }

  tables.forEach(t => {
    db.all('SELECT * FROM "' + t.name + '" LIMIT 2', (err2, rows) => {
      if (err2) {
        console.log('\n=== ' + t.name + ' (ERROR: ' + err2.message + ') ===');
      } else {
        console.log('\n=== ' + t.name + ' COLUMNS ===');
        if (rows.length > 0) console.log(JSON.stringify(Object.keys(rows[0])));
        else console.log('(empty)');
        console.log('SAMPLE ROW 1:', JSON.stringify(rows[0] || null));
      }
      pending--;
      if (pending === 0) db.close();
    });
  });
});
