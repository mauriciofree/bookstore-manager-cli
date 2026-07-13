import {
  RelatorioClienteComEmprestimoAtivo,
  RelatorioEmprestimosPorLivro,
  RelatorioLivroDisponivel,
  RelatorioLivroEmprestado,
  RelatorioLivrosPorAutor,
} from "../models/Relatorio";
import {
  listarClientesComEmprestimosAtivos,
  listarLivrosDisponiveis,
  listarLivrosEmprestados,
  listarQuantidadeEmprestimosPorLivro,
  listarQuantidadeLivrosPorAutor,
} from "../repositories/RelatorioRepository";

export async function obterRelatorioLivrosDisponiveis(): Promise<
  RelatorioLivroDisponivel[]
> {
  return listarLivrosDisponiveis();
}

export async function obterRelatorioLivrosEmprestados(): Promise<
  RelatorioLivroEmprestado[]
> {
  return listarLivrosEmprestados();
}

export async function obterRelatorioLivrosPorAutor(): Promise<
  RelatorioLivrosPorAutor[]
> {
  return listarQuantidadeLivrosPorAutor();
}

export async function obterRelatorioEmprestimosPorLivro(): Promise<
  RelatorioEmprestimosPorLivro[]
> {
  return listarQuantidadeEmprestimosPorLivro();
}

export async function obterRelatorioClientesComEmprestimosAtivos(): Promise<
  RelatorioClienteComEmprestimoAtivo[]
> {
  return listarClientesComEmprestimosAtivos();
}
