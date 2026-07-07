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

export async function listarAutores(): Promise<Autor[]> {
  const sql = `SELECT *
                FROM autores
                ORDER BY nome`;

  const resultado = await pool.query<Autor>(sql);

  return resultado.rows;
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
  nome: string
): Promise<Autor[]> {
  const sql = `SELECT *
                FROM autores
                WHERE nome ILIKE $1
                ORDER BY nome`;

  const resultado = await pool.query<Autor>(sql, [`%${nome}%`]);

  return resultado.rows;
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

