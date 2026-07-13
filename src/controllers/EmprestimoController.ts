import { EmprestimoComDetalhes } from "../models/Emprestimo";
import { exibirMenu } from "../menus/menuBase";
import { obterClientePorId } from "../services/ClienteService";
import {
  devolverEmprestimo,
  obterEmprestimoPorId,
  obterEmprestimosPaginados,
  obterHistoricoEmprestimosPaginado,
  pesquisarEmprestimosPorIdClientePaginado,
  pesquisarEmprestimosPorNomeClientePaginado,
  pesquisarEmprestimosPorIdLivroPaginado,
  pesquisarEmprestimosPorTituloLivroPaginado,
  realizarEmprestimo,
} from "../services/EmprestimoService";
import { obterLivroPorId } from "../services/LivroService";
import { formatarDataHoraParaExibicao } from "../utils/dateFormat";
import { confirmar, pausar, perguntar, perguntarNumero } from "../utils/input";

const EMPRESTIMOS_POR_PAGINA = 5;

type AcaoPaginacao = "anterior" | "proxima" | "primeira" | "ultima" | "voltar";

function formatarStatus(status: string): string {
  return status === "ativo" ? "Ativo" : "Devolvido";
}

function imprimirEmprestimos(emprestimos: EmprestimoComDetalhes[]): void {
  if (emprestimos.length === 0) {
    console.log("Nenhum registro encontrado.");
    return;
  }

  for (const emprestimo of emprestimos) {
    console.log(
      `[${emprestimo.id}] ${emprestimo.livro_titulo} (${emprestimo.livro_ano_publicacao}) | ${formatarStatus(emprestimo.status)}`
    );
    console.log(
      `    Cliente: ${emprestimo.cliente_nome} | Empréstimo: ${formatarDataHoraParaExibicao(emprestimo.data_emprestimo)} | Devolução: ${formatarDataHoraParaExibicao(emprestimo.data_devolucao)}`
    );
  }
}

function imprimirDetalhesEmprestimo(emprestimo: EmprestimoComDetalhes): void {
  console.log(`ID: ${emprestimo.id}`);
  console.log(`Livro: ${emprestimo.livro_id} - ${emprestimo.livro_titulo} (${emprestimo.livro_ano_publicacao})`);
  console.log(`Cliente: ${emprestimo.cliente_id} - ${emprestimo.cliente_nome}`);
  console.log(`Status: ${formatarStatus(emprestimo.status)}`);
  console.log(`Data do empréstimo: ${formatarDataHoraParaExibicao(emprestimo.data_emprestimo)}`);
  console.log(`Data de devolução: ${formatarDataHoraParaExibicao(emprestimo.data_devolucao)}`);
}

async function lerAcaoPaginacao(): Promise<AcaoPaginacao | null> {
  console.log("\nA. Anterior | P. Próxima | I. Primeira | U. Última | 0. Voltar");

  const tecla = (await perguntar("Opcao: ")).toLowerCase();

  if (tecla === "a") {
    return "anterior";
  }

  if (tecla === "p") {
    return "proxima";
  }

  if (tecla === "i") {
    return "primeira";
  }

  if (tecla === "u") {
    return "ultima";
  }

  if (tecla === "0") {
    return "voltar";
  }

  return null;
}

async function cadastrar(): Promise<void> {
  console.clear();
  console.log("=== Realizar Empréstimo ===\n");

  try {
    const livroId = await perguntar("ID do livro: ");
    const clienteId = await perguntar("ID do cliente: ");

    const livro = await obterLivroPorId(Number(livroId));
    const cliente = await obterClientePorId(Number(clienteId));

    console.log("\nConfira os dados do empréstimo:");
    console.log(`Livro: ${livro.id} - ${livro.titulo} (${livro.ano_publicacao})`);
    console.log(`Disponíveis: ${livro.quantidade_disponivel}`);
    console.log(`Cliente: ${cliente.id} - ${cliente.nome}`);

    const deveCadastrar = await confirmar("\nDeseja realizar este empréstimo?");

    if (!deveCadastrar) {
      console.log("\nOperação cancelada.");
      await pausar();
      return;
    }

    const emprestimo = await realizarEmprestimo(livroId, clienteId);

    console.log("\nEmpréstimo registrado com sucesso:");
    imprimirDetalhesEmprestimo(emprestimo);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function listar(): Promise<void> {
  let pagina = 1;
  let deveContinuar = true;

  while (deveContinuar) {
    console.clear();
    console.log("=== Listar Empréstimos Ativos ===\n");

    try {
      const resultado = await obterEmprestimosPaginados(
        pagina,
        EMPRESTIMOS_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirEmprestimos(resultado.emprestimos);
      console.log(
        `\nPágina ${resultado.paginaAtual} de ${resultado.totalPaginas} | Total: ${resultado.totalRegistros}`
      );

      const acao = await lerAcaoPaginacao();

      if (acao === "proxima") {
        pagina += 1;
      } else if (acao === "anterior") {
        pagina -= 1;
      } else if (acao === "primeira") {
        pagina = 1;
      } else if (acao === "ultima") {
        pagina = resultado.totalPaginas;
      } else if (acao === "voltar") {
        deveContinuar = false;
      } else {
        console.log("\nOpção inválida.");
        await pausar();
      }
    } catch (error) {
      console.error("\n[ERRO]", error instanceof Error ? error.message : error);
      await pausar();
      deveContinuar = false;
    }
  }
}

async function consultarPorId(): Promise<void> {
  console.clear();
  console.log("=== Consultar Empréstimo por ID ===\n");

  try {
    const id = await perguntarNumero("ID do empréstimo: ");

    if (id === null) {
      console.log("\nID inválido.");
      await pausar();
      return;
    }

    const emprestimo = await obterEmprestimoPorId(id);

    console.log("\nEmpréstimo encontrado:");
    imprimirDetalhesEmprestimo(emprestimo);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function pesquisarPorIdLivro(): Promise<void> {
  console.clear();
  console.log("=== Pesquisar Empréstimos por ID do Livro ===\n");

  try {
    const livroId = await perguntar("Digite ID do livro: ");
    let pagina = 1;
    let deveContinuar = true;

    while (deveContinuar) {
      console.clear();
      console.log("=== Pesquisar Empréstimos por ID do Livro ===\n");
      console.log(`Busca: ${livroId}\n`);

      const resultado = await pesquisarEmprestimosPorIdLivroPaginado(
        livroId,
        pagina,
        EMPRESTIMOS_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirEmprestimos(resultado.emprestimos);
      console.log(
        `\nPágina ${resultado.paginaAtual} de ${resultado.totalPaginas} | Total: ${resultado.totalRegistros}`
      );

      const acao = await lerAcaoPaginacao();

      if (acao === "proxima") {
        pagina += 1;
      } else if (acao === "anterior") {
        pagina -= 1;
      } else if (acao === "primeira") {
        pagina = 1;
      } else if (acao === "ultima") {
        pagina = resultado.totalPaginas;
      } else if (acao === "voltar") {
        deveContinuar = false;
      } else {
        console.log("\nOpcao invalida.");
        await pausar();
      }
    }
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
    await pausar();
  }
}

async function pesquisarPorTituloLivro(): Promise<void> {
  console.clear();
  console.log("=== Pesquisar Empréstimos por Título do Livro ===\n");

  try {
    const titulo = await perguntar("Digite parte do título do livro: ");
    let pagina = 1;
    let deveContinuar = true;

    while (deveContinuar) {
      console.clear();
      console.log("=== Pesquisar Empréstimos por Título do Livro ===\n");
      console.log(`Busca: ${titulo}\n`);

      const resultado = await pesquisarEmprestimosPorTituloLivroPaginado(
        titulo,
        pagina,
        EMPRESTIMOS_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirEmprestimos(resultado.emprestimos);
      console.log(
        `\nPágina ${resultado.paginaAtual} de ${resultado.totalPaginas} | Total: ${resultado.totalRegistros}`
      );

      const acao = await lerAcaoPaginacao();

      if (acao === "proxima") {
        pagina += 1;
      } else if (acao === "anterior") {
        pagina -= 1;
      } else if (acao === "primeira") {
        pagina = 1;
      } else if (acao === "ultima") {
        pagina = resultado.totalPaginas;
      } else if (acao === "voltar") {
        deveContinuar = false;
      } else {
        console.log("\nOpcao invalida.");
        await pausar();
      }
    }
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
    await pausar();
  }
}

async function pesquisarPorIdCliente(): Promise<void> {
  console.clear();
  console.log("=== Pesquisar Empréstimos por ID do Cliente ===\n");

  try {
    const clienteId = await perguntar("Digite ID do cliente: ");
    let pagina = 1;
    let deveContinuar = true;

    while (deveContinuar) {
      console.clear();
      console.log("=== Pesquisar Empréstimos por ID do Cliente ===\n");
      console.log(`Busca: ${clienteId}\n`);

      const resultado = await pesquisarEmprestimosPorIdClientePaginado(
        clienteId,
        pagina,
        EMPRESTIMOS_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirEmprestimos(resultado.emprestimos);
      console.log(
        `\nPágina ${resultado.paginaAtual} de ${resultado.totalPaginas} | Total: ${resultado.totalRegistros}`
      );

      const acao = await lerAcaoPaginacao();

      if (acao === "proxima") {
        pagina += 1;
      } else if (acao === "anterior") {
        pagina -= 1;
      } else if (acao === "primeira") {
        pagina = 1;
      } else if (acao === "ultima") {
        pagina = resultado.totalPaginas;
      } else if (acao === "voltar") {
        deveContinuar = false;
      } else {
        console.log("\nOpção inválida.");
        await pausar();
      }
    }
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
    await pausar();
  }
}

async function pesquisarPorNomeCliente(): Promise<void> {
  console.clear();
  console.log("=== Pesquisar Empréstimos por Nome do Cliente ===\n");

  try {
    const nome = await perguntar("Digite parte do nome do cliente: ");
    let pagina = 1;
    let deveContinuar = true;

    while (deveContinuar) {
      console.clear();
      console.log("=== Pesquisar Empréstimos por Cliente ===\n");
      console.log(`Busca: ${nome}\n`);

      const resultado = await pesquisarEmprestimosPorNomeClientePaginado(
        nome,
        pagina,
        EMPRESTIMOS_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirEmprestimos(resultado.emprestimos);
      console.log(
        `\nPágina ${resultado.paginaAtual} de ${resultado.totalPaginas} | Total: ${resultado.totalRegistros}`
      );

      const acao = await lerAcaoPaginacao();

      if (acao === "proxima") {
        pagina += 1;
      } else if (acao === "anterior") {
        pagina -= 1;
      } else if (acao === "primeira") {
        pagina = 1;
      } else if (acao === "ultima") {
        pagina = resultado.totalPaginas;
      } else if (acao === "voltar") {
        deveContinuar = false;
      } else {
        console.log("\nOpção inválida.");
        await pausar();
      }
    }
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
    await pausar();
  }
}

async function listarHistorico(): Promise<void> {
  let pagina = 1;
  let deveContinuar = true;

  while (deveContinuar) {
    console.clear();
    console.log("=== Histórico de Empréstimos ===\n");

    try {
      const resultado = await obterHistoricoEmprestimosPaginado(
        pagina,
        EMPRESTIMOS_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirEmprestimos(resultado.emprestimos);
      console.log(
        `\nPágina ${resultado.paginaAtual} de ${resultado.totalPaginas} | Total: ${resultado.totalRegistros}`
      );

      const acao = await lerAcaoPaginacao();

      if (acao === "proxima") {
        pagina += 1;
      } else if (acao === "anterior") {
        pagina -= 1;
      } else if (acao === "primeira") {
        pagina = 1;
      } else if (acao === "ultima") {
        pagina = resultado.totalPaginas;
      } else if (acao === "voltar") {
        deveContinuar = false;
      } else {
        console.log("\nOpcao invalida.");
        await pausar();
      }
    } catch (error) {
      console.error("\n[ERRO]", error instanceof Error ? error.message : error);
      await pausar();
      deveContinuar = false;
    }
  }
}

async function devolver(): Promise<void> {
  console.clear();
  console.log("=== Registrar Devolução ===\n");

  try {
    const id = await perguntarNumero("ID do empréstimo: ");

    if (id === null) {
      console.log("\nID inválido.");
      await pausar();
      return;
    }

    const emprestimoAtual = await obterEmprestimoPorId(id);

    console.log("\nEmpréstimo encontrado:");
    imprimirDetalhesEmprestimo(emprestimoAtual);

    const deveDevolver = await confirmar("\nDeseja registrar a devolução deste empréstimo?");

    if (!deveDevolver) {
      console.log("\nOperação cancelada.");
      await pausar();
      return;
    }

    const emprestimo = await devolverEmprestimo(id);

    console.log("\nDevolução registrada com sucesso:");
    imprimirDetalhesEmprestimo(emprestimo);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

export async function exibirMenuEmprestimos(): Promise<void> {
  await exibirMenu("Empréstimos", [
    {
      chave: "1",
      descricao: "Realizar empréstimo",
      executar: cadastrar,
    },
    {
      chave: "2",
      descricao: "Listar empréstimos ativos",
      executar: listar,
    },
    {
      chave: "3",
      descricao: "Consultar empréstimo por ID",
      executar: consultarPorId,
    },
    {
      chave: "4",
      descricao: "Pesquisar empréstimos ativos",
      executar: exibirMenuPesquisa,
    },
    {
      chave: "5",
      descricao: "Registrar devolução",
      executar: devolver,
    },
    {
      chave: "6",
      descricao: "Histórico de empréstimos",
      executar: listarHistorico,
    },
  ]);
}

async function exibirMenuPesquisa(): Promise<void> {
  await exibirMenu("Pesquisar Empréstimos Ativos", [
    {
      chave: "1",
      descricao: "Pesquisar por ID do livro",
      executar: pesquisarPorIdLivro,
    },
    {
      chave: "2",
      descricao: "Pesquisar por titulo do livro",
      executar: pesquisarPorTituloLivro,
    },
    {
      chave: "3",
      descricao: "Pesquisar por ID do cliente",
      executar: pesquisarPorIdCliente,
    },
    {
      chave: "4",
      descricao: "Pesquisar por nome do cliente",
      executar: pesquisarPorNomeCliente,
    }
  ]);
}
