"use client";

import { Jogador, posicaoBase } from "@/lib/data";

type Props = {
  escalacao: Record<string, Jogador | null>;
  posicaoSelecionada: string | null;
  onSelecionarPosicao: (posicao: string) => void;
};

const coords: Record<string, string> = {
  GOL: "left-[50%] top-[86%]",
  LD: "left-[82%] top-[70%]",
  ZAG: "left-[39%] top-[70%]",
  ZAG2: "left-[61%] top-[70%]",
  LE: "left-[18%] top-[70%]",
  VOL: "left-[50%] top-[55%]",
  MC: "left-[34%] top-[43%]",
  MEI: "left-[66%] top-[40%]",
  PE: "left-[18%] top-[22%]",
  CA: "left-[50%] top-[17%]",
  PD: "left-[82%] top-[22%]",
};

export default function CampoTatico({
  escalacao,
  posicaoSelecionada,
  onSelecionarPosicao,
}: Props) {
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

      {Object.keys(coords).map((pos) => {
        const jogador = escalacao[pos];
        const selecionado = posicaoSelecionada === pos;

        return (
          <button
            key={pos}
            onClick={() => onSelecionarPosicao(pos)}
            className={`absolute ${coords[pos]} -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 px-2 py-2 text-center transition hover:scale-105 md:px-3 ${
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

            <div className="mt-2 max-w-[72px] truncate text-xs font-black md:max-w-[95px] md:text-sm">
              {jogador ? jogador.nome : "Vazio"}
            </div>

            <div className="max-w-[72px] truncate text-[10px] font-bold opacity-80 md:max-w-[95px]">
              {jogador ? jogador.clube : pos === "GOL" ? "Goleiro" : ["LD", "LE", "ZAG", "ZAG2"].includes(pos) ? "Defesa" : ["VOL", "MC", "MEI"].includes(pos) ? "Meio" : "Ataque"}
            </div>
          </button>
        );
      })}
    </div>
  );
}