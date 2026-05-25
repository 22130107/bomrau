const mysql = require("mysql2/promise");
(async () => {
  const pool = mysql.createPool({
    host: "localhost", user: "root", password: "12345",
    database: "bomrautft", waitForConnections: true, connectionLimit: 1
  });
  const [r] = await pool.query("DESCRIBE products");
  r.forEach(c => console.log(c.Field + ": " + c.Type));
  await pool.end();
})();
