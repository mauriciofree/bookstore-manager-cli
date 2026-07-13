import { exibirMenuAutores } from "../controllers/AutorController";
import { exibirMenuClientes } from "../controllers/ClienteController";
import { exibirMenuLivros } from "../controllers/LivroController";
import { exibirMenu } from "./menuBase";
import { exibirMenuEmprestimos } from "./menuEmprestimos";
import { exibirMenuRelatorios } from "./menuRelatorios";

export async function exibirMenuPrincipal(): Promise<void> {
  await exibirMenu(
    "BookStore Manager CLI",
    [
      {
        chave: "1",
        descricao: "Autores",
        executar: exibirMenuAutores,
      },
      {
        chave: "2",
        descricao: "Livros",
        executar: exibirMenuLivros,
      },
      {
        chave: "3",
        descricao: "Clientes",
        executar: exibirMenuClientes,
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

