import { Cliente } from "../models/Cliente";
import {
  cadastrarCliente,
  editarCliente,
  obterClientePorId,
  obterClientesPaginados,
  pesquisarClientesPorNomePaginado,
  removerCliente,
} from "../services/ClienteService";
import { exibirMenu } from "../menus/menuBase";
import { confirmar, pausar, perguntar, perguntarNumero } from "../utils/input";
import {
  formatarDataHoraParaExibicao,
  formatarDataParaExibicao,
} from "../utils/dateFormat";

const CLIENTES_POR_PAGINA = 5;

type AcaoPaginacao = "anterior" | "proxima" | "primeira" | "ultima" | "voltar";

function imprimirClientes(clientes: Cliente[]): void {
  if (clientes.length === 0) {
    console.log("Nenhum registro encontrado.");
    return;
  }

  for (const cliente of clientes) {
    console.log(`[${cliente.id}] ${cliente.nome} | ${cliente.email}`);
    console.log(
      `    Telefone: ${cliente.telefone ?? "-"} | Criado em: ${formatarDataParaExibicao(cliente.criado_em)}`
    );
  }
}

function imprimirDetalhesCliente(cliente: Cliente): void {
  console.log(`ID: ${cliente.id}`);
  console.log(`Nome: ${cliente.nome}`);
  console.log(`E-mail: ${cliente.email}`);
  console.log(`Telefone: ${cliente.telefone ?? "-"}`);
  console.log(`Criado em: ${formatarDataHoraParaExibicao(cliente.criado_em)}`);
}

async function lerAcaoPaginacao(): Promise<AcaoPaginacao | null> {
  console.log("\nA. Anterior | P. Proxima | I. Primeira | U. Ultima | 0. Voltar");

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
  console.log("=== Cadastrar Cliente ===\n");

  try {
    const nome = await perguntar("Nome do cliente: ");
    const email = await perguntar("E-mail: ");
    const telefone = await perguntar("Telefone (opcional): ");

    console.log("\nConfira os dados do cliente:");
    console.log(`Nome: ${nome}`);
    console.log(`E-mail: ${email}`);
    console.log(`Telefone: ${telefone || "-"}`);

    const deveCadastrar = await confirmar("\nDeseja cadastrar este cliente?");

    if (!deveCadastrar) {
      console.log("\nOperação cancelada.");
      await pausar();
      return;
    }

    const cliente = await cadastrarCliente(nome, email, telefone);

    console.log("\nCliente cadastrado com sucesso:");
    imprimirDetalhesCliente(cliente);
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
    console.log("=== Listar Clientes ===\n");

    try {
      const resultado = await obterClientesPaginados(pagina, CLIENTES_POR_PAGINA);
      pagina = resultado.paginaAtual;

      imprimirClientes(resultado.clientes);
      console.log(
        `\nPagina ${resultado.paginaAtual} de ${resultado.totalPaginas} | Total: ${resultado.totalRegistros}`
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

async function consultarPorId(): Promise<void> {
  console.clear();
  console.log("=== Consultar Cliente por ID ===\n");

  try {
    const id = await perguntarNumero("ID do cliente: ");

    if (id === null) {
      console.log("\nID invalido.");
      await pausar();
      return;
    }

    const cliente = await obterClientePorId(id);

    console.log("\nCliente encontrado:");
    imprimirDetalhesCliente(cliente);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function pesquisarPorNome(): Promise<void> {
  console.clear();
  console.log("=== Pesquisar Clientes por Nome ===\n");

  try {
    const nome = await perguntar("Digite parte do nome do cliente: ");
    let pagina = 1;
    let deveContinuar = true;

    while (deveContinuar) {
      console.clear();
      console.log("=== Pesquisar Clientes por Nome ===\n");
      console.log(`Busca: ${nome}\n`);

      const resultado = await pesquisarClientesPorNomePaginado(
        nome,
        pagina,
        CLIENTES_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirClientes(resultado.clientes);
      console.log(
        `\nPagina ${resultado.paginaAtual} de ${resultado.totalPaginas} | Total: ${resultado.totalRegistros}`
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

async function atualizar(): Promise<void> {
  console.clear();
  console.log("=== Atualizar Cliente ===\n");

  try {
    const id = await perguntarNumero("ID do cliente: ");

    if (id === null) {
      console.log("\nID invalido.");
      await pausar();
      return;
    }

    const clienteAtual = await obterClientePorId(id);

    console.log("\nCliente atual:");
    imprimirDetalhesCliente(clienteAtual);

    const nome = await perguntar("\nNome do cliente: ");
    const email = await perguntar("E-mail: ");
    const telefone = await perguntar("Telefone (opcional): ");

    console.log("\nConfira os novos dados do cliente:");
    console.log(`Nome: ${nome}`);
    console.log(`E-mail: ${email}`);
    console.log(`Telefone: ${telefone || "-"}`);

    const deveAtualizar = await confirmar("\nDeseja atualizar este cliente?");

    if (!deveAtualizar) {
      console.log("\nOperação cancelada.");
      await pausar();
      return;
    }

    const clienteAtualizado = await editarCliente(id, nome, email, telefone);

    console.log("\nCliente atualizado com sucesso:");
    imprimirDetalhesCliente(clienteAtualizado);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function remover(): Promise<void> {
  console.clear();
  console.log("=== Remover Cliente ===\n");

  try {
    const id = await perguntarNumero("ID do cliente: ");

    if (id === null) {
      console.log("\nID invalido.");
      await pausar();
      return;
    }

    const cliente = await obterClientePorId(id);

    console.log("\nCliente encontrado:");
    imprimirDetalhesCliente(cliente);

    const deveRemover = await confirmar("\nDeseja realmente remover este cliente?");

    if (!deveRemover) {
      console.log("\nOperação cancelada.");
      await pausar();
      return;
    }

    await removerCliente(id);
    console.log("\nCliente removido com sucesso.");
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

export async function exibirMenuClientes(): Promise<void> {
  await exibirMenu("Clientes", [
    {
      chave: "1",
      descricao: "Cadastrar cliente",
      executar: cadastrar,
    },
    {
      chave: "2",
      descricao: "Listar clientes",
      executar: listar,
    },
    {
      chave: "3",
      descricao: "Consultar cliente por ID",
      executar: consultarPorId,
    },
    {
      chave: "4",
      descricao: "Pesquisar clientes por nome",
      executar: pesquisarPorNome,
    },
    {
      chave: "5",
      descricao: "Atualizar cliente",
      executar: atualizar,
    },
    {
      chave: "6",
      descricao: "Remover cliente",
      executar: remover,
    },
  ]);
}

