'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.js')[env];

const db = {};

// 1. MEMBUAT KONEKSI SEQUELIZE
let sequelize;
if (config.use_env_variable) {
  // Jika di production (biasanya pakai variabel environment url panjang)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Jika di local (development) pakai username, password, database dari config.js
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 2. LOAD OTOMATIS SEMUA FILE MODEL
// Script ini akan membaca semua file .js di folder 'models' ini
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&       // Abaikan file hidden
      file !== basename &&             // Abaikan file index.js ini sendiri
      file.slice(-3) === '.js' &&      // Hanya ambil file .js
      file.indexOf('.test.js') === -1  // Abaikan file testing
    );
  })
  .forEach(file => {
    // Import model dan inisialisasi
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // Masukkan ke object 'db'
    db[model.name] = model;
  });

// 3. JALANKAN ASOSIASI (RELASI ANTAR TABEL)
// Ini penting untuk diagram papan tulismu (One-to-Many User ke ApiKey)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export instance sequelize agar bisa dipakai di file lain
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;