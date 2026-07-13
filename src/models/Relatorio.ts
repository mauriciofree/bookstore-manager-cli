export interface RelatorioLivroDisponivel {
  livro_id: number;
  titulo: string;
  ano_publicacao: number;
  autor_nome: string;
  quantidade_total: number;
  quantidade_disponivel: number;
}

export interface RelatorioLivroEmprestado {
  emprestimo_id: number;
  livro_id: number;
  titulo: string;
  cliente_nome: string;
  data_emprestimo: Date;
}

export interface RelatorioLivrosPorAutor {
  autor_id: number;
  autor_nome: string;
  quantidade_livros: number;
}

export interface RelatorioEmprestimosPorLivro {
  livro_id: number;
  titulo: string;
  autor_nome: string;
  quantidade_emprestimos: number;
}

export interface RelatorioClienteComEmprestimoAtivo {
  cliente_id: number;
  cliente_nome: string;
  email: string;
  quantidade_emprestimos_ativos: number;
}
