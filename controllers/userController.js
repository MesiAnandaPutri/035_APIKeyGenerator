const { User, ApiKey } = require('../models'); // Panggil Model User & ApiKey
const { v4: uuidv4 } = require('uuid'); // Library untuk bikin kode acak unik

const userController = {
    // 1. REGISTER USER (Yang sudah kamu buat tadi)
    register: async (req, res) => {
        try {
            const { first_name, last_name, email } = req.body;
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email sudah terdaftar!" });
            }
            const newUser = await User.create({ first_name, last_name, email });
            res.status(201).json({ message: "User berhasil didaftarkan!", data: newUser });
        } catch (error) {
            res.status(500).json({ message: "Gagal register", error: error.message });
        }
    },

    // 2. GENERATE API KEY (FITUR BARU)
    generateKey: async (req, res) => {
        try {
            const { email } = req.body; // User cukup kirim email saja

            // Cari User berdasarkan email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan! Daftar dulu." });
            }

            // Buat Key Baru
            const newKeyString = uuidv4(); // Contoh hasil: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
            
            // Tentukan Tanggal Kadaluarsa (Misal: 30 Hari dari sekarang)
            const today = new Date();
            const expiredDate = new Date(today.setDate(today.getDate() + 30));

            // Simpan ke Database
            const newApiKey = await ApiKey.create({
                key: newKeyString,
                status: 'active',
                user_id: user.id,
                last_date: expiredDate
            });

            res.status(201).json({
                message: "API Key berhasil dibuat!",
                api_key: newKeyString,
                expired_at: expiredDate
            });

        } catch (error) {
            res.status(500).json({ message: "Gagal generate key", error: error.message });
        }
    }
};

module.exports = userController;