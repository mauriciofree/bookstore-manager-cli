import { pool } from "../database/connection";
import { Livro, LivroComAutor } from "../models/Livro";

export async function criarLivro(titulo: string, 
                                 anoPublicacao: number, 
                                 quantidadeTotal: number, 
                                 autorId: number
                                ): Promise<Livro | null> {
  const sql = `INSERT INTO livros
                (titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id)
                VALUES ($1,$2,$3,$3,$4)
                RETURNING *`;

  const resultado = await pool.query<Livro>(sql, [titulo,
                                                  anoPublicacao,
                                                  quantidadeTotal,
                                                  autorId]);

  return resultado.rows[0] ?? null;
}

export async function listarLivros(
  limite: number,
  offset: number
): Promise<LivroComAutor[]> {
  const sql = `SELECT livros.*, autores.nome AS autor_nome
                FROM livros
                INNER JOIN autores ON autores.id = livros.autor_id
                ORDER BY livros.titulo, livros.ano_publicacao, autores.nome
                LIMIT $1
                OFFSET $2`;

  const resultado = await pool.query<LivroComAutor>(sql, [limite, offset]);

  return resultado.rows;
}

export async function contarLivros(): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM livros`;

  const resultado = await pool.query<{ total: string }>(sql);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function buscarLivroPorId(id: number): Promise<Livro | null> {
  const sql = `SELECT *
                FROM livros
                WHERE id = $1`;

  const resultado = await pool.query<Livro>(sql, [id]);

  return resultado.rows[0] ?? null;
}

export async function buscarLivroComAutorPorId(
  id: number
): Promise<LivroComAutor | null> {
  const sql = `SELECT livros.*, autores.nome AS autor_nome
                FROM livros
                INNER JOIN autores ON autores.id = livros.autor_id
                WHERE livros.id = $1`;

  const resultado = await pool.query<LivroComAutor>(sql, [id]);

  return resultado.rows[0] ?? null;
}

export async function buscarLivroPorTituloAnoAutor(titulo: string, 
                                                   anoPublicacao: number, 
                                                   autorId: number
                                                  ): Promise<Livro | null> {
  const sql = `SELECT *
                FROM livros
                WHERE LOWER(titulo) = LOWER($1)
                AND ano_publicacao = $2
                AND autor_id = $3`;

  const resultado = await pool.query<Livro>(sql, [titulo,
                                                  anoPublicacao,
                                                  autorId]);

  return resultado.rows[0] ?? null;
}

export async function buscarLivrosPorTituloParcial(
  titulo: string,
  limite: number,
  offset: number
): Promise<LivroComAutor[]> {
  const sql = `SELECT livros.*, autores.nome AS autor_nome
                FROM livros
                INNER JOIN autores ON autores.id = livros.autor_id
                WHERE livros.titulo ILIKE $1
                ORDER BY livros.titulo, livros.ano_publicacao, autores.nome
                LIMIT $2
                OFFSET $3`;

  const resultado = await pool.query<LivroComAutor>(sql, [`%${titulo}%`, limite, offset]);

  return resultado.rows;
}

export async function contarLivrosPorTituloParcial(
  titulo: string
): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM livros
                WHERE titulo ILIKE $1`;

  const resultado = await pool.query<{ total: string }>(sql, [`%${titulo}%`]);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function atualizarLivro(
  id: number,
  titulo: string, 
  anoPublicacao: number, 
  quantidadeTotal: number,
  quantidadeDisponivel: number,
  autorId: number
): Promise<Livro | null> {
  const sql = `UPDATE livros SET 
                titulo = $1,
                ano_publicacao = $2,
                quantidade_total = $3,
                quantidade_disponivel = $4,
                autor_id = $5
                WHERE id = $6
                RETURNING *`;

  const resultado = await pool.query<Livro>(sql, [titulo, 
                                                  anoPublicacao,
                                                  quantidadeTotal,
                                                  quantidadeDisponivel,
                                                  autorId,
                                                  id]);

  return resultado.rows[0] ?? null;
}

export async function deletarLivro(id: number): Promise<boolean> {
  const sql = `DELETE FROM livros
                WHERE id = $1`;

  const resultado = await pool.query(sql, [id]);

  return (resultado.rowCount ?? 0) > 0;
}
