import { buscarClientePorId } from "../repositories/ClienteRepository";
import { buscarLivroComAutorPorId } from "../repositories/LivroRepository";
import {
  buscarEmprestimoAtivoPorLivroCliente,
  buscarEmprestimoPorId,
  buscarEmprestimosPorIdCliente,
  buscarEmprestimosPorIdLivro,
  buscarEmprestimosPorNomeCliente,
  buscarEmprestimosPorTituloLivro,
  contarEmprestimos,
  contarHistoricoEmprestimos,
  contarEmprestimosPorIdCliente,
  contarEmprestimosPorIdLivro,
  contarEmprestimosPorNomeCliente,
  contarEmprestimosPorTituloLivro,
  criarEmprestimo,
  listarHistoricoEmprestimos,
  listarEmprestimos,
  registrarDevolucao,
} from "../repositories/EmprestimoRepository";
import { EmprestimoComDetalhes } from "../models/Emprestimo";

export interface ResultadoPaginadoEmprestimos {
  emprestimos: EmprestimoComDetalhes[];
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
}

function normalizarId(valor: string): number {
  return Number(valor);
}

function validarId(id: number, nomeCampo: string): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`${nomeCampo} deve ser um número inteiro positivo.`);
  }
}

function normalizarTextoBusca(texto: string): string {
  return texto.trim();
}

function validarTextoBusca(texto: string, nomeCampo: string): void {
  if (!texto) {
    throw new Error(`${nomeCampo} e obrigatório.`);
  }

  if (texto.length < 2) {
    throw new Error(`${nomeCampo} deve possuir pelo menos 2 caracteres.`);
  }
}

export async function realizarEmprestimo(
  livroId: string,
  clienteId: string
): Promise<EmprestimoComDetalhes> {
  const livroIdNormalizado = normalizarId(livroId);
  const clienteIdNormalizado = normalizarId(clienteId);

  validarId(livroIdNormalizado, "O ID do livro");
  validarId(clienteIdNormalizado, "O ID do cliente");

  const livro = await buscarLivroComAutorPorId(livroIdNormalizado);

  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  if (livro.quantidade_disponivel <= 0) {
    throw new Error("Livro sem disponibilidade para empréstimo.");
  }

  const cliente = await buscarClientePorId(clienteIdNormalizado);

  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }

  const emprestimoAtivo = await buscarEmprestimoAtivoPorLivroCliente(
    livroIdNormalizado,
    clienteIdNormalizado
  );

  if (emprestimoAtivo) {
    throw new Error("Este cliente já possui empréstimo ativo deste livro.");
  }

  const emprestimo = await criarEmprestimo(livroIdNormalizado, clienteIdNormalizado);

  if (!emprestimo) {
    throw new Error("Não foi possível registrar o empréstimo.");
  }

  const emprestimoComDetalhes = await buscarEmprestimoPorId(emprestimo.id);

  if (!emprestimoComDetalhes) {
    throw new Error("Empréstimo registrado, mas não foi possível carregar os detalhes.");
  }

  return emprestimoComDetalhes;
}

export async function obterEmprestimosPaginados(
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoEmprestimos> {
  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarEmprestimos();
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const emprestimos = await listarEmprestimos(limite, offset);

  return {
    emprestimos,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function obterHistoricoEmprestimosPaginado(
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoEmprestimos> {
  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarHistoricoEmprestimos();
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const emprestimos = await listarHistoricoEmprestimos(limite, offset);

  return {
    emprestimos,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function pesquisarEmprestimosPorIdLivroPaginado(
  livroId: string,
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoEmprestimos> {
  const livroIdNormalizado = normalizarId(livroId);

  validarId(livroIdNormalizado, "O ID do livro");

  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarEmprestimosPorIdLivro(livroIdNormalizado);
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const emprestimos = await buscarEmprestimosPorIdLivro(
    livroIdNormalizado,
    limite,
    offset
  );

  return {
    emprestimos,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function pesquisarEmprestimosPorTituloLivroPaginado(
  titulo: string,
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoEmprestimos> {
  const tituloNormalizado = normalizarTextoBusca(titulo);

  validarTextoBusca(tituloNormalizado, "O título do livro");

  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarEmprestimosPorTituloLivro(tituloNormalizado);
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const emprestimos = await buscarEmprestimosPorTituloLivro(
    tituloNormalizado,
    limite,
    offset
  );

  return {
    emprestimos,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function pesquisarEmprestimosPorIdClientePaginado(
  clienteId: string,
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoEmprestimos> {
  const clienteIdNormalizado = normalizarId(clienteId);

  validarId(clienteIdNormalizado, "O ID do cliente");

  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarEmprestimosPorIdCliente(clienteIdNormalizado);
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const emprestimos = await buscarEmprestimosPorIdCliente(
    clienteIdNormalizado,
    limite,
    offset
  );

  return {
    emprestimos,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function pesquisarEmprestimosPorNomeClientePaginado(
  nome: string,
  pagina: number,
  limite: number
): Promise<ResultadoPaginadoEmprestimos> {
  const nomeNormalizado = normalizarTextoBusca(nome);

  validarTextoBusca(nomeNormalizado, "O nome do cliente");

  const paginaAtual = Math.max(pagina, 1);
  const totalRegistros = await contarEmprestimosPorNomeCliente(nomeNormalizado);
  const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
  const paginaLimitada = Math.min(paginaAtual, totalPaginas);
  const offset = (paginaLimitada - 1) * limite;
  const emprestimos = await buscarEmprestimosPorNomeCliente(
    nomeNormalizado,
    limite,
    offset
  );

  return {
    emprestimos,
    paginaAtual: paginaLimitada,
    totalPaginas,
    totalRegistros,
  };
}

export async function obterEmprestimoPorId(
  id: number
): Promise<EmprestimoComDetalhes> {
  const emprestimo = await buscarEmprestimoPorId(id);

  if (!emprestimo) {
    throw new Error("Empréstimo não encontrado.");
  }

  return emprestimo;
}

export async function devolverEmprestimo(id: number): Promise<EmprestimoComDetalhes> {
  validarId(id, "O ID do empréstimo");

  const emprestimoAtual = await buscarEmprestimoPorId(id);

  if (!emprestimoAtual) {
    throw new Error("Empréstimo não encontrado.");
  }

  if (emprestimoAtual.status !== "ativo") {
    throw new Error("Este empréstimo já foi devolvido.");
  }

  const emprestimo = await registrarDevolucao(id);

  if (!emprestimo) {
    throw new Error("Não foi possível registrar a devolução.");
  }

  const emprestimoComDetalhes = await buscarEmprestimoPorId(id);

  if (!emprestimoComDetalhes) {
    throw new Error("Devolução registrada, mas não foi possível carregar os detalhes.");
  }

  return emprestimoComDetalhes;
}
