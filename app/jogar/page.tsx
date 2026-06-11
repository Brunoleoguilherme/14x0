"use client";

import Header from "@/components/Header";
import CampoTatico from "@/components/CampoTatico";
import ListaJogadores from "@/components/ListaJogadores";
import ResultadoSimulacao from "@/components/ResultadoSimulacao";
import ConfiguracaoJogo from "@/components/ConfiguracaoJogo";
import {
  Jogador,
  jogadorEncaixaNoSlot,
  posicoesPorFormacao,
} from "@/lib/data";
import { useMemo, useRef, useState } from "react";

type ApiCampanha = {
  campanha_id: number;
  clube: string;
  ano: number;
  forca: number;
  dificuldade: string;
  tipo: string;
  peso: number;
  jogadores: number;
};

type ApiJogador = {
  id: number;
  campanha_id: number;
  clube: string;
  ano: number;
  nome: string;
  posicao: string;
  overall: number;
};

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function JogarPage() {
  const [formacao, setFormacao] = useState("4-3-3");
  const [estilo, setEstilo] = useState("Equilibrado");
  const [modo, setModo] = useState("Clássico");

  const posicoesAtuais = useMemo(() => {
    return posicoesPorFormacao[formacao] || posicoesPorFormacao["4-3-3"];
  }, [formacao]);

  const initial = useMemo(
    () =>
      Object.fromEntries(posicoesAtuais.map((p) => [p, null])) as Record<
        string,
        Jogador | null
      >,
    [posicoesAtuais]
  );

  const [escalacao, setEscalacao] =
    useState<Record<string, Jogador | null>>(initial);

  const [posicaoSelecionada, setPosicaoSelecionada] = useState<string | null>(
    "GOL"
  );

  const [campanhaAtual, setCampanhaAtual] = useState<ApiCampanha | null>(null);
  const [jogadoresDoElenco, setJogadoresDoElenco] = useState<Jogador[]>([]);
  const [rolando, setRolando] = useState(false);
  const [podeEscolher, setPodeEscolher] = useState(false);
  const [historico, setHistorico] = useState<ApiCampanha[]>([]);
  const [campanhasUsadas, setCampanhasUsadas] = useState<number[]>([]);

  const rolagemId = useRef(0);

  const preenchidos = posicoesAtuais.filter((p) => escalacao[p]).length;
  const completo = preenchidos === 11;
  const progresso = Math.round((preenchidos / 11) * 100);

  const overallMedio =
    preenchidos > 0
      ? Math.round(
          posicoesAtuais
            .map((p) => escalacao[p])
            .filter(Boolean)
            .reduce((soma, jogador) => soma + (jogador?.overall || 0), 0) /
            preenchidos
        )
      : 0;

  function converterJogador(j: ApiJogador): Jogador {
    return {
      id: j.id,
      campanhaId: j.campanha_id,
      nome: j.nome,
      clube: j.clube,
      ano: j.ano,
      posicoes: [j.posicao],
      overall: j.overall,
      ataque: j.overall,
      defesa: j.overall,
    };
  }

  async function buscarCampanhaAleatoria(usados: number[]) {
    const params = usados.length > 0 ? `?usados=${usados.join(",")}` : "";

    const res = await fetch(`/api/roleta${params}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Erro ao sortear campanha");
    }

    return (await res.json()) as ApiCampanha;
  }

  async function buscarJogadores(campanhaId: number) {
    const res = await fetch(`/api/campanha/${campanhaId}`, {
      cache: "no-store",
    });

    const data: ApiJogador[] = await res.json();
    setJogadoresDoElenco(data.map(converterJogador));
  }

  async function rolarCampanha() {
    if (rolando || completo || podeEscolher) return;

    const idAtual = rolagemId.current + 1;
    rolagemId.current = idAtual;

    setRolando(true);
    setPodeEscolher(false);
    setJogadoresDoElenco([]);

    const usadosAgora = [...campanhasUsadas];

    try {
      let final: ApiCampanha | null = null;

      for (let i = 0; i < 5; i++) {
        if (rolagemId.current !== idAtual) return;

        const campanha = await buscarCampanhaAleatoria(usadosAgora);

        if (rolagemId.current !== idAtual) return;

        setCampanhaAtual(campanha);
        final = campanha;

        await esperar(70);
      }

      if (!final || rolagemId.current !== idAtual) return;

      setCampanhaAtual(final);

      await buscarJogadores(final.campanha_id);

      setHistorico((prev) => [final!, ...prev].slice(0, 8));

      setCampanhasUsadas((prev) =>
        prev.includes(final!.campanha_id)
          ? prev
          : [...prev, final!.campanha_id]
      );

      setPodeEscolher(true);
    } catch (error) {
      console.error(error);
    } finally {
      if (rolagemId.current === idAtual) {
        setRolando(false);
      }
    }
  }

  function encontrarSlotLivre(jogador: Jogador) {
  if (
    posicaoSelecionada &&
    escalacao[posicaoSelecionada] === null &&
    jogadorEncaixaNoSlot(jogador.posicoes, posicaoSelecionada)
  ) {
    return posicaoSelecionada;
  }

  return posicoesAtuais.find((slot) => {
    return escalacao[slot] === null && jogadorEncaixaNoSlot(jogador.posicoes, slot);
  });
}

  function escolher(jogador: Jogador) {
    if (!podeEscolher || rolando) return;

    const slot = encontrarSlotLivre(jogador);
    if (!slot) return;

    const novaEscalacao = {
      ...escalacao,
      [slot]: jogador,
    };

    setEscalacao(novaEscalacao);

    const proximaVazia = posicoesAtuais.find((p) => novaEscalacao[p] === null);
    setPosicaoSelecionada(proximaVazia || null);

    setPodeEscolher(false);
    setJogadoresDoElenco([]);
  }

  function limpar() {
    setEscalacao(initial);
    setPosicaoSelecionada("GOL");
    setCampanhaAtual(null);
    setJogadoresDoElenco([]);
    setPodeEscolher(false);
    setHistorico([]);
    setCampanhasUsadas([]);
  }

  function trocarFormacao(novaFormacao: string) {
    setFormacao(novaFormacao);
    setEscalacao(
      Object.fromEntries(
        (posicoesPorFormacao[novaFormacao] || posicoesPorFormacao["4-3-3"]).map(
          (p) => [p, null]
        )
      ) as Record<string, Jogador | null>
    );
    setPosicaoSelecionada("GOL");
    setCampanhaAtual(null);
    setJogadoresDoElenco([]);
    setPodeEscolher(false);
    setHistorico([]);
    setCampanhasUsadas([]);
  }

  return (
    <main>
      <Header />

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 rounded-[32px] bg-white p-6 card-shadow">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-creme px-4 py-2 text-xs font-black uppercase text-vermelho">
                Draft Copa do Brasil
              </div>

              <h1 className="text-4xl font-black text-vermelho">
                Monte seu 14x0
              </h1>

              <p className="font-bold text-stone-600">
                Role um elenco histórico, escolha 1 jogador e complete os 11
                titulares.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl bg-creme px-5 py-3 text-center">
                <div className="text-xs font-black uppercase text-stone-500">
                  Escalação
                </div>
                <div className="text-2xl font-black text-vermelho">
                  {preenchidos}/11
                </div>
              </div>

              <div className="rounded-2xl bg-creme px-5 py-3 text-center">
                <div className="text-xs font-black uppercase text-stone-500">
                  Overall
                </div>
                <div className="text-2xl font-black text-vermelho">
                  {overallMedio || "--"}
                </div>
              </div>

              <button
                onClick={limpar}
                className="rounded-2xl bg-vermelho px-5 py-3 font-black text-white"
              >
                Reiniciar
              </button>
            </div>
          </div>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-creme">
            <div
              className="h-full rounded-full bg-vermelho transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        <ConfiguracaoJogo
          formacao={formacao}
          estilo={estilo}
          modo={modo}
          onFormacao={trocarFormacao}
          onEstilo={setEstilo}
          onModo={setModo}
        />

        <div className="mb-6 rounded-[28px] bg-vermelho p-6 text-white card-shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-black uppercase opacity-80">
                {rolando
                  ? "Roletando elencos..."
                  : campanhaAtual
                  ? "Elenco sorteado"
                  : "Próximo elenco"}
              </div>

              <div className="text-3xl font-black">
                {campanhaAtual
                  ? `${campanhaAtual.clube} ${campanhaAtual.ano}`
                  : "Clique em rolar"}
              </div>

              <div className="font-bold opacity-90">
                {campanhaAtual
                  ? modo === "Lenda"
                    ? "Modo Lenda"
                    : `${campanhaAtual.dificuldade} • Força ${campanhaAtual.forca}`
                  : "Cada rodada libera um elenco histórico."}
              </div>
            </div>

            <button
              onClick={rolarCampanha}
              disabled={rolando || completo || podeEscolher}
              className="rounded-full bg-white px-8 py-4 text-lg font-black uppercase text-vermelho disabled:opacity-60"
            >
              {rolando
                ? "Rolando..."
                : podeEscolher
                ? "Escolha 1 jogador"
                : completo
                ? "Time completo"
                : "Rolar 🎲"}
            </button>
          </div>

          {historico.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {historico.map((campanha, index) => (
                <span
                  key={`${campanha.campanha_id}-${index}`}
                  className="rounded-full bg-white/20 px-3 py-1 text-xs font-black"
                >
                  {campanha.clube} {campanha.ano}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          {campanhaAtual && podeEscolher ? (
            <ListaJogadores
              jogadores={jogadoresDoElenco}
              escalacao={escalacao}
              onEscolher={escolher}
              modo={modo}
              posicoesAtuais={posicoesAtuais}
            />
          ) : (
            <div className="flex min-h-[360px] items-center justify-center rounded-[28px] bg-white p-6 text-center card-shadow">
              <div>
                <div className="mb-3 text-5xl">🎲</div>
                <h2 className="text-2xl font-black text-vermelho">
                  {rolando ? "Roletando..." : "Role um elenco"}
                </h2>
                <p className="mt-2 max-w-sm font-bold text-stone-600">
                  O sistema vai sortear uma campanha histórica da Copa do
                  Brasil. Depois você escolhe 1 jogador daquele elenco.
                </p>
              </div>
            </div>
          )}

          <CampoTatico
            escalacao={escalacao}
            posicaoSelecionada={posicaoSelecionada}
            onSelecionarPosicao={setPosicaoSelecionada}
            formacao={formacao}
            posicoesAtuais={posicoesAtuais}
          />
        </div>

        {completo ? (
          <ResultadoSimulacao escalacao={escalacao} />
        ) : (
          <div className="mt-6 rounded-[28px] bg-white p-6 text-center card-shadow">
            <h2 className="text-2xl font-black text-vermelho">
              Complete os 11 titulares
            </h2>
            <p className="mt-2 font-bold text-stone-600">
              Depois de completar o time, a simulação será liberada.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}