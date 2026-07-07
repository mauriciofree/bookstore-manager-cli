export interface Livro {
  id: number;
  titulo: string;
  ano_publicacao: number;
  quantidade_total: number;
  quantidade_disponivel: number;
  autor_id: number;
  criado_em: Date;
}

