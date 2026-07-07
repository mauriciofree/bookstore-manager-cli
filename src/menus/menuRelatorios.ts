import { exibirMenu } from "./menuBase";
import { pausar } from "../utils/input";

async function exibirRelatorioPlanejado(relatorio: string): Promise<void> {
  console.clear();
  console.log("=== Relatórios ===\n");
  console.log(`Relatório selecionado: ${relatorio}`);
  console.log("\nEste relatório será implementado em uma etapa futura.");

  await pausar();
}

export async function exibirMenuRelatorios(): Promise<void> {
  await exibirMenu("Relatorios", [
    {
      chave: "1",
      descricao: "Livros disponíveis",
      executar: () => exibirRelatorioPlanejado("Livros disponíveis"),
    },
    {
      chave: "2",
      descricao: "Livros emprestados",
      executar: () => exibirRelatorioPlanejado("Livros emprestados"),
    },
    {
      chave: "3",
      descricao: "Livros cadastrados por autor",
      executar: () => exibirRelatorioPlanejado("Livros cadastrados por autor"),
    },
    {
      chave: "4",
      descricao: "Quantidade de empréstimos por livro",
      executar: () => exibirRelatorioPlanejado("Quantidade de empréstimos por livro"),
    },
    {
      chave: "5",
      descricao: "Clientes com empréstimos ativos",
      executar: () => exibirRelatorioPlanejado("Clientes com empréstimos ativos"),
    },
  ]);
}

