"use client";

import { Jogador, posicaoBase, posicoes } from "@/lib/data";

type Props = {
  jogadores: Jogador[];
  escalacao: Record<string, Jogador | null>;
  onEscolher: (jogador: Jogador) => void;
};

const ordemPosicao = ["GOL", "LD", "ZAG", "LE", "VOL", "MC", "MEI", "PD", "PE", "CA"];

export default function ListaJogadores({ jogadores, escalacao, onEscolher }: Props) {
  function encaixa(jogador: Jogador) {
    return posicoes.some((slot) => {
      const base = posicaoBase(slot);
      return escalacao[slot] === null && jogador.posicoes.includes(base);
    });
  }

  const ordenados = [...jogadores].sort((a, b) => {
    const pa = ordemPosicao.indexOf(a.posicoes[0]);
    const pb = ordemPosicao.indexOf(b.posicoes[0]);
    return pa - pb || b.overall - a.overall;
  });

  return (
    <div className="rounded-[28px] bg-white p-5 card-shadow">
      <h2 className="text-2xl font-black text-vermelho">Jogadores do elenco</h2>

      <p className="mb-4 text-sm font-semibold text-stone-600">
        A lista aparece por posição. Jogadores sem posição livre ficam bloqueados.
      </p>

      <div className="grid max-h-[540px] gap-3 overflow-y-auto pr-2">
        {ordenados.map((jogador) => {
          const disponivel = encaixa(jogador);

          return (
            <button
              key={jogador.id}
              disabled={!disponivel}
              onClick={() => onEscolher(jogador)}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                disponivel
                  ? "border-stone-200 bg-creme hover:border-vermelho"
                  : "cursor-not-allowed border-stone-200 bg-stone-100 opacity-45"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-black">{jogador.nome}</div>

                  <div className="text-xs font-bold uppercase text-stone-600">
                    {jogador.clube} {jogador.ano} • {jogador.posicoes.join("/")}
                  </div>

                  <div className="mt-1 text-xs font-black uppercase text-vermelho">
                    {disponivel
                      ? `Encaixa em: ${jogador.posicoes.join("/")}`
                      : "Posição já preenchida"}
                  </div>
                </div>

                <div className="rounded-xl bg-vermelho px-3 py-2 text-lg font-black text-white">
                  {jogador.overall}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}