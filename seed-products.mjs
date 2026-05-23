import mysql from 'mysql2/promise';
import fs from 'fs';

const envConfig = fs.readFileSync('.env.local', 'utf8');
for (const line of envConfig.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const mockProducts = [
  { id: "yone-than-kiem", name: "YoneThanKiem", price: 2499000, originalPrice: 3570000, discount: 30 },
  { id: "yasuo-long-kiem", name: "YasuoLongKiem", price: 2998000, originalPrice: 4282857, discount: 30 },
  { id: "lee-tieu-long", name: "LeeTieuLong", price: 2998000, originalPrice: 4282857, discount: 30 },
  { id: "acc-400", name: "ACC #400", price: 2999000, originalPrice: 3748750, discount: 20 },
  { id: "acc-538", name: "ACC #538", price: 2999000, originalPrice: 3748750, discount: 20 },
  { id: "acc-416", name: "ACC #416", price: 3499000, originalPrice: 4373750, discount: 20 },
];

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Get VIP category ID
    const [cats] = await pool.query('SELECT id FROM categories WHERE slug = ?', ['vip']);
    if (cats.length === 0) {
      console.log("VIP category not found!");
      return;
    }
    const vipId = cats[0].id;

    for (const p of mockProducts) {
      // Check if product exists by title
      const [existing] = await pool.query('SELECT id FROM products WHERE title = ?', [p.name]);
      if (existing.length === 0) {
        await pool.query(
          `INSERT INTO products (
            category_id, title, login_username, login_password, 
            price, final_price, discount_percent, status, description
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            vipId,
            p.name,
            p.id, // using id as fake username
            '123456', // fake password
            p.originalPrice,
            p.price,
            p.discount,
            'available',
            ''
          ]
        );
        console.log(`Inserted: ${p.name}`);
      } else {
        console.log(`Product already exists: ${p.name}`);
      }
    }
    console.log("Done inserting mock products.");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
