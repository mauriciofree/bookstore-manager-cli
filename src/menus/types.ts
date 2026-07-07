export interface OpcaoMenu {
  chave: string;
  descricao: string;
  executar: () => Promise<void>;
}

