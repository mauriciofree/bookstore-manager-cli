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
[ ] Implementar CRUD de clientes  
[ ] Implementar empréstimos  
[ ] Implementar devoluções  
[ ] Implementar consultas de empréstimos  
[ ] Implementar relatórios  
[ ] Implementar validações de regras de negócio  
[ ] Implementar tratamento de erros  
[ ] Atualizar README.md com exemplos reais  
[ ] Fazer commits semânticos  
[ ] Usar branches mínimas  
[ ] Gravar vídeo de apresentação  
[ ] Enviar link do GitHub no AVA  
[ ] Enviar link do video no AVA  

---

## Testes Realizados

[A DEFINIR DURANTE O DESENVOLVIMENTO]
