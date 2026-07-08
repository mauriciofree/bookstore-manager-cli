import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

export async function perguntar(mensagem: string): Promise<string> {
  const resposta = await rl.question(mensagem);

  return resposta.trim();
}

export async function perguntarComAtalhos(
  mensagem: string
): Promise<string> {
  if (!input.isTTY) {
    return perguntar(mensagem);
  }

  output.write(mensagem);
  rl.pause();
  input.setRawMode(true);
  input.resume();

  return new Promise((resolve) => {
    let resposta = "";

    function finalizar(valor: string): void {
      input.off("data", capturarTecla);
      input.setRawMode(false);
      rl.resume();
      output.write("\n");
      resolve(valor.trim());
    }

    function capturarTecla(data: Buffer): void {
      const tecla = data.toString("utf8");

      if (tecla === "\u0003") {
        fecharInput();
        process.exit();
      }

      if (tecla === "\x1b[D") {
        finalizar("seta-esquerda");
        return;
      }

      if (tecla === "\x1b[C") {
        finalizar("seta-direita");
        return;
      }

      if (tecla === "\x1b[A") {
        finalizar("seta-cima");
        return;
      }

      if (tecla === "\x1b[B") {
        finalizar("seta-baixo");
        return;
      }

      for (const caractere of tecla) {
        if (caractere === "\r" || caractere === "\n") {
          finalizar(resposta);
          return;
        }

        if (caractere === "\b" || caractere === "\x7f") {
          resposta = resposta.slice(0, -1);
          continue;
        }

        if (caractere >= " ") {
          resposta += caractere;
        }
      }
    }

    input.on("data", capturarTecla);
  });
}

export async function confirmar(mensagem: string): Promise<boolean> {
  const resposta = await perguntar(`${mensagem} (s/n): `);
  const respostaNormalizada = resposta.toLowerCase();

  return respostaNormalizada === "s" || respostaNormalizada === "sim";
}

export async function perguntarNumero(mensagem: string): Promise<number | null> {
  const resposta = await perguntar(mensagem);
  const numero = Number(resposta);

  if (Number.isNaN(numero)) {
    return null;
  }

  return numero;
}

export async function pausar(): Promise<void> {
  await perguntar("\nPressione Enter para continuar...");
}

export function fecharInput(): void {
  rl.close();
}

