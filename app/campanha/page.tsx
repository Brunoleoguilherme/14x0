"use client";

import Header from "@/components/Header";
import { Jogador } from "@/lib/data";
import { useEffect, useMemo, useState } from "react";

type Jogo = {
  fase: string;
  adversario: string;
  golsPro: number;
  golsContra: number;
  eventos: string[];
};

const adversarios = [
  "Paysandu",
  "Bahia",
  "Coritiba",
  "Vasco",
  "São Paulo",
  "Palmeiras",
  "Flamengo",
  "Grêmio",
  "Cruzeiro",
  "Santos",
  "Sport",
  "Ceará",
];

const fases = [
  "1ª fase - ida",
  "1ª fase - volta",
  "2ª fase - ida",
  "2ª fase - volta",
  "3ª fase - ida",
  "3ª fase - volta",
  "Oitavas - ida",
  "Oitavas - volta",
  "Quartas - ida",
  "Quartas - volta",
  "Semifinal - ida",
  "Semifinal - volta",
  "Final - ida",
  "Final - volta",
];

const velocidades: Record<string, number> = {
  Lento: 1600,
  Normal: 900,
  Rápido: 450,
  "Ultra rápido": 180,
};

function sortear(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarJogos(jogadores: Jogador[]) {
  const overall = Math.round(
    jogadores.reduce((s, j) => s + j.overall, 0) / jogadores.length
  );

  return fases.map((fase, index) => {
    const adv = adversarios[index % adversarios.length];
    const dificuldade = 70 + Math.floor(index / 2) * 2;

    const golsPro = Math.max(0, Math.floor((overall - dificuldade) / 8) + sortear(0, 2));
    const golsContra = Math.max(0, Math.floor((dificuldade - overall + 12) / 12) + sortear(0, 1));

    const eventos = [
      `${sortear(8, 18)}' Jogo estudado no meio-campo`,
      `${sortear(20, 35)}' Boa chegada do 14x0 FC`,
      ...Array.from({ length: golsPro }, () => {
        const j = jogadores[sortear(0, jogadores.length - 1)];
        return `${sortear(10, 88)}' ⚽ GOL DO 14x0 FC - ${j.nome}`;
      }),
      ...Array.from({ length: golsContra }, () => {
        return `${sortear(10, 88)}' ⚽ Gol do ${adv}`;
      }),
      "90' Fim de jogo",
    ].sort((a, b) => Number(a.split("'")[0]) - Number(b.split("'")[0]));

    return {
      fase,
      adversario: adv,
      golsPro,
      golsContra,
      eventos,
    };
  });
}

export default function CampanhaPage() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [jogoAtual, setJogoAtual] = useState(0);
  const [eventosRevelados, setEventosRevelados] = useState(0);
  const [simulando, setSimulando] = useState(false);
  const [velocidade, setVelocidade] = useState("Normal");

  useEffect(() => {
    const salvo = localStorage.getItem("time_14a0");
    if (!salvo) {
      window.location.href = "/jogar";
      return;
    }

    const time = JSON.parse(salvo) as Record<string, Jogador | null>;
    setJogadores(Object.values(time).filter(Boolean) as Jogador[]);
  }, []);

  const jogos = useMemo(() => {
    if (jogadores.length < 11) return [];
    return gerarJogos(jogadores);
  }, [jogadores]);

  const visiveis = jogos.slice(0, jogoAtual);
  const jogo = jogos[jogoAtual];

  const gp = visiveis.reduce((s, j) => s + j.golsPro, 0);
  const gc = visiveis.reduce((s, j) => s + j.golsContra, 0);
  const v = visiveis.filter((j) => j.golsPro > j.golsContra).length;
  const e = visiveis.filter((j) => j.golsPro === j.golsContra).length;
  const d = visiveis.filter((j) => j.golsPro < j.golsContra).length;

  function revelarDireto() {
    if (!jogo || simulando) return;
    setJogoAtual((p) => p + 1);
    setEventosRevelados(0);
  }

  function simularJogo() {
    if (!jogo || simulando) return;

    setSimulando(true);
    setEventosRevelados(0);

    let i = 0;
    const intervalo = window.setInterval(() => {
      i++;
      setEventosRevelados(i);

      if (i >= jogo.eventos.length) {
        window.clearInterval(intervalo);
        window.setTimeout(() => {
          setJogoAtual((p) => p + 1);
          setEventosRevelados(0);
          setSimulando(false);
        }, 500);
      }
    }, velocidades[velocidade]);
  }

  function jogarDeNovo() {
    localStorage.removeItem("time_14a0");
    window.location.href = "/jogar";
  }

  const acabou = jogoAtual >= jogos.length;

  return (
    <main>
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-4 border-black pb-6">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.35em] text-stone-500">
              A campanha
            </div>
            <h1 className="text-5xl font-black text-verdeEscuro">
              14x0 FC
            </h1>
            <p className="mt-2 font-bold text-stone-600">
              Campanha atual: {v}V • {e}E • {d}D
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={velocidade}
              onChange={(e) => setVelocidade(e.target.value)}
              className="rounded-xl border-2 border-black bg-white px-4 py-3 font-black"
            >
              {Object.keys(velocidades).map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>

            <button
              onClick={simularJogo}
              disabled={simulando || acabou}
              className="rounded-xl bg-black px-5 py-3 font-black uppercase text-white disabled:opacity-50"
            >
              Automático
            </button>

            <button
              onClick={revelarDireto}
              disabled={simulando || acabou}
              className="rounded-xl border-2 border-black px-5 py-3 font-black uppercase"
            >
              Jogo a jogo
            </button>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 card-shadow">
          <div className="mb-4 flex justify-between">
            <div className="font-black uppercase tracking-[0.25em] text-stone-500">
              {jogo ? jogo.fase : "Fim"}
            </div>

            <div className="rounded-xl bg-ouro px-5 py-3 font-black text-black">
              {gp} GP / {gc} GC
            </div>
          </div>

          {jogo && (
            <>
              <div className="mb-4 text-3xl font-black">
                14x0 FC x {jogo.adversario}
              </div>

              <div className="grid gap-3">
                {jogo.eventos.slice(0, eventosRevelados).map((ev, i) => (
                  <div key={i} className="rounded-xl bg-creme p-4 font-black">
                    {ev}
                  </div>
                ))}
              </div>
            </>
          )}

          {acabou && (
            <div className="text-center">
              <h2 className="text-4xl font-black text-vermelho">
                Campanha encerrada
              </h2>
              <p className="mt-3 text-xl font-bold">
                Resultado: {v} vitórias, {e} empates e {d} derrotas.
              </p>

              <button
                onClick={jogarDeNovo}
                className="mt-6 rounded-full bg-vermelho px-8 py-4 font-black uppercase text-white"
              >
                Jogar de novo
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}