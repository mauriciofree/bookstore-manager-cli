import { pool } from "../database/connection";
import { Emprestimo, EmprestimoComDetalhes } from "../models/Emprestimo";

export async function criarEmprestimo(
  livroId: number,
  clienteId: number
): Promise<Emprestimo | null> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const emprestimoSql = `INSERT INTO emprestimos
                            (livro_id, cliente_id)
                            VALUES ($1, $2)
                            RETURNING *`;

    const emprestimoResultado = await client.query<Emprestimo>(emprestimoSql, [
      livroId,
      clienteId,
    ]);
    const emprestimo = emprestimoResultado.rows[0] ?? null;

    const livroSql = `UPDATE livros
                       SET quantidade_disponivel = quantidade_disponivel - 1
                       WHERE id = $1
                         AND quantidade_disponivel > 0
                       RETURNING *`;

    const livroResultado = await client.query(livroSql, [livroId]);

    if (!emprestimo || livroResultado.rowCount !== 1) {
      throw new Error("Não foi possível atualizar a disponibilidade do livro.");
    }

    await client.query("COMMIT");
    return emprestimo;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function registrarDevolucao(
  emprestimoId: number
): Promise<Emprestimo | null> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const emprestimoSql = `UPDATE emprestimos
                            SET status = 'devolvido',
                                data_devolucao = CURRENT_TIMESTAMP
                            WHERE id = $1
                              AND status = 'ativo'
                            RETURNING *`;

    const emprestimoResultado = await client.query<Emprestimo>(emprestimoSql, [
      emprestimoId,
    ]);
    const emprestimo = emprestimoResultado.rows[0] ?? null;

    if (!emprestimo) {
      throw new Error("Empréstimo ativo não encontrado.");
    }

    const livroSql = `UPDATE livros
                       SET quantidade_disponivel = quantidade_disponivel + 1
                       WHERE id = $1
                       RETURNING *`;

    const livroResultado = await client.query(livroSql, [emprestimo.livro_id]);

    if (livroResultado.rowCount !== 1) {
      throw new Error("Não foi possível atualizar a disponibilidade do livro.");
    }

    await client.query("COMMIT");
    return emprestimo;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listarEmprestimos(
  limite: number,
  offset: number
): Promise<EmprestimoComDetalhes[]> {
  const sql = `SELECT emprestimos.*,
                      livros.titulo AS livro_titulo,
                      livros.ano_publicacao AS livro_ano_publicacao,
                      clientes.nome AS cliente_nome
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                WHERE emprestimos.status = 'ativo'
                ORDER BY emprestimos.data_emprestimo DESC, emprestimos.id DESC
                LIMIT $1
                OFFSET $2`;

  const resultado = await pool.query<EmprestimoComDetalhes>(sql, [limite, offset]);

  return resultado.rows;
}

export async function contarEmprestimos(): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM emprestimos
                WHERE status = 'ativo'`;

  const resultado = await pool.query<{ total: string }>(sql);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function listarHistoricoEmprestimos(
  limite: number,
  offset: number
): Promise<EmprestimoComDetalhes[]> {
  const sql = `SELECT emprestimos.*,
                      livros.titulo AS livro_titulo,
                      livros.ano_publicacao AS livro_ano_publicacao,
                      clientes.nome AS cliente_nome
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                ORDER BY emprestimos.data_emprestimo DESC, emprestimos.id DESC
                LIMIT $1
                OFFSET $2`;

  const resultado = await pool.query<EmprestimoComDetalhes>(sql, [limite, offset]);

  return resultado.rows;
}

export async function contarHistoricoEmprestimos(): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM emprestimos`;

  const resultado = await pool.query<{ total: string }>(sql);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function buscarEmprestimosPorIdLivro(
  livroId: number,
  limite: number,
  offset: number
): Promise<EmprestimoComDetalhes[]> {
  const sql = `SELECT emprestimos.*,
                      livros.titulo AS livro_titulo,
                      livros.ano_publicacao AS livro_ano_publicacao,
                      clientes.nome AS cliente_nome
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                WHERE emprestimos.livro_id = $1
                  AND emprestimos.status = 'ativo'
                ORDER BY emprestimos.data_emprestimo DESC, emprestimos.id DESC
                LIMIT $2
                OFFSET $3`;

  const resultado = await pool.query<EmprestimoComDetalhes>(sql, [
    livroId,
    limite,
    offset,
  ]);

  return resultado.rows;
}

export async function contarEmprestimosPorIdLivro(
  livroId: number
): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM emprestimos
                WHERE livro_id = $1
                  AND status = 'ativo'`;

  const resultado = await pool.query<{ total: string }>(sql, [livroId]);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function buscarEmprestimosPorTituloLivro(
  titulo: string,
  limite: number,
  offset: number
): Promise<EmprestimoComDetalhes[]> {
  const sql = `SELECT emprestimos.*,
                      livros.titulo AS livro_titulo,
                      livros.ano_publicacao AS livro_ano_publicacao,
                      clientes.nome AS cliente_nome
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                WHERE livros.titulo ILIKE $1
                  AND emprestimos.status = 'ativo'
                ORDER BY emprestimos.data_emprestimo DESC, emprestimos.id DESC
                LIMIT $2
                OFFSET $3`;

  const resultado = await pool.query<EmprestimoComDetalhes>(sql, [
    `%${titulo}%`,
    limite,
    offset,
  ]);

  return resultado.rows;
}

export async function contarEmprestimosPorTituloLivro(
  titulo: string
): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                WHERE livros.titulo ILIKE $1
                  AND emprestimos.status = 'ativo'`;

  const resultado = await pool.query<{ total: string }>(sql, [`%${titulo}%`]);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function buscarEmprestimosPorIdCliente(
  clienteId: number,
  limite: number,
  offset: number
): Promise<EmprestimoComDetalhes[]> {
  const sql = `SELECT emprestimos.*,
                      livros.titulo AS livro_titulo,
                      livros.ano_publicacao AS livro_ano_publicacao,
                      clientes.nome AS cliente_nome
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                WHERE emprestimos.cliente_id = $1
                  AND emprestimos.status = 'ativo'
                ORDER BY emprestimos.data_emprestimo DESC, emprestimos.id DESC
                LIMIT $2
                OFFSET $3`;

  const resultado = await pool.query<EmprestimoComDetalhes>(sql, [
    clienteId,
    limite,
    offset,
  ]);

  return resultado.rows;
}

export async function contarEmprestimosPorIdCliente(
  clienteId: number
): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM emprestimos
                WHERE cliente_id = $1
                  AND status = 'ativo'`;

  const resultado = await pool.query<{ total: string }>(sql, [clienteId]);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function buscarEmprestimosPorNomeCliente(
  nome: string,
  limite: number,
  offset: number
): Promise<EmprestimoComDetalhes[]> {
  const sql = `SELECT emprestimos.*,
                      livros.titulo AS livro_titulo,
                      livros.ano_publicacao AS livro_ano_publicacao,
                      clientes.nome AS cliente_nome
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                WHERE clientes.nome ILIKE $1
                  AND emprestimos.status = 'ativo'
                ORDER BY emprestimos.data_emprestimo DESC, emprestimos.id DESC
                LIMIT $2
                OFFSET $3`;

  const resultado = await pool.query<EmprestimoComDetalhes>(sql, [
    `%${nome}%`,
    limite,
    offset,
  ]);

  return resultado.rows;
}

export async function contarEmprestimosPorNomeCliente(
  nome: string
): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM emprestimos
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                WHERE clientes.nome ILIKE $1
                  AND emprestimos.status = 'ativo'`;

  const resultado = await pool.query<{ total: string }>(sql, [`%${nome}%`]);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function buscarEmprestimoPorId(
  id: number
): Promise<EmprestimoComDetalhes | null> {
  const sql = `SELECT emprestimos.*,
                      livros.titulo AS livro_titulo,
                      livros.ano_publicacao AS livro_ano_publicacao,
                      clientes.nome AS cliente_nome
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                WHERE emprestimos.id = $1`;

  const resultado = await pool.query<EmprestimoComDetalhes>(sql, [id]);

  return resultado.rows[0] ?? null;
}

export async function buscarEmprestimoAtivoPorLivroCliente(
  livroId: number,
  clienteId: number
): Promise<Emprestimo | null> {
  const sql = `SELECT *
                FROM emprestimos
                WHERE livro_id = $1
                  AND cliente_id = $2
                  AND status = 'ativo'`;

  const resultado = await pool.query<Emprestimo>(sql, [livroId, clienteId]);

  return resultado.rows[0] ?? null;
}
