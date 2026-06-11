"use client";

import { Jogador, posicaoBase } from "@/lib/data";

type Props = {
  escalacao: Record<string, Jogador | null>;
  posicaoSelecionada: string | null;
  onSelecionarPosicao: (posicao: string) => void;
  formacao: string;
  posicoesAtuais: string[];
};

const coordsPorFormacao: Record<string, Record<string, string>> = {
  "4-3-3": {
    GOL: "left-[50%] top-[88%]",
    LD: "left-[84%] top-[70%]",
    ZAG: "left-[38%] top-[70%]",
    ZAG2: "left-[62%] top-[70%]",
    LE: "left-[16%] top-[70%]",
    VOL: "left-[50%] top-[57%]",
    MC: "left-[30%] top-[45%]",
    MEI: "left-[70%] top-[41%]",
    PE: "left-[16%] top-[24%]",
    CA: "left-[50%] top-[18%]",
    PD: "left-[84%] top-[24%]",
  },

  "4-4-2": {
    GOL: "left-[50%] top-[88%]",
    LD: "left-[84%] top-[70%]",
    ZAG: "left-[38%] top-[70%]",
    ZAG2: "left-[62%] top-[70%]",
    LE: "left-[16%] top-[70%]",
    VOL: "left-[30%] top-[52%]",
    MC: "left-[70%] top-[52%]",
    MEI: "left-[18%] top-[40%]",
    MEI2: "left-[82%] top-[40%]",
    CA: "left-[40%] top-[20%]",
    CA2: "left-[60%] top-[20%]",
  },

  "4-2-3-1": {
    GOL: "left-[50%] top-[88%]",
    LD: "left-[84%] top-[70%]",
    ZAG: "left-[38%] top-[70%]",
    ZAG2: "left-[62%] top-[70%]",
    LE: "left-[16%] top-[70%]",
    VOL: "left-[38%] top-[55%]",
    VOL2: "left-[62%] top-[55%]",
    PE: "left-[18%] top-[38%]",
    MEI: "left-[50%] top-[38%]",
    PD: "left-[82%] top-[38%]",
    CA: "left-[50%] top-[20%]",
  },

  "4-2-4": {
    GOL: "left-[50%] top-[88%]",
    LD: "left-[84%] top-[70%]",
    ZAG: "left-[38%] top-[70%]",
    ZAG2: "left-[62%] top-[70%]",
    LE: "left-[16%] top-[70%]",
    VOL: "left-[38%] top-[54%]",
    MC: "left-[62%] top-[54%]",
    PE: "left-[14%] top-[25%]",
    CA: "left-[38%] top-[19%]",
    CA2: "left-[62%] top-[19%]",
    PD: "left-[86%] top-[25%]",
  },

  "3-5-2": {
    GOL: "left-[50%] top-[88%]",
    ZAG: "left-[28%] top-[70%]",
    ZAG2: "left-[50%] top-[72%]",
    ZAG3: "left-[72%] top-[70%]",
    ALA: "left-[14%] top-[52%]",
    ALA2: "left-[86%] top-[52%]",
    VOL: "left-[35%] top-[53%]",
    MC: "left-[65%] top-[53%]",
    MEI: "left-[50%] top-[40%]",
    CA: "left-[40%] top-[22%]",
    CA2: "left-[60%] top-[22%]",
  },

  "5-3-2": {
    GOL: "left-[50%] top-[88%]",
    LD: "left-[86%] top-[70%]",
    ZAG: "left-[34%] top-[70%]",
    ZAG2: "left-[50%] top-[72%]",
    ZAG3: "left-[66%] top-[70%]",
    LE: "left-[14%] top-[70%]",
    VOL: "left-[34%] top-[52%]",
    MC: "left-[50%] top-[45%]",
    MEI: "left-[66%] top-[52%]",
    CA: "left-[40%] top-[23%]",
    CA2: "left-[60%] top-[23%]",
  },

  "4-5-1": {
    GOL: "left-[50%] top-[88%]",
    LD: "left-[84%] top-[70%]",
    ZAG: "left-[38%] top-[70%]",
    ZAG2: "left-[62%] top-[70%]",
    LE: "left-[16%] top-[70%]",
    VOL: "left-[24%] top-[55%]",
    MC: "left-[42%] top-[55%]",
    MEI: "left-[60%] top-[55%]",
    MEI2: "left-[78%] top-[55%]",
    MEI3: "left-[50%] top-[42%]",
    CA: "left-[50%] top-[20%]",
  },

  "3-4-3": {
    GOL: "left-[50%] top-[88%]",
    ZAG: "left-[28%] top-[70%]",
    ZAG2: "left-[50%] top-[72%]",
    ZAG3: "left-[72%] top-[70%]",
    ALA: "left-[22%] top-[52%]",
    VOL: "left-[42%] top-[52%]",
    MC: "left-[58%] top-[52%]",
    ALA2: "left-[78%] top-[52%]",
    PE: "left-[18%] top-[24%]",
    CA: "left-[50%] top-[18%]",
    PD: "left-[82%] top-[24%]",
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
}: Props) {
  const coords = coordsPorFormacao[formacao] || coordsPorFormacao["4-3-3"];

  return (
    <div className="relative h-[560px] overflow-hidden rounded-[28px] bg-verdeCampo p-4 card-shadow md:h-[620px] md:p-5">
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

        return (
          <button
            key={pos}
            onClick={() => onSelecionarPosicao(pos)}
            className={`absolute ${coord} -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 px-1.5 py-1.5 text-center transition hover:scale-105 ${
              selecionado
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
              {jogador ? jogador.overall : "--"}
            </div>

            <div className="mt-2 max-w-[90px] truncate text-xs font-black">
              {jogador ? jogador.nome : "Vazio"}
            </div>

            <div className="max-w-[90px] truncate text-[10px] font-bold opacity-80">
              {jogador ? jogador.clube : labelLinha(pos)}
            </div>
          </button>
        );
      })}
    </div>
  );
}