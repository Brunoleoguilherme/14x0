import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("vw_campanhas_14x0")
    .select("*");

  if (error) {
    return NextResponse.json({ error });
  }

  const roleta: any[] = [];

  data.forEach((campanha) => {
    for (let i = 0; i < campanha.peso; i++) {
      roleta.push(campanha);
    }
  });

  const sorteada =
    roleta[Math.floor(Math.random() * roleta.length)];

  return NextResponse.json(sorteada);
}