import { exibirMenu } from "./menuBase";
import { pausar } from "../utils/input";

async function exibirAcaoPlanejada(acao: string): Promise<void> {
  console.clear();
  console.log("=== Empréstimos ===\n");
  console.log(`Ação selecionada: ${acao}`);
  console.log("\nEsta funcionalidade será implementada em uma etapa futura.");

  await pausar();
}

export async function exibirMenuEmprestimos(): Promise<void> {
  await exibirMenu("Empréstimos", [
    {
      chave: "1",
      descricao: "Realizar empréstimo",
      executar: () => exibirAcaoPlanejada("Realizar empréstimo"),
    },
    {
      chave: "2",
      descricao: "Registrar devolução",
      executar: () => exibirAcaoPlanejada("Registrar devolução"),
    },
    {
      chave: "3",
      descricao: "Consultar empréstimos",
      executar: () => exibirAcaoPlanejada("Consultar empréstimos"),
    },
  ]);
}

