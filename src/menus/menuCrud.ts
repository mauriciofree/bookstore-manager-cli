import { exibirMenu } from "./menuBase";
import { pausar } from "../utils/input";

async function exibirAcaoPlanejada(modulo: string, acao: string): Promise<void> {
  console.clear();
  console.log(`=== ${modulo} ===\n`);
  console.log(`Ação selecionada: ${acao}`);
  console.log("\nEsta funcionalidade será implementada em uma etapa futura.");

  await pausar();
}

export async function exibirMenuCrud(modulo: string): Promise<void> {
  await exibirMenu(modulo, [
    {
      chave: "1",
      descricao: "Cadastrar",
      executar: () => exibirAcaoPlanejada(modulo, "Cadastrar"),
    },
    {
      chave: "2",
      descricao: "Listar",
      executar: () => exibirAcaoPlanejada(modulo, "Listar"),
    },
    {
      chave: "3",
      descricao: "Consultar por identificador",
      executar: () => exibirAcaoPlanejada(modulo, "Consultar por identificador"),
    },
    {
      chave: "4",
      descricao: "Atualizar",
      executar: () => exibirAcaoPlanejada(modulo, "Atualizar"),
    },
    {
      chave: "5",
      descricao: "Remover",
      executar: () => exibirAcaoPlanejada(modulo, "Remover"),
    },
  ]);
}

