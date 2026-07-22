require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const logger = require('./logger.cjs');

const app = express();
app.use(cors());
app.use(express.json());

// Her HTTP isteğini (metod, yol, durum kodu, süre) otomatik olarak loglar — tek bir yerde
// tanımlandığı için aşağıdaki tüm endpoint'leri tek tek değiştirmeye gerek kalmadan
// Elasticsearch'e istek bazlı log akışı sağlar.
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP isteği', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start
    });
  });
  next();
});

// --- MySQL bağlantı bilgisi: .env dosyasından (yoksa localdeki eski değerlerden) okunuyor ---
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Yagmur1012',
  database: process.env.DB_NAME || 'fintrack_db',
  decimalNumbers: true, // DECIMAL kolonları JS number olarak döner
  waitForConnections: true,
  connectionLimit: 10,
  // Aiven gibi bulut MySQL servisleri SSL zorunlu tutuyor; DB_SSL=true ise devreye girer
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
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
  const { username, password, fullName, email, securityAnswer } = req.body;
  if (!username || !password || !fullName || !email || !securityAnswer) {
    return res.status(400).json({ error: 'fillAllFields' });
  }
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(409).json({ error: 'usernameTaken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const answerHash = await bcrypt.hash(securityAnswer.toLowerCase(), 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash, full_name, email, gender, security_answer_hash) VALUES (?,?,?,?,?,?)',
      [username, passwordHash, fullName, email, 'Kadın', answerHash]
    );
    const userId = result.insertId;
    // Yeni hesap tamamen sıfırdan başlıyor — daha önce hiç almadığı halde 100.000 TL/dolar/euro/altına
    // sahipmiş gibi görünmesi kafa karıştırıcıydı, bu yüzden hepsi 0'dan başlıyor.
    await pool.query(
      'INSERT INTO wallet (user_id, bakiye, dolar, euro, altin) VALUES (?, 0, 0, 0, 0)',
      [userId]
    );
    await pool.query(
      'INSERT INTO spending_limits (user_id, gida, kira, ulasim, teknoloji, eglence, fatura) VALUES (?,?,?,?,?,?,?)',
      [userId, DEFAULT_LIMITS.gida, DEFAULT_LIMITS.kira, DEFAULT_LIMITS.ulasim, DEFAULT_LIMITS.teknoloji, DEFAULT_LIMITS.eglence, DEFAULT_LIMITS.fatura]
    );
    logger.info('Yeni kullanıcı kaydı', { username });
    res.json({ success: true });
  } catch (e) {
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
    res.status(500).json({ error: 'serverError' });
  }
});

// ---------------- GİRİŞ ----------------
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      logger.warn('Başarısız giriş denemesi (kullanıcı yok)', { username });
      return res.status(401).json({ error: 'loginFailed' });
    }

    const match = await bcrypt.compare(password || '', rows[0].password_hash);
    if (!match) {
      logger.warn('Başarısız giriş denemesi (yanlış şifre)', { username });
      return res.status(401).json({ error: 'loginFailed' });
    }

    logger.info('Kullanıcı girişi başarılı', { username });
    res.json({ user: mapUser(rows[0]) });
  } catch (e) {
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    if (!match) {
      logger.warn('Şifremi unuttum: yanlış güvenlik sorusu cevabı', { username });
      return res.status(401).json({ error: 'wrongAnswer' });
    }

    logger.info('Şifremi unuttum: güvenlik sorusu doğrulandı', { username });
    res.json({ success: true });
  } catch (e) {
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
    res.status(500).json({ error: 'serverError' });
  }
});

app.post('/api/forgot/reset', async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query('UPDATE users SET password_hash = ? WHERE username = ?', [passwordHash, username]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'userNotFound' });
    logger.info('Şifre sıfırlandı (şifremi unuttum akışı)', { username });
    res.json({ success: true });
  } catch (e) {
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    if (!match) {
      logger.warn('Şifre değiştirme: mevcut şifre yanlış girildi', { username: req.params.username });
      return res.status(401).json({ error: 'wrongCurrentPassword' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE username = ?', [newHash, req.params.username]);
    logger.info('Şifre değiştirildi (ayarlardan)', { username: req.params.username });
    res.json({ success: true });
  } catch (e) {
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.info('Yeni işlem eklendi', { username: req.params.username, transactionId: result.insertId, amount, category: cat });
    res.json({ id: result.insertId });
  } catch (e) {
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
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
    logger.info('İşlem silindi', { username: req.params.username, transactionId: req.params.id });
    res.json({ success: true });
  } catch (e) {
    logger.error('Sunucu hatası', { message: e.message, stack: e.stack });
    res.status(500).json({ error: 'serverError' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`FinTrack API başlatıldı`, { port: PORT });
});