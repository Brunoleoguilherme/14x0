"use client";

import { Jogador, jogadorEncaixaNoSlot, posicaoBase } from "@/lib/data";

type Props = {
  escalacao: Record<string, Jogador | null>;
  posicaoSelecionada: string | null;
  onSelecionarPosicao: (posicao: string) => void;
  formacao: string;
  posicoesAtuais: string[];
  jogadorPendente?: Jogador | null;
  onConfirmarSlot?: (slot: string) => void;
};

const coordsPorFormacao: Record<string, Record<string, string>> = {
  "4-3-3": {
    GOL: "left-[50%] top-[91%]",
    LD: "left-[86%] top-[73%]",
    ZAG: "left-[37%] top-[75%]",
    ZAG2: "left-[63%] top-[75%]",
    LE: "left-[14%] top-[73%]",
    VOL: "left-[50%] top-[61%]",
    MC: "left-[28%] top-[48%]",
    MEI: "left-[72%] top-[45%]",
    PE: "left-[13%] top-[27%]",
    CA: "left-[50%] top-[17%]",
    PD: "left-[87%] top-[27%]",
  },

  "4-4-2": {
    GOL: "left-[50%] top-[91%]",
    LD: "left-[86%] top-[73%]",
    ZAG: "left-[37%] top-[75%]",
    ZAG2: "left-[63%] top-[75%]",
    LE: "left-[14%] top-[73%]",
    VOL: "left-[25%] top-[55%]",
    MC: "left-[75%] top-[55%]",
    MEI: "left-[18%] top-[39%]",
    MEI2: "left-[82%] top-[39%]",
    CA: "left-[38%] top-[20%]",
    CA2: "left-[62%] top-[20%]",
  },

  "4-2-3-1": {
    GOL: "left-[50%] top-[91%]",
    LD: "left-[86%] top-[73%]",
    ZAG: "left-[37%] top-[75%]",
    ZAG2: "left-[63%] top-[75%]",
    LE: "left-[14%] top-[73%]",
    VOL: "left-[35%] top-[59%]",
    VOL2: "left-[65%] top-[59%]",
    PE: "left-[13%] top-[39%]",
    MEI: "left-[50%] top-[38%]",
    PD: "left-[87%] top-[39%]",
    CA: "left-[50%] top-[18%]",
  },

  "4-2-4": {
    GOL: "left-[50%] top-[91%]",
    LD: "left-[86%] top-[73%]",
    ZAG: "left-[37%] top-[75%]",
    ZAG2: "left-[63%] top-[75%]",
    LE: "left-[14%] top-[73%]",
    VOL: "left-[35%] top-[58%]",
    MC: "left-[65%] top-[58%]",
    PE: "left-[10%] top-[29%]",
    CA: "left-[36%] top-[18%]",
    CA2: "left-[64%] top-[18%]",
    PD: "left-[90%] top-[29%]",
  },

  "3-5-2": {
    GOL: "left-[50%] top-[91%]",
    ZAG: "left-[25%] top-[75%]",
    ZAG2: "left-[50%] top-[77%]",
    ZAG3: "left-[75%] top-[75%]",
    ALA: "left-[10%] top-[55%]",
    ALA2: "left-[90%] top-[55%]",
    VOL: "left-[34%] top-[58%]",
    MC: "left-[66%] top-[58%]",
    MEI: "left-[50%] top-[42%]",
    CA: "left-[38%] top-[21%]",
    CA2: "left-[62%] top-[21%]",
  },

  "5-3-2": {
    GOL: "left-[50%] top-[91%]",
    LD: "left-[90%] top-[74%]",
    ZAG: "left-[30%] top-[75%]",
    ZAG2: "left-[50%] top-[78%]",
    ZAG3: "left-[70%] top-[75%]",
    LE: "left-[10%] top-[74%]",
    VOL: "left-[30%] top-[55%]",
    MC: "left-[50%] top-[47%]",
    MEI: "left-[70%] top-[55%]",
    CA: "left-[38%] top-[22%]",
    CA2: "left-[62%] top-[22%]",
  },

  "4-5-1": {
    GOL: "left-[50%] top-[91%]",
    LD: "left-[86%] top-[73%]",
    ZAG: "left-[37%] top-[75%]",
    ZAG2: "left-[63%] top-[75%]",
    LE: "left-[14%] top-[73%]",
    VOL: "left-[18%] top-[57%]",
    MC: "left-[38%] top-[57%]",
    MEI: "left-[62%] top-[57%]",
    MEI2: "left-[82%] top-[57%]",
    MEI3: "left-[50%] top-[41%]",
    CA: "left-[50%] top-[19%]",
  },

  "3-4-3": {
    GOL: "left-[50%] top-[91%]",
    ZAG: "left-[25%] top-[75%]",
    ZAG2: "left-[50%] top-[77%]",
    ZAG3: "left-[75%] top-[75%]",
    ALA: "left-[16%] top-[55%]",
    VOL: "left-[38%] top-[57%]",
    MC: "left-[62%] top-[57%]",
    ALA2: "left-[84%] top-[55%]",
    PE: "left-[13%] top-[27%]",
    CA: "left-[50%] top-[17%]",
    PD: "left-[87%] top-[27%]",
  },
};

function labelLinha(pos: string) {
  const base = posicaoBase(pos);
  if (base === "GOL") return "Goleiro";
  if (["LD", "LE", "ZAG"].includes(base)) return "Defesa";
  if (["VOL", "MC", "MEI"].includes(base)) return "Meio";
  return "Ataque";
}

export default function CampoTatico({
  escalacao,
  posicaoSelecionada,
  onSelecionarPosicao,
  formacao,
  posicoesAtuais,
  jogadorPendente,
  onConfirmarSlot,
}: Props) {
  const coords = coordsPorFormacao[formacao] || coordsPorFormacao["4-3-3"];

  return (
    <div className="relative h-[680px] overflow-hidden rounded-[28px] bg-verdeCampo p-4 card-shadow md:h-[620px] md:p-5">
      <div className="absolute inset-4 rounded-[22px] pitch-line md:inset-5" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full pitch-line md:h-28 md:w-28" />
      <div className="absolute left-4 right-4 top-1/2 border-t-2 border-white/50 md:left-5 md:right-5" />

      <div className="absolute left-5 top-5 rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase text-white">
        Ataque
      </div>
      <div className="absolute left-5 top-1/2 rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase text-white">
        Meio
      </div>
      <div className="absolute bottom-5 left-5 rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase text-white">
        Defesa
      </div>

      {posicoesAtuais.map((pos) => {
        const jogador = escalacao[pos];
        const selecionado = posicaoSelecionada === pos;
        const coord = coords[pos] || "left-[50%] top-[50%]";
        const podeReceber =
          !!jogadorPendente &&
          !jogador &&
          jogadorEncaixaNoSlot(jogadorPendente.posicoes, pos);

        return (
          <button
            key={pos}
            onClick={() => {
              if (podeReceber && onConfirmarSlot) {
                onConfirmarSlot(pos);
                return;
              }
              onSelecionarPosicao(pos);
            }}
            className={`absolute ${coord} w-[76px] -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 px-1 py-1 text-center transition hover:scale-105 md:w-[92px] ${
              podeReceber
                ? "border-ouro bg-ouro text-black animate-pulse"
                : selecionado
                ? "border-ouro bg-ouro text-black"
                : jogador
                ? "border-white bg-white text-verdeEscuro"
                : "border-white bg-white/80 text-verdeEscuro"
            }`}
          >
            <div className="absolute -left-2 -top-2 rounded-full bg-verdeEscuro px-2 py-1 text-[10px] font-black text-white">
              {posicaoBase(pos)}
            </div>

            <div className="absolute -right-2 -top-2 rounded-full bg-vermelho px-2 py-1 text-[10px] font-black text-white">
              {jogador ? jogador.overall : podeReceber ? "+" : "--"}
            </div>

            <div className="mt-2 max-w-[78px] truncate text-[11px] font-black md:max-w-[88px]">
              {jogador ? jogador.nome : podeReceber ? "Escolher" : "Vazio"}
            </div>

            <div className="max-w-[78px] truncate text-[9px] font-bold opacity-80 md:max-w-[88px]">
              {jogador ? jogador.clube : labelLinha(pos)}
            </div>
          </button>
        );
      })}
    </div>
  );
}