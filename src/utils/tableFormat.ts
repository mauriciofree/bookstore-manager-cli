export interface ColunaTabela<T> {
  titulo: string;
  largura: number;
  valor: (item: T) => string | number | null | undefined;
}

function limitarTexto(texto: string, largura: number): string {
  if (texto.length <= largura) {
    return texto.padEnd(largura, " ");
  }

  if (largura <= 3) {
    return texto.slice(0, largura);
  }

  return `${texto.slice(0, largura - 3)}...`;
}

export function imprimirTabela<T>(itens: T[], colunas: ColunaTabela<T>[]): void {
  if (itens.length === 0) {
    console.log("Nenhum registro encontrado.");
    return;
  }

  const cabecalho = colunas
    .map((coluna) => limitarTexto(coluna.titulo, coluna.largura))
    .join(" | ");

  const separador = colunas
    .map((coluna) => "-".repeat(coluna.largura))
    .join("-|-");

  console.log(cabecalho);
  console.log(separador);

  for (const item of itens) {
    const linha = colunas
      .map((coluna) => {
        const valor = coluna.valor(item);
        return limitarTexto(String(valor ?? "-"), coluna.largura);
      })
      .join(" | ");

    console.log(linha);
  }
}

