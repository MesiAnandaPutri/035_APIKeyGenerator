const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Import folder models (otomatis baca index.js di dalam folder models)
const db = require('./models'); 

// Import Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors()); // Agar bisa diakses dari frontend manapun
app.use(bodyParser.json()); // Agar bisa baca input JSON dari Postman
app.use(bodyParser.urlencoded({ extended: true })); // Agar bisa baca input form standar
app.use(express.static('public'));

// --- ROUTES (JALUR API) ---
// Jalur Utama untuk Cek Server
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to API Key Management System",
        status: "Server is Running Properly"
    });
});

// Jalur untuk User (Register, dll)
// Semua URL yang berawalan /users akan diarahkan ke userRoutes
// Contoh: http://localhost:3000/users/register
app.use('/users', userRoutes);

app.use('/admin', adminRoutes);
// --- SINKRONISASI DATABASE & JALANKAN SERVER ---
// force: false -> Data tidak akan dihapus saat server restart
// alter: true  -> Struktur tabel akan diperbaiki jika kamu mengubah file Model
db.sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log("✅ Database tersinkronisasi!");
        
        // Setelah DB siap, baru server jalan
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Gagal sinkronisasi database:", err.message);
    });