CREATE TABLE api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    `key` VARCHAR(255) NOT NULL UNIQUE, -- Menggunakan backtick (`) karena 'key' adalah reserved word di SQL
    status ENUM('active', 'inactive') DEFAULT 'active',
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_date DATETIME NOT NULL, -- Tanggal kedaluwarsa (expired)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE
);