import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ ranking: [] });
  const { data, error } = await supabaseAdmin
    .from('ranking_global')
    .select('*')
    .order('pontos', { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ranking: data || [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!supabaseAdmin) return NextResponse.json({ ok: true, offline: true });

  const payload = {
    nome_usuario: body.nome_usuario || 'Anônimo',
    campanha_base: body.campanha_base,
    pontos: body.pontos || 0,
    vitorias: body.vitorias || 0,
    gols_pro: body.gols_pro || 0,
    gols_contra: body.gols_contra || 0,
    saldo: body.saldo || 0,
    campeao: body.campeao || false,
    seed: body.seed
  };

  const { data, error } = await supabaseAdmin
    .from('ranking_global')
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
