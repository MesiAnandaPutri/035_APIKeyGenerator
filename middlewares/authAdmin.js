const jwt = require('jsonwebtoken');
const JWT_SECRET = 'rahasia-negara-api-key-manager'; // Pastikan sama dengan di Controller

const authAdmin = (req, res, next) => {
    try {
        // 1. Ambil Token dari Header (Authorization: Bearer <token>)
        const authHeader = req.headers['authorization'];
        
        // Cek apakah ada header Authorization
        if (!authHeader) {
            return res.status(401).json({ message: "Akses Ditolak! Header Authorization tidak ditemukan." });
        }

        // Format token biasanya "Bearer eyJhbGci..." jadi kita split ambil yang belakang
        const token = authHeader.split(' ')[1]; 
        
        if (!token) {
            return res.status(401).json({ message: "Akses Ditolak! Token kosong." });
        }

        // 2. Verifikasi Token
        const verified = jwt.verify(token, JWT_SECRET);
        
        // 3. Simpan data admin ke request supaya bisa dipakai di route selanjutnya
        req.user = verified; 
        next(); // Lanjut boleh masuk

    } catch (error) {
        res.status(400).json({ message: "Token Invalid / Sudah Expired!" });
    }
};

module.exports = authAdmin;