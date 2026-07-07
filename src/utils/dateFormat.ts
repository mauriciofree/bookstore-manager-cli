export function formatarDataParaBanco(data: Date): string {
  return data.toISOString();
}

export function formatarDataHoraParaExibicao(data: Date | string | null): string {
  if (!data) {
    return "-";
  }

  const dataConvertida = data instanceof Date ? data : new Date(data);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(dataConvertida);
}

export function formatarDataParaExibicao(data: Date | string | null): string {
  if (!data) {
    return "-";
  }

  const dataConvertida = data instanceof Date ? data : new Date(data);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(dataConvertida);
}

