import 'dotenv/config';
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

pool.on("error", (err) => {
  console.error("[ERRO] A conexão com o banco de dados foi interrompida:", err.message);
});
