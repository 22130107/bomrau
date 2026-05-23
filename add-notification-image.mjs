import mysql from 'mysql2/promise';
import fs from 'fs';

let envFile = '.env';
if (!fs.existsSync(envFile)) {
  envFile = '.env.local';
}

const envConfig = fs.readFileSync(envFile, 'utf8');
for (const line of envConfig.split('\n')) {
  const match = line.trim().match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "12345",
    database: process.env.DB_NAME || "bomrautft",
  });

  try {
    console.log("Adding image_url column to notifications table...");
    try {
      await pool.query(`ALTER TABLE notifications ADD COLUMN image_url VARCHAR(500) DEFAULT NULL AFTER content;`);
      console.log("Column added successfully!");
    } catch (e) {
      if (e.code === 'ER_DUP_COLUMN' || e.code === 'ER_DUP_FIELDNAME') {
        console.log("Column image_url already exists.");
      } else {
        throw e;
      }
    }
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
}

run();
