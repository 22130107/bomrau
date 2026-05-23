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
    console.log("Adding fake counts columns...");
    try {
      await pool.query(`ALTER TABLE categories ADD COLUMN fake_remaining_count INT DEFAULT 0 AFTER sort_order;`);
      await pool.query(`ALTER TABLE categories ADD COLUMN fake_sold_count INT DEFAULT 0 AFTER fake_remaining_count;`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log("Columns already exist.");
      } else {
        throw e;
      }
    }

    // Set initial mock values for some specific categories based on the previous hardcoded values
    // VIP: sold: 88, remaining: 15
    await pool.query(`UPDATE categories SET fake_sold_count=88, fake_remaining_count=15 WHERE slug='vip'`);
    // Siêu rẻ: sold: 2858, remaining: 107
    await pool.query(`UPDATE categories SET fake_sold_count=2858, fake_remaining_count=107 WHERE slug='cheaper'`);
    // Pet tím: sold: 1273, remaining: 12
    await pool.query(`UPDATE categories SET fake_sold_count=1273, fake_remaining_count=12 WHERE slug='pet'`);

    console.log("Columns added successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
