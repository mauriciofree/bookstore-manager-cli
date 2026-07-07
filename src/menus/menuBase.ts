import { perguntar } from "../utils/input";
import { OpcaoMenu } from "./types";

export async function exibirMenu(
  titulo: string,
  opcoes: OpcaoMenu[],
  textoVoltar = "Voltar"
): Promise<void> {
  let deveContinuar = true;

  while (deveContinuar) {
    console.clear();
    console.log(`=== ${titulo} ===\n`);

    for (const opcao of opcoes) {
      console.log(`${opcao.chave}. ${opcao.descricao}`);
    }

    console.log(`0. ${textoVoltar}`);

    const escolha = await perguntar("\nEscolha uma opção: ");

    if (escolha === "0") {
      deveContinuar = false;
      continue;
    }

    const opcaoSelecionada = opcoes.find((opcao) => opcao.chave === escolha);

    if (!opcaoSelecionada) {
      console.log("\nOpção inválida.");
      await perguntar("Pressione Enter para tentar novamente...");
      continue;
    }

    await opcaoSelecionada.executar();
  }
}

