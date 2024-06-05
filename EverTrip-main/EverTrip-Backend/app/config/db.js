const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Nhan123456789',
    database: 'evertrip'
});

module.exports = db;
