const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Yagmur1012',
  database: 'fintrack_db',
  decimalNumbers: true,
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/', (req, res) => {
  res.send('FinTrack API çalışıyor!');
});

const DEFAULT_LIMITS = { gida: 5000, kira: 15000, ulasim: 2000, teknoloji: 10000, eglence: 3000, fatura: 4000 };

function mapUser(row) {
  return {
    username: row.username,
    fullName: row.full_name || '',
    phone: row.phone || '',
    address: row.address || '',
    email: row.email || '',
    job: row.job || '',
    birthDate: row.birth_date || '',
    gender: row.gender || 'Kadın'
  };
}

// ---------------- KAYIT OL ----------------
app.post('/api/register', async (req, res) => {
  const { username, password, fullName, securityAnswer } = req.body;
  if (!username || !password || !fullName || !securityAnswer) {
    return res.status(400).json({ error: 'fillAllFields' });
  }
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(409).json({ error: 'usernameTaken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const answerHash = await bcrypt.hash(securityAnswer.toLowerCase(), 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash, full_name, gender, security_answer_hash) VALUES (?,?,?,?,?)',
      [username, passwordHash, fullName, 'Kadın', answerHash]
    );
    const userId = result.insertId;
    await pool.query('INSERT INTO wallet (user_id) VALUES (?)', [userId]);
    await pool.query(
      'INSERT INTO spending_limits (user_id, gida, kira, ulasim, teknoloji, eglence, fatura) VALUES (?,?,?,?,?,?,?)',
      [userId, DEFAULT_LIMITS.gida, DEFAULT_LIMITS.kira, DEFAULT_LIMITS.ulasim, DEFAULT_LIMITS.teknoloji, DEFAULT_LIMITS.eglence, DEFAULT_LIMITS.fatura]
    );
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

// ---------------- GİRİŞ ----------------
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'loginFailed' });

    const match = await bcrypt.compare(password || '', rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'loginFailed' });

    res.json({ user: mapUser(rows[0]) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

// ---------------- ŞİFREMİ UNUTTUM ----------------
app.post('/api/forgot/verify', async (req, res) => {
  const { username, securityAnswer } = req.body;
  try {
    const [rows] = await pool.query('SELECT security_answer_hash FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(404).json({ error: 'userNotFound' });

    const match = await bcrypt.compare((securityAnswer || '').toLowerCase(), rows[0].security_answer_hash || '');
    if (!match) return res.status(401).json({ error: 'wrongAnswer' });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

app.post('/api/forgot/reset', async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query('UPDATE users SET password_hash = ? WHERE username = ?', [passwordHash, username]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'userNotFound' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

// ---------------- ŞİFRE DEĞİŞTİR (ayarlardan) ----------------
app.put('/api/user/:username/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE username = ?', [req.params.username]);
    if (rows.length === 0) return res.status(404).json({ error: 'userNotFound' });

    const match = await bcrypt.compare(currentPassword || '', rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'wrongCurrentPassword' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE username = ?', [newHash, req.params.username]);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

// ---------------- KULLANICI PROFİLİ ----------------
app.get('/api/user/:username', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [req.params.username]);
    if (rows.length === 0) return res.status(404).json({ error: 'userNotFound' });
    res.json({ user: mapUser(rows[0]) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

app.put('/api/user/:username', async (req, res) => {
  const { fullName, phone, address, email, job, birthDate, gender } = req.body;
  try {
    await pool.query(
      'UPDATE users SET full_name=?, phone=?, address=?, email=?, job=?, birth_date=?, gender=? WHERE username=?',
      [fullName, phone, address, email, job, birthDate || null, gender, req.params.username]
    );
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

// ---------------- CÜZDAN ----------------
app.get('/api/wallet/:username', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT w.bakiye, w.dolar, w.euro, w.altin FROM wallet w
       JOIN users u ON u.id = w.user_id WHERE u.username = ?`,
      [req.params.username]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'userNotFound' });
    res.json({ wallet: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

app.put('/api/wallet/:username', async (req, res) => {
  const { bakiye, dolar, euro, altin } = req.body;
  try {
    await pool.query(
      `UPDATE wallet w JOIN users u ON u.id = w.user_id
       SET w.bakiye=?, w.dolar=?, w.euro=?, w.altin=? WHERE u.username=?`,
      [bakiye, dolar, euro, altin, req.params.username]
    );
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

// ---------------- HARCAMA LİMİTLERİ ----------------
app.get('/api/limits/:username', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.gida, l.kira, l.ulasim, l.teknoloji, l.eglence, l.fatura FROM spending_limits l
       JOIN users u ON u.id = l.user_id WHERE u.username = ?`,
      [req.params.username]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'userNotFound' });
    res.json({ limits: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

app.put('/api/limits/:username', async (req, res) => {
  const { gida, kira, ulasim, teknoloji, eglence, fatura } = req.body;
  try {
    await pool.query(
      `UPDATE spending_limits l JOIN users u ON u.id = l.user_id
       SET l.gida=?, l.kira=?, l.ulasim=?, l.teknoloji=?, l.eglence=?, l.fatura=? WHERE u.username=?`,
      [gida, kira, ulasim, teknoloji, eglence, fatura, req.params.username]
    );
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

// ---------------- İŞLEMLER ----------------
app.get('/api/transactions/:username', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.desc_text AS \`desc\`, t.amount, t.category AS cat, t.tx_date AS date
       FROM transactions t JOIN users u ON u.id = t.user_id
       WHERE u.username = ? ORDER BY t.id DESC`,
      [req.params.username]
    );
    res.json({ transactions: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

app.post('/api/transactions/:username', async (req, res) => {
  const { desc, amount, cat, date } = req.body;
  try {
    const [userRows] = await pool.query('SELECT id FROM users WHERE username = ?', [req.params.username]);
    if (userRows.length === 0) return res.status(404).json({ error: 'userNotFound' });

    const [result] = await pool.query(
      'INSERT INTO transactions (user_id, desc_text, amount, category, tx_date) VALUES (?,?,?,?,?)',
      [userRows[0].id, desc, amount, cat, date]
    );
    res.json({ id: result.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

app.delete('/api/transactions/:username/:id', async (req, res) => {
  try {
    await pool.query(
      `DELETE t FROM transactions t JOIN users u ON u.id = t.user_id
       WHERE u.username = ? AND t.id = ?`,
      [req.params.username, req.params.id]
    );
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'serverError' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`FinTrack API http://localhost:${PORT} adresinde çalışıyor`);
});