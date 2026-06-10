"use client";

import { useEffect, useState } from "react";
import { Jogador } from "@/lib/data";

type Props = { escalacao: Record<string, Jogador | null> };

type Penalti = {
  cobrador: string;
  nossoGol: boolean;
  adversarioGol: boolean;
};

type Jogo = {
  fase: string;
  jogo: string;
  adversario: string;
  golsPro: number;
  golsContra: number;
  eventos: string[];
};

type Simulacao = {
  jogos: Jogo[];
  overall: number;
  ataque: number;
  defesa: number;
  penaltisPorFase: Record<number, Penalti[]>;
};

const fases = [
  "1ª fase",
  "2ª fase",
  "3ª fase",
  "Oitavas",
  "Quartas",
  "Semifinal",
  "Final",
];

const adversarios = [
  "Paysandu",
  "Bahia",
  "Athletico-PR",
  "Vasco",
  "São Paulo",
  "Palmeiras",
  "Flamengo",
];

function sortear(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ordenarBatedores(jogadores: Jogador[]) {
  const ordem = ["CA", "MEI", "PD", "PE", "MC", "VOL", "LD", "LE", "ZAG", "GOL"];

  return [...jogadores].sort((a, b) => {
    const aIndex = Math.min(
      ...a.posicoes.map((p) => {
        const idx = ordem.indexOf(p);
        return idx === -1 ? 99 : idx;
      })
    );

    const bIndex = Math.min(
      ...b.posicoes.map((p) => {
        const idx = ordem.indexOf(p);
        return idx === -1 ? 99 : idx;
      })
    );

    return aIndex - bIndex || b.overall - a.overall;
  });
}

function gerarPenaltis(jogadores: Jogador[], overall: number): Penalti[] {
  const batedores = ordenarBatedores(jogadores);
  const penaltis: Penalti[] = [];

  let nossos = 0;
  let deles = 0;

  for (let i = 0; i < 5; i++) {
    const cobrador = batedores[i % batedores.length];

    const nossoGol = sortear(1, 100) <= Math.min(90, 62 + Math.round(overall / 4));
    const adversarioGol = sortear(1, 100) <= 74;

    if (nossoGol) nossos++;
    if (adversarioGol) deles++;

    penaltis.push({
      cobrador: cobrador.nome,
      nossoGol,
      adversarioGol,
    });
  }

  let i = 5;

  while (nossos === deles && i < 10) {
    const cobrador = batedores[i % batedores.length];

    const nossoGol = sortear(1, 100) <= Math.min(88, 60 + Math.round(overall / 4));
    const adversarioGol = sortear(1, 100) <= 74;

    if (nossoGol) nossos++;
    if (adversarioGol) deles++;

    penaltis.push({
      cobrador: cobrador.nome,
      nossoGol,
      adversarioGol,
    });

    i++;
  }

  return penaltis;
}

function gerarEventos(jogo: Jogo, jogadores: Jogador[]) {
  const atacantes = jogadores.filter((j) =>
    j.posicoes.some((p) => ["CA", "PE", "PD", "MEI", "MC"].includes(p))
  );

  const eventos: string[] = [];

  eventos.push(`${sortear(8, 25)}' Jogo estudado no meio-campo`);
  eventos.push(`${sortear(26, 44)}' Boa chegada do 14x0 FC`);

  for (let i = 0; i < jogo.golsPro; i++) {
    const jogador =
      atacantes[sortear(0, Math.max(0, atacantes.length - 1))] || jogadores[0];

    eventos.push(`${sortear(6, 89)}' ⚽ GOL DO 14x0 FC - ${jogador.nome}`);
  }

  for (let i = 0; i < jogo.golsContra; i++) {
    eventos.push(`${sortear(6, 89)}' ⚽ Gol do ${jogo.adversario}`);
  }

  eventos.push(`${sortear(55, 78)}' Defesa importante`);
  eventos.push("90' Fim de jogo");

  return eventos.sort(
    (a, b) => Number(a.split("'")[0]) - Number(b.split("'")[0])
  );
}

function gerarSimulacao(jogadores: Jogador[]): Simulacao {
  const overall = Math.round(
    jogadores.reduce((s, j) => s + j.overall, 0) / jogadores.length
  );

  const ataque = Math.round(
    jogadores.reduce((s, j) => s + j.ataque, 0) / jogadores.length
  );

  const defesa = Math.round(
    jogadores.reduce((s, j) => s + j.defesa, 0) / jogadores.length
  );

  const jogos: Jogo[] = [];

  fases.forEach((fase, faseIndex) => {
    const adversario = adversarios[faseIndex];

    for (let perna = 0; perna < 2; perna++) {
      const dificuldade = 76 + faseIndex * 3;

      let golsPro = Math.max(
        0,
        Math.floor((ataque - dificuldade) / 9) + sortear(0, 2)
      );

      let golsContra = Math.max(
        0,
        Math.floor((dificuldade - defesa + 12) / 11) + sortear(0, 1)
      );

      if (overall >= 92 && sortear(1, 100) <= 18) golsPro++;
      if (overall < 86 && sortear(1, 100) <= 24) golsContra++;

      const jogo: Jogo = {
        fase,
        jogo: perna === 0 ? "ida" : "volta",
        adversario,
        golsPro,
        golsContra,
        eventos: [],
      };

      jogo.eventos = gerarEventos(jogo, jogadores);
      jogos.push(jogo);
    }
  });

  const penaltisPorFase: Record<number, Penalti[]> = {};

  for (let i = 0; i < 7; i++) {
    const ida = jogos[i * 2];
    const volta = jogos[i * 2 + 1];

    const nossos = ida.golsPro + volta.golsPro;
    const deles = ida.golsContra + volta.golsContra;

    if (nossos === deles) {
      penaltisPorFase[i] = gerarPenaltis(jogadores, overall);
    }
  }

  return { jogos, overall, ataque, defesa, penaltisPorFase };
}

export default function ResultadoSimulacao({ escalacao }: Props) {
  const jogadores = Object.values(escalacao).filter(Boolean) as Jogador[];

  const [simulacao] = useState<Simulacao | null>(() => {
    if (jogadores.length < 11) return null;
    return gerarSimulacao(jogadores);
  });

  const [jogosRevelados, setJogosRevelados] = useState(0);
  const [eventosRevelados, setEventosRevelados] = useState(0);
  const [simulandoEventos, setSimulandoEventos] = useState(false);
  const [fasePenalti, setFasePenalti] = useState<number | null>(null);
  const [penaltisRevelados, setPenaltisRevelados] = useState(0);
  const [eliminado, setEliminado] = useState(false);
  const [classificadoPenaltis, setClassificadoPenaltis] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (fasePenalti === null || !simulacao) return;

    const lista = simulacao.penaltisPorFase[fasePenalti] || [];

    if (lista.length === 0) {
      setFasePenalti(null);
      setPenaltisRevelados(0);
      return;
    }

    if (penaltisRevelados >= lista.length) {
      const nossos = lista.filter((p) => p.nossoGol).length;
      const deles = lista.filter((p) => p.adversarioGol).length;

      const timer = window.setTimeout(() => {
        if (nossos < deles) {
          setEliminado(true);
          setClassificadoPenaltis(null);
        } else {
          setClassificadoPenaltis(`Classificado nos pênaltis: ${nossos} x ${deles}`);
        }

        setFasePenalti(null);
        setPenaltisRevelados(0);
      }, 1000);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setPenaltisRevelados((prev) => prev + 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [fasePenalti, penaltisRevelados, simulacao]);

  if (!simulacao) return null;

  const jogosVisiveis = simulacao.jogos.slice(0, jogosRevelados);
  const jogoAtual = simulacao.jogos[jogosRevelados];

  const golsPro = jogosVisiveis.reduce((s, j) => s + j.golsPro, 0);
  const golsContra = jogosVisiveis.reduce((s, j) => s + j.golsContra, 0);

  const vitorias = jogosVisiveis.filter((j) => j.golsPro > j.golsContra).length;
  const empates = jogosVisiveis.filter((j) => j.golsPro === j.golsContra).length;
  const derrotas = jogosVisiveis.filter((j) => j.golsPro < j.golsContra).length;

  function verificarClassificacao(novoTotal: number) {
    if (!simulacao) return;
    if (novoTotal % 2 !== 0) return;

    const faseIndex = novoTotal / 2 - 1;
    const ida = simulacao.jogos[faseIndex * 2];
    const volta = simulacao.jogos[faseIndex * 2 + 1];

    if (!ida || !volta) return;

    const nossos = ida.golsPro + volta.golsPro;
    const deles = ida.golsContra + volta.golsContra;

    if (nossos < deles) {
      setEliminado(true);
      return;
    }

    if (nossos === deles) {
      setFasePenalti(faseIndex);
      setPenaltisRevelados(0);
    }
  }

  function revelarDireto() {
    if (
      eliminado ||
      fasePenalti !== null ||
      jogosRevelados >= 14 ||
      simulandoEventos
    ) {
      return;
    }

    const novoTotal = jogosRevelados + 1;
    setJogosRevelados(novoTotal);
    setEventosRevelados(0);
    setClassificadoPenaltis(null);
    verificarClassificacao(novoTotal);
  }

  function simularMinutoAMinuto() {
    if (!jogoAtual || simulandoEventos || eliminado || fasePenalti !== null) return;

    setSimulandoEventos(true);
    setEventosRevelados(0);
    setClassificadoPenaltis(null);

    let i = 0;
    const total = jogoAtual.eventos.length;
    const intervaloMs = Math.max(650, Math.floor(9000 / Math.max(1, total)));

    const intervalo = window.setInterval(() => {
      i++;
      setEventosRevelados(i);

      if (i >= total) {
        window.clearInterval(intervalo);

        window.setTimeout(() => {
          const novoTotal = jogosRevelados + 1;
          setJogosRevelados(novoTotal);
          setEventosRevelados(0);
          setSimulandoEventos(false);
          verificarClassificacao(novoTotal);
        }, 700);
      }
    }, intervaloMs);
  }

  const penaltisAtuais =
    fasePenalti !== null && simulacao.penaltisPorFase[fasePenalti]
      ? simulacao.penaltisPorFase[fasePenalti]
      : [];

  const penaltisVisiveis = penaltisAtuais.slice(0, penaltisRevelados);

  const acabou = jogosRevelados >= 14 && !eliminado;

  return (
    <section className="mt-8 rounded-[28px] bg-verdeEscuro p-6 text-white card-shadow">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Simulação da campanha</h2>

          <p className="font-semibold text-white/75">
            Overall {simulacao.overall} • Ataque {simulacao.ataque} • Defesa{" "}
            {simulacao.defesa}
          </p>

          <p className="mt-1 font-bold text-white/70">
            Campanha atual: {vitorias}V • {empates}E • {derrotas}D
          </p>

          {classificadoPenaltis && (
            <p className="mt-2 font-black text-ouro">{classificadoPenaltis}</p>
          )}
        </div>

        <div className="rounded-2xl bg-ouro px-5 py-3 text-center font-black text-black">
          {golsPro} GP / {golsContra} GC
        </div>
      </div>

      {simulandoEventos && jogoAtual && (
        <div className="mt-5 rounded-2xl bg-white/10 p-5">
          <h3 className="text-xl font-black text-ouro">
            {jogoAtual.fase} - {jogoAtual.jogo} contra {jogoAtual.adversario}
          </h3>

          <div className="mt-4 grid gap-2">
            {jogoAtual.eventos.slice(0, eventosRevelados).map((evento, i) => (
              <div key={i} className="rounded-xl bg-black/20 p-3 font-bold">
                {evento}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {jogosVisiveis.map((jogo, index) => (
          <div
            key={`${jogo.fase}-${jogo.jogo}-${index}`}
            className="rounded-2xl bg-white/10 p-4"
          >
            <div className="text-xs font-black uppercase text-ouro">
              Jogo {index + 1} • {jogo.fase} - {jogo.jogo}
            </div>

            <div className="mt-1 text-lg font-black">
              14x0 FC {jogo.golsPro} x {jogo.golsContra} {jogo.adversario}
            </div>
          </div>
        ))}
      </div>

      {fasePenalti !== null && (
        <div className="mt-6 rounded-2xl bg-white/10 p-5">
          <h3 className="text-2xl font-black text-ouro">
            Disputa de pênaltis - {fases[fasePenalti]}
          </h3>

          <div className="mt-4 grid gap-3">
            {penaltisVisiveis.map((p, index) => (
              <div key={index} className="rounded-xl bg-black/20 p-3 font-bold">
                Cobrança {index + 1}: {p.cobrador}{" "}
                {p.nossoGol ? "✅ Gol" : "❌ Perdeu"} • Adversário{" "}
                {p.adversarioGol ? "✅ Gol" : "❌ Perdeu"}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-full bg-ouro px-6 py-3 text-center font-black uppercase text-black">
            Disputa em andamento...
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {!eliminado && !acabou && fasePenalti === null && !simulandoEventos && (
          <>
            <button
              onClick={simularMinutoAMinuto}
              className="rounded-full bg-ouro px-8 py-4 text-lg font-black uppercase text-black"
            >
              Simular minuto a minuto
            </button>

            <button
              onClick={revelarDireto}
              className="rounded-full bg-white px-8 py-4 text-lg font-black uppercase text-verdeEscuro"
            >
              Revelar jogo direto
            </button>
          </>
        )}

        {eliminado && (
          <div className="rounded-2xl bg-red-600 p-5 text-center">
            <h3 className="text-2xl font-black">Eliminado</h3>
            <p className="mt-2 font-bold">
              Sua campanha terminou com {vitorias} vitórias, {empates} empates e{" "}
              {derrotas} derrotas.
            </p>
          </div>
        )}

        {acabou && (
          <div className="rounded-2xl bg-white/10 p-5 text-center">
            <h3 className="text-2xl font-black text-ouro">Campanha encerrada</h3>
            <p className="mt-2 font-bold">
              Resultado final: {vitorias} vitórias, {empates} empates e{" "}
              {derrotas} derrotas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}