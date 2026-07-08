import { Autor } from "../models/Autor";
import {
  atualizarAutor,
  buscarAutorPorId,
  buscarAutorPorNome,
  buscarAutoresPorNomeParcial,
  contarAutoresPorNomeParcial,
  contarAutores,
  criarAutor,
  deletarAutor,
  listarAutores,
} from "../repositories/AutorRepository";

export interface ResultadoPaginadoAutores {
  autores: Autor[];
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
}

function normalizarNome(nome: string): string {
  return nome.trim();
}

function validarNome(nome: string): void {
  if (!nome) {
    throw new Error("O nome do autor e obrigatório.");
  }

  if (nome.length < 3) {
    throw new Error("O nome do autor deve possuir pelo menos 3 caracteres.");
  }
}

export async function cadastrarAutor(nome: string): Promise<Autor> {
  const nomeNormalizado = normalizarNome(nome);

  validarNome(nomeNormalizado);

  const autorExistente = await buscarAutorPorNome(nomeNormalizado);

  if (autorExistente) {
    throw new Error("Já existe um autor cadastrado com esse nome.");
  }

  const autor = await criarAutor(nomeNormalizado);

  if (!autor) {
    throw new Error("Não foi possível cadastrar o autor.");
  }

  return autor;
}

export async function obterAutoresPaginados(
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoAutores> {
  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarAutores();
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const autores = await listarAutores(limite, offset);

  return {
    autores,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function obterAutorPorId(id: number): Promise<Autor> {
  const autor = await buscarAutorPorId(id);

  if (!autor) {
    throw new Error("Autor não encontrado.");
  }

  return autor;
}

export async function pesquisarAutoresPorNomePaginado(
  nome: string,
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoAutores> {
  const nomeNormalizado = normalizarNome(nome);

  validarNome(nomeNormalizado);

  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarAutoresPorNomeParcial(nomeNormalizado);
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const autores = await buscarAutoresPorNomeParcial(
    nomeNormalizado,
    limite,
    offset
  );

  return {
    autores,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function editarAutor(id: number, nome: string): Promise<Autor> {
  const nomeNormalizado = normalizarNome(nome);

  validarNome(nomeNormalizado);

  const autorAtual = await buscarAutorPorId(id);

  if (!autorAtual) {
    throw new Error("Autor não encontrado.");
  }

  const autorComMesmoNome = await buscarAutorPorNome(nomeNormalizado);

  if (autorComMesmoNome && autorComMesmoNome.id !== id) {
    throw new Error("Já existe outro autor cadastrado com esse nome.");
  }

  const autorAtualizado = await atualizarAutor(id, nomeNormalizado);

  if (!autorAtualizado) {
    throw new Error("Não foi possível atualizar o autor.");
  }

  return autorAtualizado;
}

export async function removerAutor(id: number): Promise<void> {
  const autor = await buscarAutorPorId(id);

  if (!autor) {
    throw new Error("Autor não encontrado.");
  }

  try {
    const removeu = await deletarAutor(id);

    if (!removeu) {
      throw new Error("Não foi possível remover o autor.");
    }
  } catch {
    throw new Error(
      "Não foi possível remover o autor. Verifique se existem livros vinculados a ele."
    );
  }
}
