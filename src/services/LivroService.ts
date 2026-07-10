import { Livro, LivroComAutor } from "../models/Livro";
import {
  atualizarLivro,
  buscarLivroComAutorPorId,
  buscarLivroPorTituloAnoAutor,
  buscarLivrosPorTituloParcial,
  contarLivrosPorTituloParcial,
  contarLivros,
  criarLivro,
  deletarLivro,
  listarLivros,
} from "../repositories/LivroRepository";
import { buscarAutorPorId } from "../repositories/AutorRepository";

export interface ResultadoPaginadoLivros {
  livros: LivroComAutor[];
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
}

function normalizarTitulo(titulo: string): string {
  return titulo.trim();
}

function validarTitulo(titulo: string): void {
  if (!titulo) {
    throw new Error("O título do livro e obrigatório.");
  }

  if (titulo.length < 3) {
    throw new Error("O título do livro deve possuir pelo menos 3 caracteres.");
  }
}

function normalizarAno(anoPublicacao: string): number {
  return Number(anoPublicacao);
}

function validarAno(anoPublicacao: number): void {
  const anoAtual = new Date().getFullYear();


  if (!Number.isInteger(anoPublicacao)) {
    throw new Error("O ano de publicação do livro deve ser um número inteiro.");
  }

  if (anoPublicacao < 1000 || anoPublicacao > anoAtual) {
    throw new Error("O ano de publicação do livro é inválido.");
  }
}

function normalizarQuantidade(quantidadeTotal: string): number {
  return Number(quantidadeTotal);
}

function validarQuantidade(quantidadeTotal: number): void {
  const quantidadeMaxima = 999;


  if (!Number.isInteger(quantidadeTotal)) {
    throw new Error("A quantidade total do livro deve ser um número inteiro.");
  }

  if (quantidadeTotal < 1 || quantidadeTotal > quantidadeMaxima) {
    throw new Error("A quantidade total do livro deve estar entre 1 e 999.");
  }
}

function normalizarAutor(autorId: string): number {
  return Number(autorId);
}

function calcularQuantidadeDisponivel(livroAtual: Livro, 
                                      novaQuantidadeTotal: number
                                     ): number {
    return novaQuantidadeTotal - calcularQuantidadeEmprestada(livroAtual);  
}

function calcularQuantidadeEmprestada(livroAtual: Livro): number {
    return livroAtual.quantidade_total - livroAtual.quantidade_disponivel;
}

function validarDisponivel(quantidadeDisponivel: number): void {
  if (quantidadeDisponivel < 0) {
    throw new Error("A quantidade total do livro não pode ser inferior à quantidade já emprestada.");
  }
}

async function validarAutor(autorId: number): Promise<void> {
  if (!Number.isInteger(autorId) || autorId <= 0) {
    throw new Error("O ID do autor do livro deve ser um número inteiro positivo.");
  }

  const autor = await buscarAutorPorId(autorId);

  if (!autor) {
    throw new Error("Autor não encontrado. Cadastre o autor antes de cadastrar o livro.");
  }
}

export async function cadastrarLivro(titulo: string,
                                     anoPublicacao: string, 
                                     quantidadeTotal: string, 
                                     autorId: string
                                    ): Promise<LivroComAutor> {
  const tituloNormalizado = normalizarTitulo(titulo);
  const anoNormalizado = normalizarAno(anoPublicacao);
  const quantidadeNormalizada = normalizarQuantidade(quantidadeTotal);  
  const autorNormalizado = normalizarAutor(autorId);

  validarTitulo(tituloNormalizado);
  validarAno(anoNormalizado);
  validarQuantidade(quantidadeNormalizada);
  await validarAutor(autorNormalizado);

  const livroExistente = await buscarLivroPorTituloAnoAutor(tituloNormalizado,
                                                            anoNormalizado,
                                                            autorNormalizado);

  if (livroExistente) {
    throw new Error("Já existe um livro cadastrado com esse título, ano de publicação e autor.");
  }

  const livro = await criarLivro(tituloNormalizado,
                                 anoNormalizado,
                                 quantidadeNormalizada,
                                 autorNormalizado);

  if (!livro) {
    throw new Error("Não foi possível cadastrar o livro.");
  }

  const livroComAutor = await buscarLivroComAutorPorId(livro.id);

  if (!livroComAutor) {
    throw new Error("Livro cadastrado, mas nÃ£o foi possÃ­vel carregar os dados do autor.");
  }

  return livroComAutor;
}

export async function obterLivrosPaginados(
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoLivros> {
  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarLivros();
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const livros = await listarLivros(limite, offset);

  return {
    livros,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function obterLivroPorId(id: number): Promise<LivroComAutor> {
  const livro = await buscarLivroComAutorPorId(id);

  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  return livro;
}

export async function pesquisarLivrosPorTituloPaginado(
  titulo: string,
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoLivros> {
  const tituloNormalizado = normalizarTitulo(titulo);

  validarTitulo(tituloNormalizado);

  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarLivrosPorTituloParcial(tituloNormalizado);
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const livros = await buscarLivrosPorTituloParcial(
    tituloNormalizado,
    limite,
    offset
  );

  return {
    livros,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function editarLivro(id: number, 
                                  titulo: string,
                                  anoPublicacao: string, 
                                  quantidadeTotal: string, 
                                  autorId: string                            
                                ): Promise<LivroComAutor> {
  const livroAtual = await buscarLivroComAutorPorId(id);

  if (!livroAtual) {
    throw new Error("Livro não encontrado.");
  }

  const tituloNormalizado = normalizarTitulo(titulo);
  const anoNormalizado = normalizarAno(anoPublicacao);
  const quantidadeNormalizada = normalizarQuantidade(quantidadeTotal);  
  const autorNormalizado = normalizarAutor(autorId);

  validarTitulo(tituloNormalizado);
  validarAno(anoNormalizado);
  validarQuantidade(quantidadeNormalizada);
  await validarAutor(autorNormalizado);  

  const novaQuantidadeDisponivel = calcularQuantidadeDisponivel(livroAtual, quantidadeNormalizada);
  
  validarDisponivel(novaQuantidadeDisponivel);

  const livroComMesmoTituloAnoAutor = await buscarLivroPorTituloAnoAutor(tituloNormalizado,
                                                                 anoNormalizado,
                                                                 autorNormalizado);

  if (livroComMesmoTituloAnoAutor && livroComMesmoTituloAnoAutor.id !== id) {
    throw new Error("Já existe outro livro cadastrado com esse título, ano de publicação e autor.");
  }

  const livroAtualizado = await atualizarLivro(
    id,
    tituloNormalizado,
    anoNormalizado,
    quantidadeNormalizada,
    novaQuantidadeDisponivel,
    autorNormalizado
  );

  if (!livroAtualizado) {
    throw new Error("Não foi possível atualizar o livro.");
  }

  const livroComAutorAtualizado = await buscarLivroComAutorPorId(id);

  if (!livroComAutorAtualizado) {
    throw new Error("Livro atualizado, mas nÃ£o foi possÃ­vel carregar os dados do autor.");
  }

  return livroComAutorAtualizado;
}

export async function removerLivro(id: number): Promise<void> {
  const livro = await buscarLivroComAutorPorId(id);

  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  try {
    const removeu = await deletarLivro(id);

    if (!removeu) {
      throw new Error("Não foi possível remover o livro.");
    }
  } catch {
    throw new Error(
      "Não foi possível remover o livro. Verifique se existem empréstimos vinculados a ele."
    );
  }
}
