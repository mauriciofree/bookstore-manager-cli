import { Autor } from "../models/Autor";
import {
  cadastrarAutor,
  editarAutor,
  obterAutorPorId,
  obterAutores,
  pesquisarAutoresPorNome,
  removerAutor,
} from "../services/AutorService";
import { exibirMenu } from "../menus/menuBase";
import { confirmar, pausar, perguntar, perguntarNumero } from "../utils/input";
import {
  formatarDataHoraParaExibicao,
  formatarDataParaExibicao,
} from "../utils/dateFormat";
import { imprimirTabela } from "../utils/tableFormat";

function imprimirAutores(autores: Autor[]): void {
  imprimirTabela(autores, [
    { titulo: "ID", largura: 5, valor: (autor) => autor.id },
    { titulo: "Nome", largura: 35, valor: (autor) => autor.nome },
    {
      titulo: "Criado em",
      largura: 10,
      valor: (autor) => formatarDataParaExibicao(autor.criado_em),
    },
  ]);
}

function imprimirDetalhesAutor(autor: Autor): void {
  console.log(`ID: ${autor.id}`);
  console.log(`Nome: ${autor.nome}`);
  console.log(`Criado em: ${formatarDataHoraParaExibicao(autor.criado_em)}`);
}

async function cadastrar(): Promise<void> {
  console.clear();
  console.log("=== Cadastrar Autor ===\n");

  try {
    const nome = await perguntar("Nome do autor: ");
    const autor = await cadastrarAutor(nome);

    console.log("\nAutor cadastrado com sucesso:");
    imprimirDetalhesAutor(autor);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function listar(): Promise<void> {
  console.clear();
  console.log("=== Listar Autores ===\n");

  try {
    const autores = await obterAutores();
    imprimirAutores(autores);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
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
    const autores = await pesquisarAutoresPorNome(nome);

    console.log("");
    imprimirAutores(autores);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
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
