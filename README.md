# BookStore Manager CLI

## Repositorio

GitHub: https://github.com/mauriciofree/bookstore-manager-cli

---

## Sobre o Projeto

O BookStore Manager CLI será uma aplicação back-end desenvolvida em Node.js com TypeScript para gerenciamento de uma pequena livraria por meio do terminal.

A aplicação terá como objetivo controlar autores, livros, clientes e empréstimos, utilizando PostgreSQL para persistência dos dados e uma organização em camadas para separar responsabilidades entre menus, controllers, services, repositories, models e database.

---

## Objetivo

Este projeto tem como objetivo praticar os conceitos estudados no Modulo 01 do curso, incluindo:

- Node.js
- TypeScript
- Programação Orientada a Objetos
- Interfaces e tipagem estática
- Funções asséncronas
- Promises
- Async/Await
- Tratamento de erros
- PostgreSQL
- Modelagem de banco de dados relacional
- Consultas SQL
- Arquitetura em camadas
- Git e GitHub
- GitFlow
- Kanban

---

## Tecnologias Utilizadas

- Node.js
- TypeScript
- TSX
- PostgreSQL
- Biblioteca pg
- Dotenv
- Git
- GitHub
- Trello (Kanban)

---

## Pré-requisitos

Antes de executar o projeto será necessário possuir instalado:

- Node.js
- npm
- Git
- PostgreSQL

---

## Como Instalar

Clone o repositório:

```bash
git clone https://github.com/mauriciofree/bookstore-manager-cli
```

Acesse a pasta do projeto:

```bash
cd bookstore-manager-cli
```

Instale as dependências:

```bash
npm install
```

---

## Configuração do Ambiente

Crie o banco de dados no PostgreSQL:

```bash
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE sctec_mauricio_bockstore;"
```

Crie um arquivo `.env` na raiz do projeto com as configurações do banco de dados.

O valor de `PGDATABASE` deve ser o mesmo nome do banco criado no passo anterior:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=sctec_mauricio_bockstore
```

Observação: o arquivo `.env.example` já segue o exemplo dado pelo professor.

Depois de configurar o `.env`, execute o script SQL para criar as tabelas:

```bash
psql -h localhost -p 5432 -U postgres -d sctec_mauricio_bockstore -f src/database/schema.sql
```

Caso utilize outra porta, usuário, senha ou nome de banco, ajuste os comandos e o arquivo `.env` com os mesmos dados do seu ambiente local.

---

## Como Executar

Executar em modo de desenvolvimento:

```bash
npm run dev
```

Compilar o projeto:

```bash
npm run build
```

Executar a versão compilada:

```bash
npm start
```

---

## Funcionalidades Planejadas

### Autores

- Cadastrar autores
- Listar autores
- Consultar autor por identificador
- Atualizar autores
- Remover autores

### Livros

- Cadastrar livros
- Listar livros
- Consultar livros
- Atualizar livros
- Remover livros
- Vincular livro a um autor previamente cadastrado

### Clientes

- Cadastrar clientes
- Listar clientes
- Consultar clientes
- Atualizar clientes
- Remover clientes

### Empréstimos

- Registrar empréstimo de livro para cliente
- Validar existência do livro
- Validar existência do cliente
- Validar disponibilidade do livro
- Registrar devolução
- Consultar empréstimos

### Relatorios

- Livros disponíveis
- Livros emprestados
- Livros cadastrados por autor
- Quantidade de empréstimos por livro
- Clientes com empréstimos ativos

---

## Estrutura do Projeto

```text
src/
├── main.ts
├── controllers/
│   ├── AutorController.ts
│   ├── LivroController.ts
│   ├── ClienteController.ts
│   └── EmprestimoController.ts
├── services/
│   ├── AutorService.ts
│   ├── LivroService.ts
│   ├── ClienteService.ts
│   └── EmprestimoService.ts
├── repositories/
│   ├── AutorRepository.ts
│   ├── LivroRepository.ts
│   ├── ClienteRepository.ts
│   └── EmprestimoRepository.ts
├── models/
├── database/
│   ├── connection.ts
│   └── schema.sql
├── utils/
└── menus/
```

Arquivos principais na raiz:

```text
package.json
tsconfig.json
.env.example
.gitignore
README.md
```

---

## Explicação das Pastas

### main.ts

Ponto de entrada da aplicação. Será responsável por iniciar o sistema, estabelecer a conexão com o banco de dados e abrir o menu principal.

### controllers/

Responsável pela comunicação com o usuario via terminal. Os controllers receberao entradas, exibirao mensagens e acionarao os services.

### services/

Responsável pelas regras de negócio da aplicação, validações e coordenação das operações antes do acesso ao banco de dados.

### repositories/

Responsável pela comunicação com o PostgreSQL. Os repositories executarão comandos SQL para inserir, consultar, atualizar e remover dados.

### models/

Contém classes, interfaces e tipos utilizados para representar autores, livros, clientes e empréstimos.

### database/

Contém a configuração da conexão com PostgreSQL e o script SQL de criação das tabelas.

### utils/

Contém funções auxiliares reutilizáveis, como formatação, validações e tratamento de entradas.

### menus/

Responsável pela organização dos menus e navegação da aplicação CLI.

---

## Conceitos que Serão Aplicados

### TypeScript

O projeto será desenvolvido utilizando TypeScript para adicionar tipagem estática ao código, com tipos em parâmetros, retornos, propriedades, arrays, classes e interfaces.

### Programação Orientada a Objetos

As entidades principais do sistema serão representadas com classes e/ou interfaces, mantendo dados organizados e contratos claros entre as camadas.

### Programação Assíncrona

As operações com banco de dados serão implementadas utilizando Promises e async/await.

### Tratamento de Erros

Operações críticas terão tratamento com try/catch para evitar que erros de conexão, consultas SQL ou entradas inválidas interrompam a aplicação.

### Arquitetura em Camadas

O projeto seguirá uma separação de responsabilidades entre menus, controllers, services, repositories, models, database e utils.

### PostgreSQL

O banco de dados será modelado com tabelas relacionais, chaves primarias, chaves estrangeiras e consultas SQL.

---

## Organizaçao do Projeto

O gerenciamento das tarefas será realizado utilizando Kanban.

### Quadro Kanban

Link do quadro:

https://trello.com/b/IR5SgcUs/bookstore-manager-cli

### Colunas Utilizadas

- Backlog
- A Fazer
- Em Andamento
- Concluido

### Principais Tarefas

- Criar repositório no GitHub
- Criar quadro Kanban
- Configurar projeto Node.js com TypeScript
- Criar estrutura de pastas
- Configurar PostgreSQL
- Criar script SQL do banco de dados
- Criar models e interfaces
- Implementar menu principal
- Implementar módulo de autores
- Implementar módulo de livros
- Implementar módulo de clientes
- Implementar módulo de empréstimos
- Implementar devoluções
- Implementar relatórios
- Tratar erros e validações
- Atualizar README.md
- Gravar video de apresentação
- Enviar links no AVA

---

## Fluxo de Versionamento

O projeto será desenvolvido utilizando GitFlow simplificado.

### Branches Planejadas

- main
- develop
- feat/autores
- feat/livros
- feat/clientes
- feat/emprestimos
- feat/relatorios
- docs/readme

### Exemplos de Commits Semânticos

```text
feat: cria estrutura inicial do projeto
feat: configura conexão com postgresql
feat: cria script inicial do banco de dados
feat: adiciona models e interfaces principais
feat: implementa gerenciamento de autores
feat: implementa gerenciamento de livros
feat: implementa gerenciamento de clientes
feat: implementa empréstimos de livros
feat: implementa devolução de livros
feat: implementa relatorios
docs: atualiza readme com instruções
fix: corrige validação de empréstimos
```

---

## Melhorias Futuras

- Criar testes automatizados
- Adicionar filtros avançados nos relatórios
- Registrar histórico completo de alterações dos empréstimos
- Criar uma API REST para a aplicação
- Criar interface web para administração da livraria

---

## Checklist Final de Entrega

[x] Criar repositório público no GitHub  
[x] Criar quadro Kanban  
[x] Configurar projeto Node.js com TypeScript  
[x] Criar package.json  
[x] Criar tsconfig.json  
[x] Criar src/main.ts  
[x] Configurar scripts de execução  
[x] Configurar conexão com PostgreSQL  
[x] Criar arquivo .env.example  
[x] Criar script SQL do banco de dados  
[x] Criar models e interfaces  
[x] Implementar arquitetura em camadas  
[x] Implementar menu principal  
[x] Implementar CRUD de autores  
[x] Implementar CRUD de livros  
[x] Implementar CRUD de clientes  
[x] Implementar empréstimos  
[x] Implementar devoluções  
[x] Implementar consultas de empréstimos  
[x] Implementar relatórios  
[x] Implementar validações de regras de negócio  
[x] Implementar tratamento de erros  
[ ] Atualizar README.md com exemplos reais  
[ ] Fazer commits semânticos  
[ ] Usar branches mínimas  
[ ] Gravar vídeo de apresentação  
[ ] Enviar link do GitHub no AVA  
[ ] Enviar link do video no AVA  

---

## Exemplos de Uso

### Cadastrar um autor

No menu principal:

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 1
```
```text
=== Autores ===

1. Cadastrar autor
2. Listar autores
3. Consultar autor por ID
4. Pesquisar autores por nome
5. Atualizar autor
6. Remover autor
0. Voltar

Escolha uma opção: 1
```

```text
=== Cadastrar Autor ===

Nome do autor: Carlos Drummond de Andrade

Confira os dados do autor:
Nome: Carlos Drummond de Andrade

Deseja cadastrar este autor? (s/n): s
```

```text
Autor cadastrado com sucesso:
ID: 10
Nome: Carlos Drummond de Andrade
Criado em: 13/07/2026, 18:20

Pressione Enter para continuar...
```

### Listar autores cadastrados

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 1
```

```text
=== Autores ===

1. Cadastrar autor
2. Listar autores
3. Consultar autor por ID
4. Pesquisar autores por nome
5. Atualizar autor
6. Remover autor
0. Voltar

Escolha uma opção: 2
```

```text
=== Listar Autores ===

[10] Carlos Drummond de Andrade
    Criado em: 13/07/2026
[8] Cecília Meireles
    Criado em: 07/07/2026
[5] Clarice Lispector
    Criado em: 07/07/2026
[9] Graciliano Ramos
    Criado em: 07/07/2026
[6] Jorge Amado
    Criado em: 07/07/2026

Pagina 1 de 2 | Total: 8

A. Anterior | P. Proxima | I. Primeira | U. Ultima | 0. Voltar
Opcao: p
```

```text
=== Listar Autores ===

[7] José de Alencar
    Criado em: 07/07/2026
[1] Machado de Assis
    Criado em: 07/07/2026
[2] Monteiro Lobato
    Criado em: 07/07/2026

Pagina 2 de 2 | Total: 8

A. Anterior | P. Proxima | I. Primeira | U. Ultima | 0. Voltar
Opcao: 
```

### Cadastrar um livro

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 2
```

```text
=== Livros ===

1. Cadastrar livro
2. Listar livros
3. Consultar livro por ID
4. Pesquisar livros por título
5. Atualizar livro
6. Remover livro
0. Voltar

Escolha uma opção: 1
```

```text
=== Cadastrar Livro ===

Título do livro: Alguma Poesia
Ano de publicação: 1930
Quantidade total: 2
ID do autor: 10

Confira os dados do livro:
Título: Alguma Poesia
Ano de publicação: 1930
Quantidade total: 2
Autor: 10 - Carlos Drummond de Andrade

Deseja cadastrar este livro? (s/n): s
```

```text
Livro cadastrado com sucesso:
[14] Alguma Poesia (1930) | Autor: Carlos Drummond de Andrade

Pressione Enter para continuar...
```

### Listar livros cadastrados

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 2
```

```text
=== Livros ===

1. Cadastrar livro
2. Listar livros
3. Consultar livro por ID
4. Pesquisar livros por título
5. Atualizar livro
6. Remover livro
0. Voltar

Escolha uma opção: 2
```

```text
=== Listar Livros ===

[6] A Hora da Estrela (1977) | Autor: Clarice Lispector
    Total: 2 | Disponiveis: 2 | Criado em: 09/07/2026
[14] Alguma Poesia (1930) | Autor: Carlos Drummond de Andrade
    Total: 2 | Disponiveis: 2 | Criado em: 13/07/2026
[5] Capitães da Areia (1937) | Autor: Jorge Amado
    Total: 3 | Disponiveis: 2 | Criado em: 09/07/2026
[1] Dom Casmurro (1899) | Autor: Machado de Assis
    Total: 3 | Disponiveis: 1 | Criado em: 09/07/2026
[8] Iracema (1866) | Autor: José de Alencar
    Total: 2 | Disponiveis: 1 | Criado em: 09/07/2026

Pagina 1 de 2 | Total: 9

A. Anterior | P. Proxima | I. Primeira | U. Ultima | 0. Voltar
Opcao: p
```

```text
=== Listar Livros ===

[2] Memórias Póstumas de Brás Cubas (1881) | Autor: Machado de Assis
    Total: 2 | Disponiveis: 2 | Criado em: 09/07/2026
[4] Reinações de Narizinho (1931) | Autor: Monteiro Lobato
    Total: 2 | Disponiveis: 2 | Criado em: 09/07/2026
[3] Sítio do Picapau Amarelo (1920) | Autor: Monteiro Lobato
    Total: 4 | Disponiveis: 4 | Criado em: 09/07/2026
[7] Vidas Secas (1938) | Autor: Graciliano Ramos
    Total: 3 | Disponiveis: 2 | Criado em: 09/07/2026

Pagina 2 de 2 | Total: 9

A. Anterior | P. Proxima | I. Primeira | U. Ultima | 0. Voltar
Opcao: 
```

### Cadastrar um cliente

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 3
```

```text
=== Clientes ===

1. Cadastrar cliente
2. Listar clientes
3. Consultar cliente por ID
4. Pesquisar clientes por nome
5. Atualizar cliente
6. Remover cliente
0. Voltar

Escolha uma opção: 1
```

```text
=== Cadastrar Cliente ===

Nome do cliente: Ana Silva
E-mail: ana@email.com
Telefone (opcional): 48999999999

Confira os dados do cliente:
Nome: Ana Silva
E-mail: ana@email.com
Telefone: 48999999999

Deseja cadastrar este cliente? (s/n): s
```

```text
Cliente cadastrado com sucesso:
ID: 6
Nome: Ana Silva
E-mail: ana@email.com
Telefone: 48999999999
Criado em: 13/07/2026, 18:34

Pressione Enter para continuar...
```
### Listar clientes cadastrados

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 3
```

```text
=== Clientes ===

1. Cadastrar cliente
2. Listar clientes
3. Consultar cliente por ID
4. Pesquisar clientes por nome
5. Atualizar cliente
6. Remover cliente
0. Voltar

Escolha uma opção: 2
```

```text
=== Listar Clientes ===

[6] Ana Silva | ana@email.com
    Telefone: 48999999999 | Criado em: 13/07/2026
[2] Fabio Limbo | limbo@esquece.com
    Telefone: - | Criado em: 09/07/2026
[4] Jose da Silva | josesilva@teste.com
    Telefone: 41898990101 | Criado em: 12/07/2026
[5] Marcos Pontos | marcos.ponto.ponto@pontos.com
    Telefone: 4799990000 | Criado em: 12/07/2026
[1] Mauricio | mauriciomollernote@gmail.com
    Telefone: 47999235542 | Criado em: 09/07/2026

Pagina 1 de 1 | Total: 5

A. Anterior | P. Proxima | I. Primeira | U. Ultima | 0. Voltar
Opcao: 
```
### Realizar um empréstimo

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 4
```

```text
=== Empréstimos ===

1. Realizar empréstimo
2. Listar empréstimos ativos
3. Consultar empréstimo por ID
4. Pesquisar empréstimos ativos
5. Registrar devolução
6. Histórico de empréstimos
0. Voltar

Escolha uma opção: 1
```

```text
=== Realizar Empréstimo ===

ID do livro: 14
ID do cliente: 6

Confira os dados do empréstimo:
Livro: 14 - Alguma Poesia (1930)
Disponíveis: 2
Cliente: 6 - Ana Silva

Deseja realizar este empréstimo? (s/n): s
```

```text
Empréstimo registrado com sucesso:
ID: 13
Livro: 14 - Alguma Poesia (1930)
Cliente: 6 - Ana Silva
Status: Ativo
Data do empréstimo: 13/07/2026, 18:38
Data de devolução: -

Pressione Enter para continuar...
```
### Listar empréstimos em aberto

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 4
```

```text
=== Empréstimos ===

1. Realizar empréstimo
2. Listar empréstimos ativos
3. Consultar empréstimo por ID
4. Pesquisar empréstimos ativos
5. Registrar devolução
6. Histórico de empréstimos
0. Voltar

Escolha uma opção: 2
```

```text
=== Listar Empréstimos Ativos ===

[13] Alguma Poesia (1930) | Ativo
    Cliente: Ana Silva | Empréstimo: 13/07/2026, 18:38 | Devolução: -[12] Capitães da Areia (1937) | Ativo
    Cliente: Mauricio | Empréstimo: 13/07/2026, 18:07 | Devolução: -
[11] Iracema (1866) | Ativo
    Cliente: Mauricio | Empréstimo: 12/07/2026, 23:11 | Devolução: -
[10] Dom Casmurro (1899) | Ativo
    Cliente: Marcos Pontos | Empréstimo: 12/07/2026, 23:10 | Devolução: -
[4] Vidas Secas (1938) | Ativo
    Cliente: Mauricio | Empréstimo: 12/07/2026, 22:03 | Devolução: -

Página 1 de 2 | Total: 6

A. Anterior | P. Próxima | I. Primeira | U. Última | 0. Voltar
Opcao: p
```

```text
=== Listar Empréstimos Ativos ===

[2] Dom Casmurro (1899) | Ativo
    Cliente: Fabio Limbo | Empréstimo: 12/07/2026, 22:00 | Devolução: -

Página 2 de 2 | Total: 6

A. Anterior | P. Próxima | I. Primeira | U. Última | 0. Voltar
Opcao: 
```

### Registrar devolução de empréstimo em aberto

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 4
```

```text
=== Empréstimos ===

1. Realizar empréstimo
2. Listar empréstimos ativos
3. Consultar empréstimo por ID
4. Pesquisar empréstimos ativos
5. Registrar devolução
6. Histórico de empréstimos
0. Voltar

Escolha uma opção: 5
```

```text
=== Registrar Devolução ===

ID do empréstimo: 13

Empréstimo encontrado:
ID: 13
Livro: 14 - Alguma Poesia (1930)
Cliente: 6 - Ana Silva
Status: Ativo
Data do empréstimo: 13/07/2026, 18:38
Data de devolução: -

Deseja registrar a devolução deste empréstimo? (s/n): s
```

```text
Devolução registrada com sucesso:
ID: 13
Livro: 14 - Alguma Poesia (1930)
Cliente: 6 - Ana Silva
Status: Devolvido
Data do empréstimo: 13/07/2026, 18:38
Data de devolução: 13/07/2026, 18:43

Pressione Enter para continuar...
```
### Consultar relatórios

```text
=== BookStore Manager CLI ===

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 5
```

```text
=== Relatorios ===

1. Livros disponíveis
2. Livros emprestados
3. Livros cadastrados por autor
4. Quantidade de empréstimos por livro
5. Clientes com empréstimos ativos
0. Voltar

Escolha uma opção: 4
```

```text
=== Relatório: Empréstimos por Livro ===

[1] Dom Casmurro
    Autor: Machado de Assis | Empréstimos: 7
[6] A Hora da Estrela
    Autor: Clarice Lispector | Empréstimos: 1
[14] Alguma Poesia
    Autor: Carlos Drummond de Andrade | Empréstimos: 1
[5] Capitães da Areia
    Autor: Jorge Amado | Empréstimos: 1
[8] Iracema
    Autor: José de Alencar | Empréstimos: 1
[2] Memórias Póstumas de Brás Cubas
    Autor: Machado de Assis | Empréstimos: 1
[7] Vidas Secas
    Autor: Graciliano Ramos | Empréstimos: 1
[4] Reinações de Narizinho
    Autor: Monteiro Lobato | Empréstimos: 0
[3] Sítio do Picapau Amarelo
    Autor: Monteiro Lobato | Empréstimos: 0

Pressione Enter para continuar...
```