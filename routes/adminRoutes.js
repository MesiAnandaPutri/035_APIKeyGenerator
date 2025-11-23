const express = require('express');
const router = express.Router();
const { User, ApiKey } = require('../models'); // Import Model Database
const adminController = require('../controllers/adminController'); // Import Controller Login
const authAdmin = require('../middlewares/authAdmin'); // Import Satpam Token tadi

// ==========================================
// 🔓 PUBLIC ROUTES (Bisa diakses tanpa Token)
// ==========================================

// 1. Setup Admin Pertama (Buat Akun)
router.post('/setup', adminController.createAdmin);

// 2. Login Admin (Dapet Token)
router.post('/login', adminController.login);


// ==========================================
// 🔒 PROTECTED ROUTES (Butuh Token Admin)
// ==========================================

// Pasang Satpam di sini. Semua route di bawah baris ini WAJIB punya Token.
router.use(authAdmin);

// 3. Dashboard: Lihat Semua User
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({
            message: "Data Semua User (Khusus Admin)",
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Dashboard: Lihat Semua API Key
router.get('/keys', async (req, res) => {
    try {
        const keys = await ApiKey.findAll({
            include: [{ model: User, as: 'user' }] // Join dengan tabel user
        });
        res.json({
            message: "Data Semua API Key",
            data: keys
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Dashboard: Matikan/Hidupkan Key (Ban User)
router.put('/keys/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' atau 'inactive'

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: "Status harus 'active' atau 'inactive'" });
        }

        const apiKey = await ApiKey.findByPk(id);
        if (!apiKey) {
            return res.status(404).json({ message: "API Key tidak ditemukan" });
        }

        apiKey.status = status;
        await apiKey.save();

        res.json({
            message: `Sukses! Status Key ID ${id} diubah menjadi ${status}`,
            data: apiKey
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;