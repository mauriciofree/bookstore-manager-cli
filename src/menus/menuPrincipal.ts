import { exibirMenu } from "./menuBase";
import { exibirMenuCrud } from "./menuCrud";
import { exibirMenuEmprestimos } from "./menuEmprestimos";
import { exibirMenuRelatorios } from "./menuRelatorios";

export async function exibirMenuPrincipal(): Promise<void> {
  await exibirMenu(
    "BookStore Manager CLI",
    [
      {
        chave: "1",
        descricao: "Autores",
        executar: () => exibirMenuCrud("Autores"),
      },
      {
        chave: "2",
        descricao: "Livros",
        executar: () => exibirMenuCrud("Livros"),
      },
      {
        chave: "3",
        descricao: "Clientes",
        executar: () => exibirMenuCrud("Clientes"),
      },
      {
        chave: "4",
        descricao: "Empréstimos",
        executar: exibirMenuEmprestimos,
      },
      {
        chave: "5",
        descricao: "Relatórios",
        executar: exibirMenuRelatorios,
      },
    ],
    "Encerrar aplicação"
  );
}

