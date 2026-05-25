import mysql from 'mysql2/promise';
import fs from 'fs';

const envConfig = fs.readFileSync('.env.local', 'utf8');
for (const line of envConfig.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("Dropping old tables...");
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('DROP TABLE IF EXISTS orders');
    await pool.query('DROP TABLE IF EXISTS accounts');
    await pool.query('DROP TABLE IF EXISTS product_images');
    await pool.query('DROP TABLE IF EXISTS transactions');
    await pool.query('DROP TABLE IF EXISTS products');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log("Creating new products table...");
    await pool.query(`
      CREATE TABLE products (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_id INT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) DEFAULT NULL,
        price DECIMAL(15,0) NOT NULL,
        original_price DECIMAL(15,0) NOT NULL,
        discount_percent TINYINT UNSIGNED DEFAULT 0,
        fake_sold_count INT UNSIGNED DEFAULT 0,
        fake_remaining_count INT UNSIGNED DEFAULT 0,
        pet_tim VARCHAR(255) DEFAULT NULL,
        san_tim VARCHAR(255) DEFAULT NULL,
        chuong VARCHAR(255) DEFAULT NULL,
        extra_info TEXT DEFAULT NULL,
        status ENUM('available', 'hidden') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("Creating accounts table...");
    await pool.query(`
      CREATE TABLE accounts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id INT UNSIGNED NOT NULL,
        distributor_id INT UNSIGNED DEFAULT NULL,
        login_username VARCHAR(255) NOT NULL,
        login_password VARCHAR(255) NOT NULL,
        cost_price DECIMAL(15,0) DEFAULT 0,
        status ENUM('available', 'sold', 'hidden') DEFAULT 'available',
        note TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (distributor_id) REFERENCES distributors(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("Recreating orders table...");
    await pool.query(`
      CREATE TABLE orders (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        account_id INT UNSIGNED DEFAULT NULL,
        distributor_id INT UNSIGNED DEFAULT NULL,
        amount DECIMAL(15,0) NOT NULL,
        status ENUM('pending', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
        domain_purchased VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
        FOREIGN KEY (distributor_id) REFERENCES distributors(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("Database schema updated successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
}

run();
