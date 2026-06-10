import Header from '@/components/Header'

const ranking = [
  { nome: 'Bruno', pontos: 9800, campanha: '14x0 perfeito' },
  { nome: 'Rafael', pontos: 9320, campanha: 'Campeão invicto' },
  { nome: 'Sofia', pontos: 9100, campanha: 'Ataque histórico' }
]

export default function RankingPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-4xl px-5 py-12">
        <h1 className="mb-6 text-5xl font-black text-vermelho">Ranking 14x0</h1>
        <div className="rounded-[28px] bg-white p-5 card-shadow">
          {ranking.map((item, index) => (
            <div key={item.nome} className="flex items-center justify-between border-b border-stone-200 py-5 last:border-0">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vermelho text-xl font-black text-white">{index + 1}</div>
                <div>
                  <div className="text-xl font-black">{item.nome}</div>
                  <div className="font-semibold text-stone-500">{item.campanha}</div>
                </div>
              </div>
              <div className="text-2xl font-black text-vermelho">{item.pontos}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
