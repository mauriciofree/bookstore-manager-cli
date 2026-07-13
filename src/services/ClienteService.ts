import { Cliente } from "../models/Cliente";
import {
  atualizarCliente,
  buscarClientePorEmail,
  buscarClientePorId,
  buscarClientesPorNomeParcial,
  contarClientes,
  contarClientesPorNomeParcial,
  criarCliente,
  deletarCliente,
  listarClientes,
} from "../repositories/ClienteRepository";

export interface ResultadoPaginadoClientes {
  clientes: Cliente[];
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
}

function normalizarNome(nome: string): string {
  return nome.trim();
}

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizarTelefone(telefone: string): string | null {
  const telefoneLimpo = telefone.replace(/\D/g, "");

  return telefoneLimpo || null;
}

function validarNome(nome: string): void {
  if (!nome) {
    throw new Error("O nome do cliente e obrigatório.");
  }

  if (nome.length < 3) {
    throw new Error("O nome do cliente deve possuir pelo menos 3 caracteres.");
  }
}

function validarEmail(email: string): void {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailValido) {
    throw new Error("O e-mail do cliente e inválido.");
  }
}

function validarTelefone(telefone: string | null): void {
  if (!telefone) {
    return;
  }

  if (!/^\d{10,11}$/.test(telefone)) {
    throw new Error("O telefone deve conter 10 ou 11 dígitos.");
  }
}

export async function cadastrarCliente(
  nome: string,
  email: string,
  telefone: string
): Promise<Cliente> {
  const nomeNormalizado = normalizarNome(nome);
  const emailNormalizado = normalizarEmail(email);
  const telefoneNormalizado = normalizarTelefone(telefone);

  validarNome(nomeNormalizado);
  validarEmail(emailNormalizado);
  validarTelefone(telefoneNormalizado);

  const clienteExistente = await buscarClientePorEmail(emailNormalizado);

  if (clienteExistente) {
    throw new Error("Já existe um cliente cadastrado com esse e-mail.");
  }

  const cliente = await criarCliente(
    nomeNormalizado,
    emailNormalizado,
    telefoneNormalizado
  );

  if (!cliente) {
    throw new Error("Não foi possível cadastrar o cliente.");
  }

  return cliente;
}

export async function obterClientesPaginados(
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoClientes> {
  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarClientes();
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const clientes = await listarClientes(limite, offset);

  return {
    clientes,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function obterClientePorId(id: number): Promise<Cliente> {
  const cliente = await buscarClientePorId(id);

  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }

  return cliente;
}

export async function pesquisarClientesPorNomePaginado(
  nome: string,
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoClientes> {
  const nomeNormalizado = normalizarNome(nome);

  validarNome(nomeNormalizado);

  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarClientesPorNomeParcial(nomeNormalizado);
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const clientes = await buscarClientesPorNomeParcial(
    nomeNormalizado,
    limite,
    offset
  );

  return {
    clientes,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function editarCliente(
  id: number,
  nome: string,
  email: string,
  telefone: string
): Promise<Cliente> {
  const clienteAtual = await buscarClientePorId(id);

  if (!clienteAtual) {
    throw new Error("Cliente não encontrado.");
  }

  const nomeNormalizado = normalizarNome(nome);
  const emailNormalizado = normalizarEmail(email);
  const telefoneNormalizado = normalizarTelefone(telefone);

  validarNome(nomeNormalizado);
  validarEmail(emailNormalizado);
  validarTelefone(telefoneNormalizado);

  const clienteComMesmoEmail = await buscarClientePorEmail(emailNormalizado);

  if (clienteComMesmoEmail && clienteComMesmoEmail.id !== id) {
    throw new Error("Já existe outro cliente cadastrado com esse e-mail.");
  }

  const clienteAtualizado = await atualizarCliente(
    id,
    nomeNormalizado,
    emailNormalizado,
    telefoneNormalizado
  );

  if (!clienteAtualizado) {
    throw new Error("Não foi possível atualizar o cliente.");
  }

  return clienteAtualizado;
}

export async function removerCliente(id: number): Promise<void> {
  const cliente = await buscarClientePorId(id);

  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }

  try {
    const removeu = await deletarCliente(id);

    if (!removeu) {
      throw new Error("Não foi possível remover o cliente.");
    }
  } catch {
    throw new Error(
      "Não foi possível remover o cliente. Verifique se existem empréstimos vinculados a ele."
    );
  }
}

