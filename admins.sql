CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Panjang 255 untuk menyimpan hash password (bcrypt)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);