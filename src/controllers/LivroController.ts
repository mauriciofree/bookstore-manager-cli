import { Livro,LivroComAutor } from "../models/Livro";
import { buscarAutorPorId } from "../repositories/AutorRepository";
import {
  cadastrarLivro,
  editarLivro,
  obterLivroPorId,
  obterLivrosPaginados,
  pesquisarLivrosPorTituloPaginado,
  removerLivro,
} from "../services/LivroService";
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

const LIVROS_POR_PAGINA = 5;

type AcaoPaginacao = "anterior" | "proxima" | "primeira" | "ultima" | "voltar";

function imprimirLivros(livros: LivroComAutor[]): void {
  if (livros.length === 0) {
    console.log("Nenhum registro encontrado.");
    return;
  }

  for (const livro of livros) {
    console.log(
      `[${livro.id}] ${livro.titulo} (${livro.ano_publicacao}) | Autor: ${livro.autor_nome}`
    );
    console.log(
      `    Total: ${livro.quantidade_total} | Disponiveis: ${livro.quantidade_disponivel} | Criado em: ${formatarDataParaExibicao(livro.criado_em)}`
    );
  }
}

function imprimirDetalhesLivro(livro: LivroComAutor): void {
  console.log(`ID: ${livro.id}`);
  console.log(`Título: ${livro.titulo}`);
  console.log(`Ano de publicação: ${livro.ano_publicacao}`);
  console.log(`Quantidade total: ${livro.quantidade_total}`);
  console.log(`Quantidade disponivel: ${livro.quantidade_disponivel}`);
  console.log(`Autor: ${livro.autor_id} - ${livro.autor_nome}`);
  console.log(`Criado em: ${formatarDataHoraParaExibicao(livro.criado_em)}`);
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
  console.log("=== Cadastrar Livro ===\n");

  try {
    const titulo = await perguntar("Título do livro: ");
    const anoPublicacao = await perguntar("Ano de publicação: ");
    const quantidadeTotal = await perguntar("Quantidade total: ");
    const autorId = await perguntar("ID do autor: ");
    const autor = await buscarAutorPorId(Number(autorId));

    console.log("\nConfira os dados do livro:");
    console.log(`Título: ${titulo}`);
    console.log(`Ano de publicação: ${anoPublicacao}`);
    console.log(`Quantidade total: ${quantidadeTotal}`);
    console.log(`Autor: ${autor ? `${autor.id} - ${autor.nome}` : autorId}`);

    const deveCadastrar = await confirmar("\nDeseja cadastrar este livro?");

    if (!deveCadastrar) {
      console.log("\nOperacao cancelada.");
      await pausar();
      return;
    }
    
    const livro = await cadastrarLivro(titulo,anoPublicacao,quantidadeTotal,autorId);

    console.log("\nLivro cadastrado com sucesso:");
    console.log(`[${livro.id}] ${livro.titulo} (${livro.ano_publicacao}) | Autor: ${livro.autor_nome}`);
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
    console.log("=== Listar Livros ===\n");

    try {
      const resultado = await obterLivrosPaginados(pagina, LIVROS_POR_PAGINA);
      pagina = resultado.paginaAtual;

      imprimirLivros(resultado.livros);
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
  console.log("=== Consultar Livro por ID ===\n");

  try {
    const id = await perguntarNumero("ID do livro: ");

    if (id === null) {
      console.log("\nID inválido.");
      await pausar();
      return;
    }

    const livro = await obterLivroPorId(id);

    console.log("\nLivro encontrado:");
    imprimirDetalhesLivro(livro);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function pesquisarPorTitulo(): Promise<void> {
  console.clear();
  console.log("=== Pesquisar Livros por Título ===\n");

  try {
    const titulo = await perguntar("Digite parte do título do livro: ");
    let pagina = 1;
    let deveContinuar = true;

    while (deveContinuar) {
      console.clear();
      console.log("=== Pesquisar Livros por Título ===\n");
      console.log(`Busca: ${titulo}\n`);

      const resultado = await pesquisarLivrosPorTituloPaginado(
        titulo,
        pagina,
        LIVROS_POR_PAGINA
      );
      pagina = resultado.paginaAtual;

      imprimirLivros(resultado.livros);
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
  console.log("=== Atualizar Livro ===\n");

  try {
    const id = await perguntarNumero("ID do livro: ");

    if (id === null) {
      console.log("\nID inválido.");
      await pausar();
      return;
    }

    const livroAtual = await obterLivroPorId(id);

    console.log("\nLivro atual:");
    imprimirDetalhesLivro(livroAtual);

   
    const novoTitulo = await perguntar("Título do livro: ");
    const novoAnoPublicacao = await perguntar("Ano de publicação: ");
    const quantidadeTotal = await perguntar("Quantidade total: ");
    const autorId = await perguntar("ID do autor: ");
    const autor = await buscarAutorPorId(Number(autorId));

    console.log("\nConfira os novos dados do livro:");
    console.log(`Título: ${novoTitulo}`);
    console.log(`Ano de publicação: ${novoAnoPublicacao}`);
    console.log(`Quantidade total: ${quantidadeTotal}`);
    console.log(`Autor: ${autor ? `${autor.id} - ${autor.nome}` : autorId}`);

    const deveAtualizar = await confirmar("\nDeseja atualizar este livro?");

    if (!deveAtualizar) {
      console.log("\nOperacao cancelada.");
      await pausar();
      return;
    }
    

    const livroAtualizado = await editarLivro(id, 
                                              novoTitulo, 
                                              novoAnoPublicacao,
                                              quantidadeTotal,
                                              autorId);

    console.log("\nLivro atualizado com sucesso:");
    imprimirDetalhesLivro(livroAtualizado);
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

async function remover(): Promise<void> {
  console.clear();
  console.log("=== Remover Livro ===\n");

  try {
    const id = await perguntarNumero("ID do livro: ");

    if (id === null) {
      console.log("\nID inválido.");
      await pausar();
      return;
    }

    const livro = await obterLivroPorId(id);

    console.log("\nLivro encontrado:");
    imprimirDetalhesLivro(livro);

    const deveRemover = await confirmar("\nDeseja realmente remover este livro?");

    if (!deveRemover) {
      console.log("\nOperação cancelada.");
      await pausar();
      return;
    }

    await removerLivro(id);
    console.log("\nLivro removido com sucesso.");
  } catch (error) {
    console.error("\n[ERRO]", error instanceof Error ? error.message : error);
  }

  await pausar();
}

export async function exibirMenuLivros(): Promise<void> {
  await exibirMenu("Livros", [
    {
      chave: "1",
      descricao: "Cadastrar livro",
      executar: cadastrar,
    },
    {
      chave: "2",
      descricao: "Listar livros",
      executar: listar,
    },
    {
      chave: "3",
      descricao: "Consultar livro por ID",
      executar: consultarPorId,
    },
    {
      chave: "4",
      descricao: "Pesquisar livros por título",
      executar: pesquisarPorTitulo,
    },
    {
      chave: "5",
      descricao: "Atualizar livro",
      executar: atualizar,
    },
    {
      chave: "6",
      descricao: "Remover livro",
      executar: remover,
    },
  ]);
}
