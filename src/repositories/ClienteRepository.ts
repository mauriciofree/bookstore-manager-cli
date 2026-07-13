import { pool } from "../database/connection";
import { Cliente } from "../models/Cliente";

export async function criarCliente(
  nome: string,
  email: string,
  telefone: string | null
): Promise<Cliente | null> {
  const sql = `INSERT INTO clientes
                (nome, email, telefone)
                VALUES ($1, $2, $3)
                RETURNING *`;

  const resultado = await pool.query<Cliente>(sql, [nome, email, telefone]);

  return resultado.rows[0] ?? null;
}

export async function listarClientes(
  limite: number,
  offset: number
): Promise<Cliente[]> {
  const sql = `SELECT *
                FROM clientes
                ORDER BY nome
                LIMIT $1
                OFFSET $2`;

  const resultado = await pool.query<Cliente>(sql, [limite, offset]);

  return resultado.rows;
}

export async function contarClientes(): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM clientes`;

  const resultado = await pool.query<{ total: string }>(sql);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function buscarClientePorId(id: number): Promise<Cliente | null> {
  const sql = `SELECT *
                FROM clientes
                WHERE id = $1`;

  const resultado = await pool.query<Cliente>(sql, [id]);

  return resultado.rows[0] ?? null;
}

export async function buscarClientePorEmail(
  email: string
): Promise<Cliente | null> {
  const sql = `SELECT *
                FROM clientes
                WHERE LOWER(email) = LOWER($1)`;

  const resultado = await pool.query<Cliente>(sql, [email]);

  return resultado.rows[0] ?? null;
}

export async function buscarClientesPorNomeParcial(
  nome: string,
  limite: number,
  offset: number
): Promise<Cliente[]> {
  const sql = `SELECT *
                FROM clientes
                WHERE nome ILIKE $1
                ORDER BY nome
                LIMIT $2
                OFFSET $3`;

  const resultado = await pool.query<Cliente>(sql, [`%${nome}%`, limite, offset]);

  return resultado.rows;
}

export async function contarClientesPorNomeParcial(
  nome: string
): Promise<number> {
  const sql = `SELECT COUNT(*) AS total
                FROM clientes
                WHERE nome ILIKE $1`;

  const resultado = await pool.query<{ total: string }>(sql, [`%${nome}%`]);
  const primeiraLinha = resultado.rows[0];

  return Number(primeiraLinha?.total ?? 0);
}

export async function atualizarCliente(
  id: number,
  nome: string,
  email: string,
  telefone: string | null
): Promise<Cliente | null> {
  const sql = `UPDATE clientes
                SET nome = $1,
                    email = $2,
                    telefone = $3
                WHERE id = $4
                RETURNING *`;

  const resultado = await pool.query<Cliente>(sql, [nome, email, telefone, id]);

  return resultado.rows[0] ?? null;
}

export async function deletarCliente(id: number): Promise<boolean> {
  const sql = `DELETE FROM clientes
                WHERE id = $1`;

  const resultado = await pool.query(sql, [id]);

  return (resultado.rowCount ?? 0) > 0;
}

