"use client";

import Header from "@/components/Header";
import { Jogador } from "@/lib/data";
import { useEffect, useRef, useState } from "react";

export default function CardPage() {
  const [time, setTime] = useState<Record<string, Jogador | null>>({});
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const salvo = localStorage.getItem("time_14a0");
    if (salvo) setTime(JSON.parse(salvo));
  }, []);

  const jogadores = Object.entries(time).filter(([, j]) => j) as [
    string,
    Jogador
  ][];

  function compartilharLink() {
    navigator.clipboard.writeText("https://14a0.com.br");
    alert("Link copiado!");
  }

  function jogarDeNovo() {
    localStorage.removeItem("time_14a0");
    window.location.href = "/jogar";
  }

  function iniciarCampanha() {
    window.location.href = "/campanha";
  }

  return (
    <main>
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="mb-8 text-center text-5xl font-black text-vermelho">
          Meu 14x0
        </h1>

        <div
          ref={cardRef}
          className="mx-auto max-w-xl rounded-[32px] border-4 border-ouro bg-white p-8 card-shadow"
        >
          <div className="text-xs font-black uppercase tracking-[0.35em] text-stone-500">
            Time montado
          </div>

          <h2 className="mt-2 text-5xl font-black text-vermelho">14x0</h2>

          <div className="mt-6 grid gap-3">
            {jogadores.map(([pos, jogador], index) => (
              <div
                key={`${pos}-${jogador.id}`}
                className="flex items-center justify-between rounded-2xl border-2 border-stone-200 bg-creme px-4 py-3"
              >
                <div>
                  <div className="text-xs font-black text-stone-500">
                    {index + 1} • {pos}
                  </div>
                  <div className="text-lg font-black">{jogador.nome}</div>
                  <div className="text-xs font-bold uppercase text-stone-600">
                    {jogador.clube} {jogador.ano}
                  </div>
                </div>

                <div className="rounded-xl bg-vermelho px-3 py-2 text-lg font-black text-white">
                  {jogador.overall}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t-2 border-stone-200 pt-4 text-center text-sm font-black text-stone-500">
            14a0.com.br • monte o seu
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={iniciarCampanha}
            className="rounded-full bg-vermelho px-8 py-4 font-black uppercase text-white card-shadow"
          >
            Iniciar campanha
          </button>

          <button
            onClick={compartilharLink}
            className="rounded-full border-2 border-black px-8 py-4 font-black uppercase text-black"
          >
            Compartilhar link
          </button>

          <button
            onClick={jogarDeNovo}
            className="rounded-full border-2 border-black px-8 py-4 font-black uppercase text-black"
          >
            Jogar de novo
          </button>
        </div>
      </section>
    </main>
  );
}