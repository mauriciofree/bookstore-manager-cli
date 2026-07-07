import { pool } from './database/connection';

console.log("BookStore Manager CLI");
console.log("Aplicacao iniciada com sucesso.");



async function main() {
  try {
    const resultado = await pool.query('SELECT NOW()');

    console.log('Resultado SQL:');
    console.log(resultado.rows[0]);   

  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
  } finally {
    await pool.end();
  }

}

main();