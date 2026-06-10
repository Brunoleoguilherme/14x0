import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const usadosParam = url.searchParams.get("usados");

  const usados = usadosParam
    ? usadosParam.split(",").map((id) => Number(id)).filter(Boolean)
    : [];

  let query = supabase.from("vw_campanhas_14x0").select("*");

  if (usados.length > 0) {
    query = query.not("campanha_id", "in", `(${usados.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Nenhuma campanha disponível" }, { status: 404 });
  }

  const roleta: any[] = [];

  data.forEach((campanha) => {
    const peso = campanha.peso || 1;

    for (let i = 0; i < peso; i++) {
      roleta.push(campanha);
    }
  });

  const sorteada = roleta[Math.floor(Math.random() * roleta.length)];

  return NextResponse.json(sorteada);
}