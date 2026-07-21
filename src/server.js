const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const logger = require('./logger.cjs');
// Her HTTP isteğini (metod, yol, durum kodu, süre) otomatik olarak loglar
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

// SQL Bağlantı Ayarları
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // MySQL kullanıcı adın
    password: '',      // MySQL şifren
    database: 'fintrack_db'
});

db.connect((err) => {
    if (err) {
        console.error('SQL Bağlantı Hatası: ' + err.message);
        return;
    }
    console.log('SQL Veritabanına Başarıyla Bağlanıldı!');
});

// Test Endpoint (Çalışıp çalışmadığını anlamak için)
app.get('/', (req, res) => {
    res.send('FinTrack-T Server Çalışıyor!');
});

app.listen(5000, () => {
    console.log('Server 5000 portunda çalışıyor...');
});