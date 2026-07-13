import {
  RelatorioClienteComEmprestimoAtivo,
  RelatorioEmprestimosPorLivro,
  RelatorioLivroDisponivel,
  RelatorioLivroEmprestado,
  RelatorioLivrosPorAutor,
} from "../models/Relatorio";
import { exibirMenu } from "../menus/menuBase";
import {
  obterRelatorioClientesComEmprestimosAtivos,
  obterRelatorioEmprestimosPorLivro,
  obterRelatorioLivrosDisponiveis,
  obterRelatorioLivrosEmprestados,
  obterRelatorioLivrosPorAutor,
} from "../services/RelatorioService";
import { formatarDataHoraParaExibicao } from "../utils/dateFormat";
import { pausar } from "../utils/input";

function imprimirLivrosDisponiveis(livros: RelatorioLivroDisponivel[]): void {
  if (livros.length === 0) {
    console.log("Nenhum livro disponivel encontrado.");
    return;
  }

  for (const livro of livros) {
    console.log(`[${livro.livro_id}] ${livro.titulo} (${livro.ano_publicacao})`);
    console.log(
      `    Autor: ${livro.autor_nome} | Total: ${livro.quantidade_total} | Disponíveis: ${livro.quantidade_disponivel}`
    );
  }
}

function imprimirLivrosEmprestados(livros: RelatorioLivroEmprestado[]): void {
  if (livros.length === 0) {
    console.log("Nenhum livro emprestado encontrado.");
    return;
  }

  for (const livro of livros) {
    console.log(`[${livro.emprestimo_id}] ${livro.titulo}`);
    console.log(
      `    Livro ID: ${livro.livro_id} | Cliente: ${livro.cliente_nome} | Empréstimo: ${formatarDataHoraParaExibicao(livro.data_emprestimo)}`
    );
  }
}

function imprimirLivrosPorAutor(relatorio: RelatorioLivrosPorAutor[]): void {
  if (relatorio.length === 0) {
    console.log("Nenhum autor encontrado.");
    return;
  }

  for (const item of relatorio) {
    console.log(
      `[${item.autor_id}] ${item.autor_nome} | Livros cadastrados: ${item.quantidade_livros}`
    );
  }
}

function imprimirEmprestimosPorLivro(
  relatorio: RelatorioEmprestimosPorLivro[]
): void {
  if (relatorio.length === 0) {
    console.log("Nenhum livro encontrado.");
    return;
  }

  for (const item of relatorio) {
    console.log(`[${item.livro_id}] ${item.titulo}`);
    console.log(
      `    Autor: ${item.autor_nome} | Empréstimos: ${item.quantidade_emprestimos}`
    );
  }
}

function imprimirClientesComEmprestimosAtivos(
  clientes: RelatorioClienteComEmprestimoAtivo[]
): void {
  if (clientes.length === 0) {
    console.log("Nenhum cliente com empréstimo ativo encontrado.");
    return;
  }

  for (const cliente of clientes) {
    console.log(`[${cliente.cliente_id}] ${cliente.cliente_nome}`);
    console.log(
      `    E-mail: ${cliente.email} | Empréstimos ativos: ${cliente.quantidade_emprestimos_ativos}`
    );
  }
}

async function exibirRelatorioLivrosDisponiveis(): Promise<void> {
  console.clear();
  console.log("=== Relatório: Livros Disponiveis ===\n");

  try {
    const livros = await obterRelatorioLivrosDisponiveis();
    imprimirLivrosDisponiveis(livros);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function exibirRelatorioLivrosEmprestados(): Promise<void> {
  console.clear();
  console.log("=== Relatório: Livros Emprestados ===\n");

  try {
    const livros = await obterRelatorioLivrosEmprestados();
    imprimirLivrosEmprestados(livros);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function exibirRelatorioLivrosPorAutor(): Promise<void> {
  console.clear();
  console.log("=== Relatório: Livros por Autor ===\n");

  try {
    const relatorio = await obterRelatorioLivrosPorAutor();
    imprimirLivrosPorAutor(relatorio);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function exibirRelatorioEmprestimosPorLivro(): Promise<void> {
  console.clear();
  console.log("=== Relatório: Empréstimos por Livro ===\n");

  try {
    const relatorio = await obterRelatorioEmprestimosPorLivro();
    imprimirEmprestimosPorLivro(relatorio);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function exibirRelatorioClientesComEmprestimosAtivos(): Promise<void> {
  console.clear();
  console.log("=== Relatório: Clientes com Empréstimos Ativos ===\n");

  try {
    const clientes = await obterRelatorioClientesComEmprestimosAtivos();
    imprimirClientesComEmprestimosAtivos(clientes);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

export async function exibirMenuRelatorios(): Promise<void> {
  await exibirMenu("Relatorios", [
    {
      chave: "1",
      descricao: "Livros disponíveis",
      executar: exibirRelatorioLivrosDisponiveis,
    },
    {
      chave: "2",
      descricao: "Livros emprestados",
      executar: exibirRelatorioLivrosEmprestados,
    },
    {
      chave: "3",
      descricao: "Livros cadastrados por autor",
      executar: exibirRelatorioLivrosPorAutor,
    },
    {
      chave: "4",
      descricao: "Quantidade de empréstimos por livro",
      executar: exibirRelatorioEmprestimosPorLivro,
    },
    {
      chave: "5",
      descricao: "Clientes com empréstimos ativos",
      executar: exibirRelatorioClientesComEmprestimosAtivos,
    },
  ]);
}
