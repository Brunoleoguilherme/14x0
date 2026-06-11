import Header from "@/components/Header";
import Link from "next/link";

const totalCampanhas = 197;
const totalJogadores = 2167;

export default function Home() {
  return (
    <main>
      <Header />

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-vermelho px-4 py-2 text-sm font-black uppercase text-white">
            Copa do Brasil Fantasy
          </div>

          <h1 className="text-7xl font-black leading-none tracking-tight text-vermelho md:text-9xl">
            14x0
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl font-bold text-stone-700 md:text-2xl">
            Monte um supertime com jogadores históricos da Copa do Brasil,
            sobreviva a 14 jogos de mata-mata e tente alcançar a campanha
            perfeita.
          </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/jogar"
              className="rounded-full bg-vermelho px-10 py-5 text-xl font-black uppercase text-white card-shadow transition hover:scale-[1.03]"
            >
              🎲 Jogar Agora
            </Link>

                      </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[32px] bg-white p-8 card-shadow">
            <div className="mb-4 text-5xl">🎲</div>

            <h3 className="text-2xl font-black text-vermelho">
              Sorteie Campanhas
            </h3>

            <p className="mt-3 font-semibold text-stone-600">
              A roleta sorteia campanhas históricas da Copa do Brasil. Cada
              campanha libera um elenco diferente para você escolher.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 card-shadow">
            <div className="mb-4 text-5xl">⚽</div>

            <h3 className="text-2xl font-black text-vermelho">
              Monte seu Time
            </h3>

            <p className="mt-3 font-semibold text-stone-600">
              Escolha apenas um jogador por campanha e complete sua escalação
              com 11 titulares históricos.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 card-shadow">
            <div className="mb-4 text-5xl">🏆</div>

            <h3 className="text-2xl font-black text-vermelho">
              Viva o Mata-Mata
            </h3>

            <p className="mt-3 font-semibold text-stone-600">
              Revele cada partida individualmente. Em caso de empate no
              agregado, dispute os pênaltis cobrança por cobrança.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}