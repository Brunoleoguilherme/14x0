export type Jogador = {
  id: number;
  campanhaId: number;
  nome: string;
  clube: string;
  ano: number;
  posicoes: string[];
  overall: number;
  ataque: number;
  defesa: number;
};

export const posicoesPorFormacao: Record<string, string[]> = {
  "4-3-3": ["GOL", "LD", "ZAG", "ZAG2", "LE", "VOL", "MC", "MEI", "PD", "CA", "PE"],
  "4-4-2": ["GOL", "LD", "ZAG", "ZAG2", "LE", "VOL", "MC", "MEI", "MEI2", "CA", "CA2"],
  "4-2-3-1": ["GOL", "LD", "ZAG", "ZAG2", "LE", "VOL", "VOL2", "PE", "MEI", "PD", "CA"],
  "4-2-4": ["GOL", "LD", "ZAG", "ZAG2", "LE", "VOL", "MC", "PE", "CA", "CA2", "PD"],
  "3-5-2": ["GOL", "ZAG", "ZAG2", "ZAG3", "ALA", "ALA2", "VOL", "MC", "MEI", "CA", "CA2"],
  "5-3-2": ["GOL", "LD", "ZAG", "ZAG2", "ZAG3", "LE", "VOL", "MC", "MEI", "CA", "CA2"],
  "4-5-1": ["GOL", "LD", "ZAG", "ZAG2", "LE", "VOL", "MC", "MEI", "MEI2", "MEI3", "CA"],
  "3-4-3": ["GOL", "ZAG", "ZAG2", "ZAG3", "ALA", "ALA2", "MC", "MEI", "PE", "CA", "PD"],
};

export const posicoes = posicoesPorFormacao["4-3-3"];

export const posicaoBase = (posicao: string) => {
  if (posicao === "ZAG2" || posicao === "ZAG3") return "ZAG";
  if (posicao === "CA2") return "CA";
  if (posicao === "VOL2") return "VOL";
  if (posicao === "MEI2" || posicao === "MEI3") return "MEI";
  if (posicao === "ALA") return "LE";
  if (posicao === "ALA2") return "LD";
  return posicao;
};