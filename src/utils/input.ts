import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

export async function perguntar(mensagem: string): Promise<string> {
  const resposta = await rl.question(mensagem);

  return resposta.trim();
}

export async function confirmar(mensagem: string): Promise<boolean> {
  const resposta = await perguntar(`${mensagem} (s/n): `);
  const respostaNormalizada = resposta.toLowerCase();

  return respostaNormalizada === "s" || respostaNormalizada === "sim";
}

export async function pausar(): Promise<void> {
  await perguntar("\nPressione Enter para continuar...");
}

export function fecharInput(): void {
  rl.close();
}

