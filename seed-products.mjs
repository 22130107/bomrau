import mysql from 'mysql2/promise';
import fs from 'fs';

const envConfig = fs.readFileSync('.env.local', 'utf8');
for (const line of envConfig.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const mockProducts = [
  { name: "YoneThanKiem", price: 2499000, originalPrice: 3570000, discount: 30, petTim: "50+", sanTim: "20+", chuong: "Học Viện" },
  { name: "YasuoLongKiem", price: 2998000, originalPrice: 4282857, discount: 30, petTim: "80+", sanTim: "30+", chuong: "Kim Cương" },
  { name: "LeeTieuLong", price: 2998000, originalPrice: 4282857, discount: 30, petTim: "60+", sanTim: "15+", chuong: "Vàng" },
  { name: "ACC #400", price: 2999000, originalPrice: 3748750, discount: 20 },
  { name: "ACC #538", price: 2999000, originalPrice: 3748750, discount: 20 },
  { name: "ACC #416", price: 3499000, originalPrice: 4373750, discount: 20 },
];

const mockAccounts = [
  { productIndex: 0, username: "yone_king", password: "pass123", costPrice: 1800000 },
  { productIndex: 0, username: "yone_pro", password: "pass456", costPrice: 1800000 },
  { productIndex: 1, username: "yasuo_dragon", password: "pass123", costPrice: 2200000 },
  { productIndex: 2, username: "lee_master", password: "pass123", costPrice: 2000000 },
  { productIndex: 3, username: "player_400", password: "pass123", costPrice: 1500000 },
  { productIndex: 4, username: "player_538", password: "pass456", costPrice: 1500000 },
  { productIndex: 5, username: "player_416", password: "pass789", costPrice: 1800000 },
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
      console.log("VIP category not found! Creating it...");
      await pool.query(
        "INSERT INTO categories (name, slug, description, sort_order, fake_remaining_count, fake_sold_count) VALUES (?, ?, ?, ?, ?, ?)",
        ['VIP', 'vip', 'Tài khoản VIP cao cấp', 1, 15, 88]
      );
      const [newCats] = await pool.query('SELECT id FROM categories WHERE slug = ?', ['vip']);
      if (newCats.length === 0) {
        console.log("Failed to create VIP category!");
        return;
      }
      var vipId = newCats[0].id;
    } else {
      var vipId = cats[0].id;
    }

    // Insert products
    for (const p of mockProducts) {
      const [existing] = await pool.query('SELECT id FROM products WHERE title = ?', [p.name]);
      if (existing.length === 0) {
        const [result] = await pool.query(
          `INSERT INTO products (
            category_id, title, image_url, price, original_price, discount_percent, 
            fake_sold_count, fake_remaining_count, status,
            pet_tim, san_tim, chuong, extra_info
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            vipId,
            p.name,
            "",
            p.price,
            p.originalPrice,
            p.discount,
            10, // fake_sold_count
            5,  // fake_remaining_count
            'available',
            p.petTim || null,
            p.sanTim || null,
            p.chuong || null,
            null
          ]
        );
        console.log(`Inserted product: ${p.name} (id: ${result.insertId})`);
      } else {
        console.log(`Product already exists: ${p.name}`);
      }
    }

    // Insert accounts
    for (const a of mockAccounts) {
      const [products] = await pool.query('SELECT id FROM products WHERE title = ?', [mockProducts[a.productIndex].name]);
      if (products.length > 0) {
        const productId = products[0].id;
        const [existingAcc] = await pool.query(
          'SELECT id FROM accounts WHERE login_username = ? AND product_id = ?',
          [a.username, productId]
        );
        if (existingAcc.length === 0) {
          await pool.query(
            `INSERT INTO accounts (product_id, distributor_id, login_username, login_password, cost_price, status)
             VALUES (?, NULL, ?, ?, ?, 'available')`,
            [productId, a.username, a.password, a.costPrice]
          );
          console.log(`Inserted account: ${a.username} for product ${mockProducts[a.productIndex].name}`);
        } else {
          console.log(`Account already exists: ${a.username}`);
        }
      }
    }

    console.log("Done seeding mock data.");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
