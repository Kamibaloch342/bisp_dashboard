require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-2026';

app.use(express.json());
app.use(cookieParser());

// ─── Database Connections ────────────────────────────────────────
const userDb = new sqlite3.Database('./Database/user.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) console.error('User DB connection error:', err.message);
  else console.log('Connected to user.db (read-only)');
});

const beneDb = new sqlite3.Database('./Database/bisp_dflt2.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) console.error('Beneficiary DB connection error:', err.message);
  else console.log('Connected to bisp_dflt2.db (read-only)');
});

let appConfig;
try {
  appConfig = JSON.parse(fs.readFileSync('./confidentials/config.json', 'utf8'));
} catch {
  // Fallback to environment variables (used on Render / any server without the file)
  appConfig = {
    total_project_target: parseInt(process.env.PROJECT_TARGET || '250000', 10),
    provinces: {},
    surveycto_user:     process.env.SURVEYCTO_USER    || '',
    surveycto_password: process.env.SURVEYCTO_PASS    || '',
  };
}

// ─── Middleware ──────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root → login page
app.get('/', (req, res) => res.redirect('/login.html'));

// Prevent direct access to Database folder
app.use('/Database', (req, res) => {
  res.status(403).send('Forbidden: Database access not allowed.');
});

// Protect /decks folder
app.use('/decks', (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Please login');

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.warn('[DECKS] Invalid/expired token:', err.message);
    res.clearCookie('token');
    return res.status(401).send('Session expired – please login again');
  }
}, express.static(path.join(__dirname, 'protected/decks')));

// ─── Protect ALL /api routes (except login & me) ────────────────────────────────
app.use('/api', (req, res, next) => {
  // Skip auth check for login and me endpoints
  if (req.path.startsWith('/login') || req.path.startsWith('/me')) {
    return next();
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Please login to access this data' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.warn('[API] Invalid/expired token:', err.message);
    res.clearCookie('token');
    return res.status(401).json({ error: 'Session expired - please login again' });
  }
});

// ─── Auth Endpoints ──────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  userDb.get(
    'SELECT username, password_hash, role, allowed_decks FROM users WHERE username = ?',
    [username],
    (err, user) => {
      if (err) {
        console.error('[LOGIN] DB error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const match = bcrypt.compareSync(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign(
        {
          username: user.username,
          role: user.role,
          allowed_decks: user.allowed_decks || ''
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: 'Login successful',
        role: user.role,
        allowed_decks: user.allowed_decks
      });
    }
  );
});

app.get('/api/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});
// (debug-login endpoint removed before production deployment)
// ─── Dashboard API Endpoints ─────────────────────────────────────

// 1. KPIs
app.get('/api/kpis', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total,
      AVG(CASE 
        WHEN age GLOB '[0-9]*' AND LENGTH(age) <= 4 THEN 
          CASE 
            WHEN CAST(age AS INTEGER) BETWEEN 1900 AND strftime('%Y', 'now') 
              THEN strftime('%Y', 'now') - CAST(age AS INTEGER)
            WHEN CAST(age AS REAL) <= 150 THEN CAST(age AS REAL)
            ELSE NULL
          END
        ELSE NULL
      END) as avg_age,
      AVG(CAST(NULLIF(TRIM(household_income), '') AS REAL)) as avg_income,
      AVG(CAST(NULLIF(TRIM(loan_amount), '') AS REAL)) as avg_loan,
      (SUM(CASE WHEN LOWER(TRIM(has_mobile_money)) = 'yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as pct_mobile_money,
      (SUM(CASE WHEN LOWER(TRIM(has_bank_account)) = 'yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as pct_bank,
      (SUM(CASE WHEN CAST(attendance_status AS TEXT) = '1' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as pct_day2,
      (SUM(CASE WHEN LOWER(TRIM(verified_retention_status)) = 'verified' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as pct_verified,
      SUM(CASE WHEN CAST(attendance_status AS TEXT) = '1' THEN 1 ELSE 0 END) as total_day2,
      SUM(CASE WHEN LOWER(TRIM(verified_retention_status)) = 'verified' THEN 1 ELSE 0 END) as total_verified,
      (SUM(CASE WHEN LOWER(TRIM(own_phone)) = 'yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as pct_own_phone,
      (SUM(CASE WHEN LOWER(TRIM(taken_loan)) = 'yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as pct_taken_loan,
      AVG(CAST(NULLIF(TRIM(avg_savings), '') AS REAL)) as avg_savings_val
    FROM bene_registration
    WHERE TRIM(beneficiary_cnic) != '' 
      AND beneficiary_cnic IS NOT NULL
      AND TRIM(beneficiary_name) != ''
      AND beneficiary_name IS NOT NULL
  `;

  beneDb.get(sql, (err, row) => {
    if (err) {
      console.error('KPIs query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }

    res.json({
      totalBeneficiaries: row.total || 0,
      avgAge: row.avg_age ? Number(row.avg_age.toFixed(1)) : 0,
      avgIncome: row.avg_income ? Math.round(row.avg_income || 0) : 0,
      avgLoan: row.avg_loan ? Math.round(row.avg_loan || 0) : 0,
      pctMobileMoney: row.pct_mobile_money ? Number(row.pct_mobile_money.toFixed(1)) : 0,
      pctBank:         row.pct_bank        ? Number(row.pct_bank.toFixed(1))         : 0,
      pctDay2:         row.pct_day2        ? Number(row.pct_day2.toFixed(1))         : 0,
      pctVerified:     row.pct_verified    ? Number(row.pct_verified.toFixed(1))     : 0,
      totalDay2:       row.total_day2      || 0,
      totalVerified:   row.total_verified  || 0,
      pctOwnPhone:     row.pct_own_phone    ? Number(row.pct_own_phone.toFixed(1))  : 0,
      pctTakenLoan:    row.pct_taken_loan   ? Number(row.pct_taken_loan.toFixed(1)) : 0,
      avgSavings:      row.avg_savings_val  ? Math.round(row.avg_savings_val)       : 0
    });
  });
});

// 2. Chart data by category
app.get('/api/chart/:type', (req, res) => {
  const { type } = req.params;
  let column = '';

  switch (type) {
    case 'education':               column = 'education'; break;
    case 'province':                column = 'province'; break;
    case 'willingness':             column = 'economic_activity_willingness'; break;
    case 'bank':                    column = 'has_bank_account'; break;
    case 'mobile-money':            column = 'has_mobile_money'; break;
    case 'occupation':              column = 'occupation'; break;
    case 'zones':                   column = 'zones'; break;
    case 'phase':                   column = 'dflt_phase'; break;
    case 'living':                  column = 'living_arrangement'; break;
    case 'loan-source':             column = 'loan_source'; break;
    case 'economic-activity':       column = 'economic_activity'; break;
    case 'climate':                 column = 'climate_opinion'; break;
    case 'district':                column = 'district'; break;
    case 'own-phone':               column = 'own_phone'; break;
    default:
      return res.status(400).json({ error: 'Invalid chart type' });
  }

  const sql = `
    SELECT ${column} as label, COUNT(*) as count
    FROM bene_registration
    WHERE TRIM(beneficiary_cnic) != '' AND beneficiary_cnic IS NOT NULL
      AND TRIM(beneficiary_name) != '' AND beneficiary_name IS NOT NULL
    GROUP BY ${column}
  `;

  beneDb.all(sql, (err, rows) => {
    if (err) {
      console.error(`Chart ${type} query failed:`, err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    const result = {};
    rows.forEach(r => {
      let key = r.label ? String(r.label).trim().replace(/_/g, ' ') : 'Unknown';
      key = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      result[key] = r.count;
    });

    res.json(result);
  });
});

// 3. Age distribution
app.get('/api/age-distribution', (req, res) => {
  beneDb.all(`
    SELECT age 
    FROM bene_registration 
    WHERE TRIM(beneficiary_cnic) != '' AND beneficiary_cnic IS NOT NULL
      AND TRIM(beneficiary_name) != '' AND beneficiary_name IS NOT NULL
  `, (err, rows) => {
    if (err) {
      console.error('Age distribution query failed:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    const buckets = { '0-20': 0, '21-30': 0, '31-40': 0, '41-50': 0, '51+': 0, 'Unknown': 0 };

    rows.forEach(row => {
      const age = computeAge(row.age);
      if (age === null) {
        buckets['Unknown']++;
      } else if (age <= 20) {
        buckets['0-20']++;
      } else if (age <= 30) {
        buckets['21-30']++;
      } else if (age <= 40) {
        buckets['31-40']++;
      } else if (age <= 50) {
        buckets['41-50']++;
      } else {
        buckets['51+']++;
      }
    });

    res.json(buckets);
  });
});

// ─── Age helper function ─────────────────────────────────────────
function computeAge(rawAge) {
  if (!rawAge || String(rawAge).trim() === '') return null;
  const str = String(rawAge).trim();
  if (str.length > 4) return null;

  const num = Number(str);
  if (isNaN(num) || num < 0) return null;

  const currentYear = new Date().getFullYear();

  if (Number.isInteger(num)) {
    if (num >= 1900 && num <= currentYear) return currentYear - num;
    if (num <= 150) return num;
    return null;
  }

  return (num <= 150) ? num : null;
}

// 4. All beneficiary registration rows
app.get('/api/bene-data', (req, res) => {
  beneDb.all('SELECT * FROM bene_registration', (err, rows) => {
    if (err) {
      console.error('bene-data query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});

// 5. Trainer info
app.get('/api/trainers', (req, res) => {
  beneDb.all('SELECT trainer_name, trainer_cnic, trainer_ph_number, pair, assigned_ic, province, district, tehsil, duty_station, dflt_phase FROM trainers_info', (err, rows) => {
    if (err) {
      console.error('trainers query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});

// 6. Trainer GPS locations from attendance form
app.get('/api/trainer-locations', (req, res) => {
  beneDb.all(`
    SELECT trainer_name,
           "session_location-Latitude"  AS lat,
           "session_location-Longitude" AS lon
    FROM aspc_attendance_form
    WHERE "session_location-Latitude"  IS NOT NULL
      AND "session_location-Longitude" IS NOT NULL
  `, (err, rows) => {
    if (err) {
      console.error('trainer-locations query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});

// 8. Sessions (aspc_attendance_form)
app.get('/api/sessions', (req, res) => {
  beneDb.all('SELECT * FROM aspc_attendance_form ORDER BY SubmissionDate DESC', (err, rows) => {
    if (err) {
      console.error('sessions query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});

// 7. Last updated timestamp
// Registration trend by month
app.get('/api/registration-trend', (req, res) => {
  beneDb.all(`
    SELECT SUBSTR(SubmissionDate, 1, 7) as month, COUNT(*) as count
    FROM bene_registration
    WHERE TRIM(beneficiary_cnic) != '' AND beneficiary_cnic IS NOT NULL
      AND TRIM(beneficiary_name) != '' AND beneficiary_name IS NOT NULL
      AND SubmissionDate IS NOT NULL AND TRIM(SubmissionDate) != ''
    GROUP BY month
    ORDER BY month
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.get('/api/last-updated', (req, res) => {
  beneDb.get('SELECT MAX(SubmissionDate) AS last_updated FROM bene_registration', (err, row) => {
    if (err) {
      console.error('last-updated query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json({ last_updated: row?.last_updated || null });
  });
});

// 8. Teaching form submissions
app.get('/api/teaching', (req, res) => {
  beneDb.all('SELECT * FROM aspc_teaching_form ORDER BY starttime DESC', (err, rows) => {
    if (err) {
      console.error('teaching query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});

// 9. Pre-Post Day 1
app.get('/api/prepost-day1', (req, res) => {
  beneDb.all('SELECT * FROM prepost_day1 ORDER BY starttime DESC', (err, rows) => {
    if (err) {
      console.error('prepost-day1 query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});

// 10. Pre-Post Day 2
app.get('/api/prepost-day2', (req, res) => {
  beneDb.all('SELECT * FROM prepost_day2 ORDER BY starttime DESC', (err, rows) => {
    if (err) {
      console.error('prepost-day2 query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});

// 13. IC Monitoring Forms
app.get('/api/ic-monitoring', (req, res) => {
  beneDb.all('SELECT * FROM bisp_ic_form_inperson_monitoring ORDER BY starttime DESC', (err, rows) => {
    if (err) {
      console.error('ic-monitoring query failed:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});

// 10. Beneficiary Records – paginated + server-side filtered
app.get('/api/bene-records', (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(200, Math.max(10, parseInt(req.query.limit) || 50));
  const offset = (page - 1) * limit;
  const search = (req.query.search || '').trim();

  // Whitelisted filter column map  (query param → SQL column)
  const FILTER_MAP = {
    phase:      'dflt_phase',
    province:   'province',
    district:   'district',
    zones:      'zones',
    tehsil:     'tehsil',
    trainer:    'trainer_name',
    attendance: 'attendance_status',
    verified:   'verified_retention_status',
    own_phone:  'own_phone',
    bank:       'has_bank_account',
    mobile:     'has_mobile_money',
    loan:       'taken_loan',
    education:  'education',
    occupation: 'occupation',
    living:     'living_arrangement',
    economic:   'economic_activity',
  };

  const conditions = [
    "TRIM(beneficiary_cnic) != '' AND beneficiary_cnic IS NOT NULL",
    "TRIM(beneficiary_name) != '' AND beneficiary_name IS NOT NULL"
  ];
  const params = [];

  // Date range
  if (req.query.date_from) {
    conditions.push("SUBSTR(SubmissionDate,1,10) >= ?");
    params.push(req.query.date_from);
  }
  if (req.query.date_to) {
    conditions.push("SUBSTR(SubmissionDate,1,10) <= ?");
    params.push(req.query.date_to);
  }

  // Dropdown filters (values are parameterised — no injection risk)
  Object.entries(FILTER_MAP).forEach(([qp, col]) => {
    const val = (req.query[qp] || '').trim();
    if (val && val.toLowerCase() !== 'all') {
      conditions.push(`LOWER(TRIM(${col})) = LOWER(?)`);
      params.push(val);
    }
  });

  // Free-text search on name or CNIC
  if (search) {
    conditions.push('(beneficiary_name LIKE ? OR beneficiary_cnic LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = conditions.join(' AND ');

  const COLS = [
    'SUBSTR(SubmissionDate,1,10) AS SubmissionDate',
    'dflt_phase', 'zones', 'province', 'district', 'tehsil', 'duty_station',
    'trainer_name', 'beneficiary_name', 'beneficiary_cnic', 'age', 'education',
    'occupation', 'household_income', 'avg_savings',
    'economic_activity', 'attendance_status', 'verified_retention_status',
    'session_audit', 'collective_bene_cnic_photo'
  ].join(', ');

  beneDb.get(
    `SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN CAST(attendance_status AS TEXT) = '1' THEN 1 ELSE 0 END) AS day2_count,
      SUM(CASE WHEN LOWER(TRIM(verified_retention_status)) = 'verified' THEN 1 ELSE 0 END) AS verified_count
     FROM bene_registration WHERE ${where}`,
    params,
    (err, countRow) => {
    if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
    const total         = countRow.total;
    const day2_count    = countRow.day2_count    || 0;
    const verified_count = countRow.verified_count || 0;
    const pages = Math.ceil(total / limit);
    beneDb.all(
      `SELECT ${COLS} FROM bene_registration WHERE ${where} ORDER BY SubmissionDate DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
      (err2, rows) => {
        if (err2) return res.status(500).json({ error: 'Database error: ' + err2.message });
        res.json({ rows, total, day2_count, verified_count, page, pages, limit });
      }
    );
  });
});

// 11. Filter options for Beneficiary Data Explorer dropdowns
app.get('/api/bene-filter-opts', (req, res) => {
  const COLS = [
    'dflt_phase', 'zones', 'province', 'district', 'tehsil',
    'trainer_name', 'verified_retention_status', 'education', 'occupation',
    'living_arrangement', 'economic_activity', 'own_phone',
    'has_bank_account', 'has_mobile_money', 'taken_loan'
  ];
  const results = {};
  let pending = COLS.length;
  COLS.forEach(col => {
    beneDb.all(
      `SELECT DISTINCT TRIM(${col}) AS v FROM bene_registration
       WHERE ${col} IS NOT NULL AND TRIM(${col}) != ''
       ORDER BY v`,
      (err, rows) => {
        results[col] = err ? [] : rows.map(r => r.v).filter(Boolean);
        if (--pending === 0) res.json(results);
      }
    );
  });
});

// child_process exec removed – was only used for Windows browser auto-open

// 12. SurveyCTO Media Proxy – streams authenticated media back to logged-in users
app.get('/api/surveycto-proxy', (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl) return res.status(400).json({ error: 'Missing url parameter' });

  let parsedUrl;
  try { parsedUrl = new URL(rawUrl); } catch { return res.status(400).json({ error: 'Invalid URL' }); }

  // Security: only allow requests to the known SurveyCTO server
  if (parsedUrl.hostname !== 'dfltphase2.surveycto.com') {
    return res.status(403).json({ error: 'URL not allowed' });
  }

  const { surveycto_user, surveycto_password } = appConfig;
  if (!surveycto_user || !surveycto_password ||
      surveycto_user.startsWith('YOUR_')) {
    return res.status(503).json({ error: 'SurveyCTO credentials not configured in config.json' });
  }

  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${surveycto_user}:${surveycto_password}`).toString('base64')
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.set('Content-Type', proxyRes.headers['content-type'] || 'application/octet-stream');
    if (proxyRes.headers['content-disposition']) {
      res.set('Content-Disposition', proxyRes.headers['content-disposition']);
    }
    res.status(proxyRes.statusCode);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', (e) => res.status(502).json({ error: 'Proxy error: ' + e.message }));
  proxyReq.end();
});

// ─── Audio Reviewer Table Filter Options ────────────────────────
app.get('/api/audio-filter-opts', (req, res) => {
  const COLS = ['dflt_phase', 'province', 'district', 'provincial_coordinator'];
  const results = {};
  let pending = COLS.length;
  COLS.forEach(col => {
    beneDb.all(
      `SELECT DISTINCT TRIM(${col}) AS v FROM audio_reviewer_table
       WHERE ${col} IS NOT NULL AND TRIM(${col}) != ''
       ORDER BY v`,
      (err, rows) => {
        results[col] = err ? [] : rows.map(r => r.v).filter(Boolean);
        if (--pending === 0) res.json(results);
      }
    );
  });
});

// ─── Audio Reviewer Table – paginated + filtered ─────────────────
app.get('/api/audio-reviews', (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(100, Math.max(10, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;
  const search = (req.query.search || '').trim();

  const FILTER_MAP = {
    phase:    'dflt_phase',
    province: 'province',
    district: 'district',
    pc:       'provincial_coordinator',
    rating:   'overall_rating',
  };

  const conditions = [];
  const params = [];

  if (req.query.date_from) {
    conditions.push('review_date >= ?');
    params.push(req.query.date_from);
  }
  if (req.query.date_to) {
    conditions.push('review_date <= ?');
    params.push(req.query.date_to);
  }

  Object.entries(FILTER_MAP).forEach(([qp, col]) => {
    const val = (req.query[qp] || '').trim();
    if (val && val.toLowerCase() !== 'all') {
      conditions.push(`LOWER(TRIM(${col})) = LOWER(?)`);
      params.push(val);
    }
  });

  if (search) {
    conditions.push('(trainer_name LIKE ? OR Audio_reviewer_name LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const COLS = [
    'review_date', 'Audio_reviewer_name', 'trainer_name', 'trainer_cnic',
    'provincial_coordinator', 'province', 'district', 'tehsil', 'dflt_phase',
    'sdpi_reviewer', 'team_lead', 'duration_seconds',
    'any_technical_issue', 'training_language',
    'explanations_clear', 'concepts_explained', 'messages_communicated', 'syllabus_covered',
    'trainer_encouraged_questions', 'narrative_followed', 'real_life_examples',
    'time_managed', 'beneficiary_engagement',
    'sections_skipped', 'sections_skipped_details',
    'overall_rating', 'key_observations', 'trainer_recommendations'
  ].join(', ');

  beneDb.get(
    `SELECT
       COUNT(*) AS total,
       COUNT(DISTINCT LOWER(TRIM(trainer_name))) AS unique_trainers,
       AVG(CASE WHEN INSTR(overall_rating, '_') > 0
           THEN CAST(SUBSTR(overall_rating, 1, INSTR(overall_rating, '_') - 1) AS INTEGER)
           ELSE NULL END) AS avg_rating,
       SUM(CASE WHEN any_technical_issue IS NOT NULL
           AND LOWER(TRIM(any_technical_issue)) NOT IN ('', 'no') THEN 1 ELSE 0 END) AS issues_count
     FROM audio_reviewer_table ${where}`,
    params,
    (err, countRow) => {
      if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
      const total           = countRow.total           || 0;
      const unique_trainers = countRow.unique_trainers || 0;
      const avg_rating      = countRow.avg_rating      ? Number(countRow.avg_rating.toFixed(2)) : null;
      const issues_count    = countRow.issues_count    || 0;
      const pages = Math.ceil(total / limit);
      beneDb.all(
        `SELECT ${COLS} FROM audio_reviewer_table ${where} ORDER BY review_date DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset],
        (err2, rows) => {
          if (err2) return res.status(500).json({ error: 'Database error: ' + err2.message });
          res.json({ rows, total, unique_trainers, avg_rating, issues_count, page, pages, limit });
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  console.log('Available APIs:');
  console.log('  POST /api/login');
  console.log('  GET  /api/me');
  console.log('  GET  /api/kpis');
  console.log('  GET  /api/chart/:type');
  console.log('  GET  /api/age-distribution');
  console.log('  GET  /api/bene-data');
  console.log('  GET  /api/trainers');
  console.log('  GET  /api/trainer-locations');
  console.log('  GET  /api/last-updated');
  console.log('  GET  /api/sessions');
  console.log('  GET  /api/ic-monitoring');

  // Auto-open removed – not available on Linux servers
});