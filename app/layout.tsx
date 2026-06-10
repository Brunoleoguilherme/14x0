import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '14x0 - Copa do Brasil',
  description: 'Monte seu supertime histórico da Copa do Brasil e tente fazer 14x0.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
