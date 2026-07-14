DROP TABLE IF EXISTS emprestimos;
DROP TABLE IF EXISTS livros;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS autores;

CREATE TABLE autores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE livros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(160) NOT NULL,
  ano_publicacao INTEGER NOT NULL,
  quantidade_total INTEGER NOT NULL DEFAULT 1,
  quantidade_disponivel INTEGER NOT NULL DEFAULT 1,
  autor_id INTEGER NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_livros_autores
    FOREIGN KEY (autor_id)
    REFERENCES autores (id)
    ON DELETE RESTRICT,

  CONSTRAINT chk_livros_quantidade_total
    CHECK (quantidade_total >= 0),

  CONSTRAINT chk_livros_quantidade_disponivel
    CHECK (quantidade_disponivel >= 0),

  CONSTRAINT chk_livros_disponivel_menor_ou_igual_total
    CHECK (quantidade_disponivel <= quantidade_total)
);

CREATE TABLE emprestimos (
  id SERIAL PRIMARY KEY,
  livro_id INTEGER NOT NULL,
  cliente_id INTEGER NOT NULL,
  data_emprestimo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_devolucao TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_emprestimos_livros
    FOREIGN KEY (livro_id)
    REFERENCES livros (id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_emprestimos_clientes
    FOREIGN KEY (cliente_id)
    REFERENCES clientes (id)
    ON DELETE RESTRICT,

  CONSTRAINT chk_emprestimos_status
    CHECK (status IN ('ativo', 'devolvido')),

  CONSTRAINT chk_emprestimos_devolucao
    CHECK (
      (status = 'ativo' AND data_devolucao IS NULL)
      OR
      (status = 'devolvido' AND data_devolucao IS NOT NULL)
    )
);

CREATE UNIQUE INDEX idx_autores_nome_unico
ON autores (LOWER(nome));

CREATE UNIQUE INDEX idx_livros_titulo_ano_autor_unico
ON livros (LOWER(titulo), ano_publicacao, autor_id);

CREATE INDEX idx_livros_autor_id ON livros (autor_id);
CREATE INDEX idx_emprestimos_livro_id ON emprestimos (livro_id);
CREATE INDEX idx_emprestimos_cliente_id ON emprestimos (cliente_id);
CREATE INDEX idx_emprestimos_status ON emprestimos (status);

CREATE UNIQUE INDEX idx_emprestimos_livro_cliente_ativo_unico
ON emprestimos (livro_id, cliente_id)
WHERE status = 'ativo';



--
-- Data for Name: autores; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.autores (id, nome, criado_em) VALUES (1, 'Machado de Assis', '2026-07-07 20:17:38.742873');
INSERT INTO public.autores (id, nome, criado_em) VALUES (2, 'Monteiro Lobato', '2026-07-07 20:18:40.04064');
INSERT INTO public.autores (id, nome, criado_em) VALUES (5, 'Clarice Lispector', '2026-07-07 20:27:04.333542');
INSERT INTO public.autores (id, nome, criado_em) VALUES (6, 'Jorge Amado', '2026-07-07 20:27:13.657104');
INSERT INTO public.autores (id, nome, criado_em) VALUES (7, 'José de Alencar', '2026-07-07 20:27:26.249295');
INSERT INTO public.autores (id, nome, criado_em) VALUES (8, 'Cecília Meireles', '2026-07-07 20:27:35.336879');
INSERT INTO public.autores (id, nome, criado_em) VALUES (9, 'Graciliano Ramos', '2026-07-07 20:27:49.272532');
INSERT INTO public.autores (id, nome, criado_em) VALUES (10, 'Carlos Drummond de Andrade', '2026-07-13 18:20:49.660134');
INSERT INTO public.autores (id, nome, criado_em) VALUES (12, 'Castro Alves', '2026-07-13 20:01:38.508712');


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clientes (id, nome, email, telefone, criado_em) VALUES (1, 'Cliente Teste 1', 'cliente1@example.com', '48999990001', '2026-07-09 22:59:14.227745');
INSERT INTO public.clientes (id, nome, email, telefone, criado_em) VALUES (2, 'Cliente Teste 2', 'cliente2@example.com', NULL, '2026-07-09 22:59:58.79169');
INSERT INTO public.clientes (id, nome, email, telefone, criado_em) VALUES (4, 'Cliente Teste 3', 'cliente3@example.com', '48999990003', '2026-07-12 22:01:32.346922');
INSERT INTO public.clientes (id, nome, email, telefone, criado_em) VALUES (5, 'Cliente Teste 4', 'cliente4@example.com', '48999990004', '2026-07-12 22:02:14.516961');
INSERT INTO public.clientes (id, nome, email, telefone, criado_em) VALUES (6, 'Cliente Teste 5', 'cliente5@example.com', '48999990005', '2026-07-13 18:34:34.773773');
INSERT INTO public.clientes (id, nome, email, telefone, criado_em) VALUES (8, 'Cliente Teste 6', 'cliente6@example.com', NULL, '2026-07-13 21:30:14.600911');


--
-- Data for Name: livros; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (3, 'Sítio do Picapau Amarelo', 1920, 4, 4, 2, '2026-07-09 21:49:51.742535');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (4, 'Reinações de Narizinho', 1931, 2, 2, 2, '2026-07-09 21:50:12.218826');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (7, 'Vidas Secas', 1938, 3, 2, 9, '2026-07-09 21:52:17.679807');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (6, 'A Hora da Estrela', 1977, 2, 2, 5, '2026-07-09 21:51:45.282878');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (2, 'Memórias Póstumas de Brás Cubas', 1881, 2, 2, 1, '2026-07-09 21:48:54.746922');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (8, 'Iracema', 1866, 2, 1, 7, '2026-07-09 21:53:03.737094');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (1, 'Dom Casmurro', 1899, 3, 1, 1, '2026-07-09 21:32:02.935077');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (5, 'Capitães da Areia', 1937, 3, 2, 6, '2026-07-09 21:50:44.140791');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (14, 'Alguma Poesia', 1930, 2, 2, 10, '2026-07-13 18:29:51.95056');
INSERT INTO public.livros (id, titulo, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, criado_em) VALUES (17, 'Os Escravos', 1865, 2, 1, 12, '2026-07-13 21:29:27.864047');


--
-- Data for Name: emprestimos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (2, 1, 2, '2026-07-12 22:00:14.277894', NULL, 'ativo', '2026-07-12 22:00:14.277894');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (4, 7, 1, '2026-07-12 22:03:51.217187', NULL, 'ativo', '2026-07-12 22:03:51.217187');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (1, 1, 1, '2026-07-12 21:59:35.59565', '2026-07-12 22:04:48.876545', 'devolvido', '2026-07-12 21:59:35.59565');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (6, 1, 1, '2026-07-12 22:39:56.043431', '2026-07-12 23:07:22.245986', 'devolvido', '2026-07-12 22:39:56.043431');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (5, 1, 5, '2026-07-12 22:04:03.245121', '2026-07-12 23:07:39.837078', 'devolvido', '2026-07-12 22:04:03.245121');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (9, 1, 4, '2026-07-12 23:08:09.902323', '2026-07-12 23:08:42.360983', 'devolvido', '2026-07-12 23:08:09.902323');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (7, 6, 1, '2026-07-12 23:06:06.107916', '2026-07-12 23:10:16.172852', 'devolvido', '2026-07-12 23:06:06.107916');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (3, 2, 1, '2026-07-12 22:00:23.645964', '2026-07-12 23:10:24.189546', 'devolvido', '2026-07-12 22:00:23.645964');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (10, 1, 5, '2026-07-12 23:10:58.800993', NULL, 'ativo', '2026-07-12 23:10:58.800993');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (11, 8, 1, '2026-07-12 23:11:42.499515', NULL, 'ativo', '2026-07-12 23:11:42.499515');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (8, 1, 1, '2026-07-12 23:07:49.485996', '2026-07-13 18:07:01.917837', 'devolvido', '2026-07-12 23:07:49.485996');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (12, 5, 1, '2026-07-13 18:07:19.402331', NULL, 'ativo', '2026-07-13 18:07:19.402331');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (13, 14, 6, '2026-07-13 18:38:48.337592', '2026-07-13 18:43:13.784564', 'devolvido', '2026-07-13 18:38:48.337592');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (19, 17, 8, '2026-07-13 21:36:35.91309', NULL, 'ativo', '2026-07-13 21:36:35.91309');
INSERT INTO public.emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao, status, criado_em) VALUES (20, 17, 2, '2026-07-13 21:37:18.592423', '2026-07-13 21:38:55.148541', 'devolvido', '2026-07-13 21:37:18.592423');

