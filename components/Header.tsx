import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full border-b-4 border-vermelho bg-creme">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-3xl font-black tracking-tight text-vermelho">14x0</Link>
        <nav className="flex gap-3 text-sm font-bold uppercase">
          <Link href="/jogar" className="rounded-full bg-vermelho px-4 py-2 text-white">Jogar</Link>
          <Link href="/ranking" className="rounded-full border-2 border-vermelho px-4 py-2 text-vermelho">Ranking</Link>
        </nav>
      </div>
    </header>
  )
}
