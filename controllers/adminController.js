const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kunci rahasia untuk tiket (Nanti pindahkan ke .env kalo mau production)
const JWT_SECRET = 'rahasia-negara-api-key-manager'; 

const adminController = {
    // 1. SETUP: Bikin Admin Baru (Hanya untuk bikin akun pertama)
    createAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Enkripsi Password (Hashing)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAdmin = await Admin.create({
                email,
                password: hashedPassword // Simpan password yang sudah diacak
            });

            res.json({ message: "Admin berhasil dibuat!", data: newAdmin });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 2. LOGIN: Cek Password & Beri Token
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Cari Admin berdasarkan email
            const admin = await Admin.findOne({ where: { email } });
            if (!admin) {
                return res.status(404).json({ message: "Admin tidak ditemukan" });
            }

            // Cek Password (Bandingkan inputan dengan hash di DB)
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password salah!" });
            }

            // Login Sukses -> Buat Token (Tiket VIP)
            const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, {
                expiresIn: '1h' // Token berlaku 1 jam
            });

            res.json({
                message: "Login Berhasil!",
                token: token // <--- INI YANG PENTING
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = adminController;