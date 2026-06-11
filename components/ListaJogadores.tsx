"use client";

import { Jogador, jogadorEncaixaNoSlot, posicaoBase } from "@/lib/data";

type Props = {
  jogadores: Jogador[];
  escalacao: Record<string, Jogador | null>;
  onEscolher: (jogador: Jogador) => void;
  modo: string;
  posicoesAtuais: string[];
};

const ordemPosicao = [
  "GOL",
  "LD",
  "ZAG",
  "LE",
  "ALA",
  "ALA2",
  "VOL",
  "MC",
  "MEI",
  "PD",
  "PE",
  "CA",
];

export default function ListaJogadores({
  jogadores,
  escalacao,
  onEscolher,
  modo,
  posicoesAtuais,
}: Props) {
  const modoLenda = modo === "Lenda";

  function encaixa(jogador: Jogador) {
  return posicoesAtuais.some((slot) => {
    return escalacao[slot] === null && jogadorEncaixaNoSlot(jogador.posicoes, slot);
  });
}

  function encaixesDisponiveis(jogador: Jogador) {
  return posicoesAtuais
    .filter((slot) => {
      return escalacao[slot] === null && jogadorEncaixaNoSlot(jogador.posicoes, slot);
    })
    .map((slot) => posicaoBase(slot));
}

  const ordenados = [...jogadores].sort((a, b) => {
    const pa = ordemPosicao.indexOf(a.posicoes[0]);
    const pb = ordemPosicao.indexOf(b.posicoes[0]);

    const posA = pa === -1 ? 99 : pa;
    const posB = pb === -1 ? 99 : pb;

    return posA - posB || b.overall - a.overall;
  });

  return (
    <div className="rounded-[28px] bg-white p-5 card-shadow">
      <h2 className="text-2xl font-black text-vermelho">
        Jogadores do elenco
      </h2>

      <p className="mb-4 text-sm font-semibold text-stone-600">
        {modoLenda
          ? "Modo Lenda: escolha pelo nome, clube e posição. Overall oculto."
          : "A lista aparece por posição. Jogadores sem posição livre ficam bloqueados."}
      </p>

      <div className="grid max-h-[540px] gap-3 overflow-y-auto pr-2">
        {ordenados.map((jogador) => {
          const disponivel = encaixa(jogador);
          const encaixes = encaixesDisponiveis(jogador);

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
                    {jogador.clube} {jogador.ano} •{" "}
                    {jogador.posicoes.join("/")}
                  </div>

                  <div className="mt-1 text-xs font-black uppercase text-vermelho">
                    {disponivel
                      ? `Encaixa em: ${encaixes.join("/")}`
                      : "Posição já preenchida"}
                  </div>
                </div>

                {!modoLenda && (
                  <div className="rounded-xl bg-vermelho px-3 py-2 text-lg font-black text-white">
                    {jogador.overall}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}