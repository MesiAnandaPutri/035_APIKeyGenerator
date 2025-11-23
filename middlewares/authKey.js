const { ApiKey } = require('../models');

const authKey = async (req, res, next) => {
    try {
        // 1. Cari kunci di Header (Postman -> Headers -> x-api-key)
        const keyFromHeader = req.headers['x-api-key'];

        if (!keyFromHeader) {
            return res.status(401).json({ message: "Mana kuncinya? (Header 'x-api-key' kosong)" });
        }

        // 2. Cek ke Database
        const validKey = await ApiKey.findOne({ 
            where: { 
                key: keyFromHeader,
                status: 'active' // Harus status Active
            } 
        });

        // 3. Validasi
        if (!validKey) {
            return res.status(403).json({ message: "Kunci tidak valid atau sudah tidak aktif!" });
        }

        // 4. Cek Tanggal Kadaluarsa (Optional tapi penting sesuai papan tulis)
        const now = new Date();
        if (new Date(validKey.last_date) < now) {
            return res.status(403).json({ message: "Kunci sudah kadaluarsa (Expired)!" });
        }

        // 5. Lolos! Silakan masuk
        // Kita simpan info user di request supaya bisa dipakai nanti
        req.user_id = validKey.user_id;
        next(); 

    } catch (error) {
        res.status(500).json({ message: "Error Server", error: error.message });
    }
};

module.exports = authKey;