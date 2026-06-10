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

export const posicoes = [
  "GOL",
  "LD",
  "ZAG",
  "ZAG2",
  "LE",
  "VOL",
  "MC",
  "MEI",
  "PD",
  "CA",
  "PE",
];

export const posicaoBase = (posicao: string) =>
  posicao === "ZAG2" ? "ZAG" : posicao;