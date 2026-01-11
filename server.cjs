const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fintrack_db'
});

db.connect((err) => {
    if (err) {
        console.error('SQL Baglanti Hatasi: ' + err.message);
        return;
    }
    console.log('SQL Veritabanina Basariyla Baglanildi!');
});

app.listen(5000, () => {
    console.log('Server 5000 portunda calisiyor...');
});
