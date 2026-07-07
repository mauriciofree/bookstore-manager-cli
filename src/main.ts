import { pool } from './database/connection';
import { exibirMenuPrincipal } from './menus/menuPrincipal';
import { fecharInput } from './utils/input';

async function main() {
  try {
    await pool.query('SELECT NOW()');

    await exibirMenuPrincipal();

  } catch (error) {
    console.error('Erro ao executar a aplicacao:', error);
  } finally {
    fecharInput();
    await pool.end();
  }

}

main();
