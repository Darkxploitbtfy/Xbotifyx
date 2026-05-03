'use strict';

const express = require('express');
const session = require('express-session');
const path    = require('path');
const { getBotState }                           = require('../bot');
const { addUser, getAllUsers, removeUser }       = require('../utils/users');

const app   = express();
const VIEWS = path.join(__dirname, 'views');

const ADMIN_USER = 'katson';
const ADMIN_PASS = '#jesusfuckingchrist#';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret:            process.env.SESSION_SECRET || 'botify-x-v103-secret',
  resave:            false,
  saveUninitialized: false,
  cookie:            { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
}));

function requireLogin(req, res, next) {
  if (req.session?.loggedIn) return next();
  res.redirect('/panel');
}

function page(res, file) { res.sendFile(path.join(VIEWS, file)); }

/* ── Redirects ─────────────────────────────────────── */
app.get('/', (req, res) => res.redirect('/panel'));

app.get('/panel', (req, res) => {
  if (req.session?.loggedIn) {
    return res.redirect(getBotState().connected ? '/panel/dashboard' : '/panel/pairing');
  }
  page(res, 'login.html');
});

/* ── Auth ───────────────────────────────────────────── */
app.post('/panel/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.loggedIn = true;
    return res.redirect(getBotState().connected ? '/panel/dashboard' : '/panel/pairing');
  }
  res.redirect('/panel?error=1');
});

app.get('/panel/logout', (req, res) => req.session.destroy(() => res.redirect('/panel')));

/* ── Pages ──────────────────────────────────────────── */
app.get('/panel/pairing',   requireLogin, (req, res) => {
  if (getBotState().connected) return res.redirect('/panel/dashboard');
  page(res, 'pairing.html');
});

app.get('/panel/dashboard', requireLogin, (req, res) => page(res, 'dashboard.html'));

/* ══════════════════════════════════════════════════════
   JSON API — used by HTML pages via fetch()
══════════════════════════════════════════════════════ */

app.get('/panel/api/status', requireLogin, (req, res) => {
  const s = getBotState();
  res.json({ connected: s.connected, phone: s.phoneNumber });
});

app.post('/panel/api/generate-code', requireLogin, async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required.' });
  const s = getBotState();
  if (s.connected) return res.json({ connected: true });
  if (!s.socket)   return res.status(503).json({ error: 'Bot is initializing — wait a moment.' });
  try {
    const clean = phone.replace(/\D/g, '');
    const code  = await s.socket.requestPairingCode(clean);
    s.pairingCode = code;
    s.phoneNumber = clean;
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/panel/api/users', requireLogin, (req, res) => {
  res.json({ users: getAllUsers() });
});

app.post('/panel/api/users', requireLogin, (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required.' });
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 7) return res.status(400).json({ error: 'Invalid phone number.' });
  try {
    const user = addUser(clean);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/panel/api/users/:number', requireLogin, (req, res) => {
  removeUser(req.params.number);
  res.json({ success: true });
});

function startDashboard() {
  return new Promise(resolve => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[DASHBOARD] http://0.0.0.0:${PORT}/panel`);
      resolve();
    });
  });
}

module.exports = { startDashboard };
