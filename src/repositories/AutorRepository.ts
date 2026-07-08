import { pool } from "../database/connection";
import { Autor } from "../models/Autor";

export async function criarAutor(nome: string): Promise<Autor | null> {
  const sql = `INSERT INTO autores
                (nome)
                VALUES ($1)
                RETURNING *`;

  const resultado = await pool.query<Autor>(sql, [nome]);

  return resultado.rows[0] ?? null;
}

export async function listarAutores(
  limite: number,
  offset: number
): Promise<Autor[]> {
  const sql = `SELECT *
                FROM autores
                ORDER BY nome
                LIMIT $1
                OFFSET $2`;

  const resultado = await pool.query<Autor>(sql, [limite, offset]);

  return resultado.rows;
}

export async function contarAutores(): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM autores`;

  const resultado = await pool.query<{ total: string }>(sql);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function buscarAutorPorId(id: number): Promise<Autor | null> {
  const sql = `SELECT *
                FROM autores
                WHERE id = $1`;

  const resultado = await pool.query<Autor>(sql, [id]);

  return resultado.rows[0] ?? null;
}

export async function buscarAutorPorNome(nome: string): Promise<Autor | null> {
  const sql = `SELECT *
                FROM autores
                WHERE LOWER(nome) = LOWER($1)`;

  const resultado = await pool.query<Autor>(sql, [nome]);

  return resultado.rows[0] ?? null;
}

export async function buscarAutoresPorNomeParcial(
  nome: string,
  limite: number,
  offset: number
): Promise<Autor[]> {
  const sql = `SELECT *
                FROM autores
                WHERE nome ILIKE $1
                ORDER BY nome
                LIMIT $2
                OFFSET $3`;

  const resultado = await pool.query<Autor>(sql, [`%${nome}%`, limite, offset]);

  return resultado.rows;
}

export async function contarAutoresPorNomeParcial(
  nome: string
): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM autores
                WHERE nome ILIKE $1`;

  const resultado = await pool.query<{ total: string }>(sql, [`%${nome}%`]);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function atualizarAutor(
  id: number,
  nome: string
): Promise<Autor | null> {
  const sql = `UPDATE autores
                SET nome = $1
                WHERE id = $2
                RETURNING *`;

  const resultado = await pool.query<Autor>(sql, [nome, id]);

  return resultado.rows[0] ?? null;
}

export async function deletarAutor(id: number): Promise<boolean> {
  const sql = `DELETE FROM autores
                WHERE id = $1`;

  const resultado = await pool.query(sql, [id]);

  return (resultado.rowCount ?? 0) > 0;
}
