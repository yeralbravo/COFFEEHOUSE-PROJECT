import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Solución para __dirname que no viene por defecto con "import"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
      ca: fs.readFileSync(path.join(__dirname, '../certs/ca-certificate.crt'))
      ,rejectUnauthorized: false 
  }
});

pool.getConnection()
  .then((connection) => {
    console.log('✅ << Conectado a la base de datos >>');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    process.exit(1);
  });

export default pool;