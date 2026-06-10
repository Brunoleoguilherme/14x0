import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
    }

    const body = await request.json();
    const nome = String(body.nome_usuario || "Jogador").trim().slice(0, 40);
    const pontos = Number(body.pontos || 0);
    const golsPro = Number(body.gols_pro || 0);
    const golsContra = Number(body.gols_contra || 0);
    const vitorias = Number(body.vitorias || 0);
    const campeao = Boolean(body.campeao);
    const seed = String(body.seed || `14X0-${Date.now()}`);

    const { data: simulacao, error: simulacaoError } = await supabase
      .from("simulacoes")
      .insert({
        seed,
        formacao: body.formacao || "4-3-3",
        estilo: body.estilo || "Equilibrado",
        gols_pro: golsPro,
        gols_contra: golsContra,
        vitorias,
        campeao
      })
      .select("id")
      .single();

    if (simulacaoError) throw simulacaoError;

    const partidas = Array.isArray(body.partidas) ? body.partidas : [];
    if (partidas.length) {
      const rows = partidas.map((m: any) => ({
        simulacao_id: simulacao.id,
        fase: m.phase,
        adversario: m.opponent,
        adversario_bandeira: m.flag,
        adversario_ano: m.year,
        gols_pro: m.gf,
        gols_contra: m.ga,
        eventos: m.events || []
      }));
      const { error: partidasError } = await supabase.from("simulacao_partidas").insert(rows);
      if (partidasError) throw partidasError;
    }

    const { error: rankingError } = await supabase.from("ranking_global").insert({
      nome_usuario: nome,
      simulacao_id: simulacao.id,
      pontos,
      gols_pro: golsPro,
      gols_contra: golsContra,
      vitorias
    });

    if (rankingError) throw rankingError;

    return NextResponse.json({ ok: true, simulacao_id: simulacao.id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro ao salvar simulação" }, { status: 500 });
  }
}
