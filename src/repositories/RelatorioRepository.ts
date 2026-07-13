import { pool } from "../database/connection";
import {
  RelatorioClienteComEmprestimoAtivo,
  RelatorioEmprestimosPorLivro,
  RelatorioLivroDisponivel,
  RelatorioLivroEmprestado,
  RelatorioLivrosPorAutor,
} from "../models/Relatorio";

export async function listarLivrosDisponiveis(): Promise<
  RelatorioLivroDisponivel[]
> {
  const sql = `SELECT livros.id AS livro_id,
                      livros.titulo,
                      livros.ano_publicacao,
                      autores.nome AS autor_nome,
                      livros.quantidade_total,
                      livros.quantidade_disponivel
                FROM livros
                INNER JOIN autores ON autores.id = livros.autor_id
                WHERE livros.quantidade_disponivel > 0
                ORDER BY livros.titulo`;

  const resultado = await pool.query<RelatorioLivroDisponivel>(sql);

  return resultado.rows;
}

export async function listarLivrosEmprestados(): Promise<
  RelatorioLivroEmprestado[]
> {
  const sql = `SELECT emprestimos.id AS emprestimo_id,
                      livros.id AS livro_id,
                      livros.titulo,
                      clientes.nome AS cliente_nome,
                      emprestimos.data_emprestimo
                FROM emprestimos
                INNER JOIN livros ON livros.id = emprestimos.livro_id
                INNER JOIN clientes ON clientes.id = emprestimos.cliente_id
                WHERE emprestimos.status = 'ativo'
                ORDER BY emprestimos.data_emprestimo DESC, livros.titulo`;

  const resultado = await pool.query<RelatorioLivroEmprestado>(sql);

  return resultado.rows;
}

export async function listarQuantidadeLivrosPorAutor(): Promise<
  RelatorioLivrosPorAutor[]
> {
  const sql = `SELECT autores.id AS autor_id,
                      autores.nome AS autor_nome,
                      COUNT(livros.id)::integer AS quantidade_livros
                FROM autores
                LEFT JOIN livros ON livros.autor_id = autores.id
                GROUP BY autores.id, autores.nome
                ORDER BY quantidade_livros DESC, autores.nome`;

  const resultado = await pool.query<RelatorioLivrosPorAutor>(sql);

  return resultado.rows;
}

export async function listarQuantidadeEmprestimosPorLivro(): Promise<
  RelatorioEmprestimosPorLivro[]
> {
  const sql = `SELECT livros.id AS livro_id,
                      livros.titulo,
                      autores.nome AS autor_nome,
                      COUNT(emprestimos.id)::integer AS quantidade_emprestimos
                FROM livros
                INNER JOIN autores ON autores.id = livros.autor_id
                LEFT JOIN emprestimos ON emprestimos.livro_id = livros.id
                GROUP BY livros.id, livros.titulo, autores.nome
                ORDER BY quantidade_emprestimos DESC, livros.titulo`;

  const resultado = await pool.query<RelatorioEmprestimosPorLivro>(sql);

  return resultado.rows;
}

export async function listarClientesComEmprestimosAtivos(): Promise<
  RelatorioClienteComEmprestimoAtivo[]
> {
  const sql = `SELECT clientes.id AS cliente_id,
                      clientes.nome AS cliente_nome,
                      clientes.email,
                      COUNT(emprestimos.id)::integer AS quantidade_emprestimos_ativos
                FROM clientes
                INNER JOIN emprestimos ON emprestimos.cliente_id = clientes.id
                WHERE emprestimos.status = 'ativo'
                GROUP BY clientes.id, clientes.nome, clientes.email
                ORDER BY quantidade_emprestimos_ativos DESC, clientes.nome`;

  const resultado = await pool.query<RelatorioClienteComEmprestimoAtivo>(sql);

  return resultado.rows;
}
