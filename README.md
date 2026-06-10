# 14x0 - Copa do Brasil

MVP correto do jogo 14x0, focado na Copa do Brasil.

## Conceito

O jogador monta um supertime misturando atletas históricos campeões da Copa do Brasil e tenta conquistar a campanha perfeita: 14x0.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra:

```bash
http://localhost:3000
```

## Supabase

Projeto informado:

```txt
https://akiuxvanlhkikjadaazt.supabase.co
```

1. Copie `.env.example` para `.env.local`.
2. Cole sua chave pública anon/publishable.
3. No Supabase SQL Editor, rode o arquivo:

```txt
supabase/schema.sql
```

## Subir para GitHub/Vercel

```bash
git init
git add .
git commit -m "MVP 14x0 Copa do Brasil"
git branch -M main
git remote add origin SEU_REPOSITORIO
git push -u origin main
```

Depois conecte o repositório na Vercel e cadastre as variáveis de ambiente.

## Próximos passos

- Conectar jogadores ao Supabase real.
- Criar página admin para cadastro de campanhas.
- Salvar simulação no ranking real.
- Gerar card compartilhável.
- Expandir base histórica com campeões da Copa do Brasil.
