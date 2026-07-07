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
