import { Autor } from "../models/Autor";
import {
  cadastrarAutor,
  editarAutor,
  obterAutorPorId,
  obterAutoresPaginados,
  pesquisarAutoresPorNomePaginado,
  removerAutor,
} from "../services/AutorService";
import { exibirMenu } from "../menus/menuBase";
import {
  confirmar,
  pausar,
  perguntar,
  perguntarNumero,
} from "../utils/input";
import {
  formatarDataHoraParaExibicao,
  formatarDataParaExibicao,
} from "../utils/dateFormat";

const AUTORES_POR_PAGINA = 5;

type AcaoPaginacao = "anterior" | "proxima" | "primeira" | "ultima" | "voltar";

function imprimirAutores(autores: Autor[]): void {
  if (autores.length === 0) {
    console.log("Nenhum registro encontrado.");
    return;
  }

  for (const autor of autores) {
    console.log(`[${autor.id}] ${autor.nome}`);
    console.log(`    Criado em: ${formatarDataParaExibicao(autor.criado_em)}`);
  }
}

function imprimirDetalhesAutor(autor: Autor): void {
  console.log(`ID: ${autor.id}`);
  console.log(`Nome: ${autor.nome}`);
  console.log(`Criado em: ${formatarDataHoraParaExibicao(autor.criado_em)}`);
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
  console.log("=== Cadastrar Autor ===\n");

  try {
    const nome = await perguntar("Nome do autor: ");

    console.log("\nConfira os dados do autor:");
    console.log(`Nome: ${nome}`);

    const deveCadastrar = await confirmar("\nDeseja cadastrar este autor?");

    if (!deveCadastrar) {
      console.log("\nOperacao cancelada.");
      await pausar();
      return;
    }

    const autor = await cadastrarAutor(nome);

    console.log("\nAutor cadastrado com sucesso:");
    imprimirDetalhesAutor(autor);
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
    console.log("=== Listar Autores ===\n");

    try {
      const resultado = await obterAutoresPaginados(pagina, AUTORES_POR_PAGINA);
      pagina = resultado.paginaAtual;

      imprimirAutores(resultado.autores);
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
  console.log("=== Consultar Autor por ID ===\n");

  try {
    const id = await perguntarNumero("ID do autor: ");

    if (id === null) {
      console.log("\nID inválido.");
      await pausar();
      return;
    }

    const autor = await obterAutorPorId(id);

    console.log("\nAutor encontrado:");
    imprimirDetalhesAutor(autor);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function pesquisarPorNome(): Promise<void> {
  console.clear();
  console.log("=== Pesquisar Autores por Nome ===\n");

  try {
    const nome = await perguntar("Digite parte do nome do autor: ");
    let pagina = 1;
    let deveContinuar = true;

    while (deveContinuar) {
      console.clear();
      console.log("=== Pesquisar Autores por Nome ===\n");
      console.log(`Busca: ${nome}\n`);

      const resultado = await pesquisarAutoresPorNomePaginado(
        nome,
        pagina,
        AUTORES_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirAutores(resultado.autores);
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
        console.log("\nOpção inválida.");
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
  console.log("=== Atualizar Autor ===\n");

  try {
    const id = await perguntarNumero("ID do autor: ");

    if (id === null) {
      console.log("\nID inválido.");
      await pausar();
      return;
    }

    const autorAtual = await obterAutorPorId(id);

    console.log("\nAutor atual:");
    imprimirDetalhesAutor(autorAtual);

    const novoNome = await perguntar("\nNovo nome do autor: ");

    console.log("\nConfira os novos dados do autor:");
    console.log(`Nome: ${novoNome}`);

    const deveAtualizar = await confirmar("\nDeseja atualizar este autor?");

    if (!deveAtualizar) {
      console.log("\nOperacao cancelada.");
      await pausar();
      return;
    }

    const autorAtualizado = await editarAutor(id, novoNome);

    console.log("\nAutor atualizado com sucesso:");
    imprimirDetalhesAutor(autorAtualizado);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function remover(): Promise<void> {
  console.clear();
  console.log("=== Remover Autor ===\n");

  try {
    const id = await perguntarNumero("ID do autor: ");

    if (id === null) {
      console.log("\nID inválido.");
      await pausar();
      return;
    }

    const autor = await obterAutorPorId(id);

    console.log("\nAutor encontrado:");
    imprimirDetalhesAutor(autor);

    const deveRemover = await confirmar("\nDeseja realmente remover este autor?");

    if (!deveRemover) {
      console.log("\nOperação cancelada.");
      await pausar();
      return;
    }

    await removerAutor(id);
    console.log("\nAutor removido com sucesso.");
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

export async function exibirMenuAutores(): Promise<void> {
  await exibirMenu("Autores", [
    {
      chave: "1",
      descricao: "Cadastrar autor",
      executar: cadastrar,
    },
    {
      chave: "2",
      descricao: "Listar autores",
      executar: listar,
    },
    {
      chave: "3",
      descricao: "Consultar autor por ID",
      executar: consultarPorId,
    },
    {
      chave: "4",
      descricao: "Pesquisar autores por nome",
      executar: pesquisarPorNome,
    },
    {
      chave: "5",
      descricao: "Atualizar autor",
      executar: atualizar,
    },
    {
      chave: "6",
      descricao: "Remover autor",
      executar: remover,
    },
  ]);
}
