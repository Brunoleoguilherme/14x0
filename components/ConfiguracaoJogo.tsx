"use client";

type Props = {
  formacao: string;
  estilo: string;
  modo: string;
  onFormacao: (valor: string) => void;
  onEstilo: (valor: string) => void;
  onModo: (valor: string) => void;
};

const formacoes = ["4-3-3", "4-4-2", "4-2-3-1", "4-2-4", "3-5-2", "5-3-2", "4-5-1", "3-4-3"];
const estilos = ["Defensivo", "Equilibrado", "Ofensivo"];
const modos = ["Clássico", "Lenda"];

export default function ConfiguracaoJogo({
  formacao,
  estilo,
  modo,
  onFormacao,
  onEstilo,
  onModo,
}: Props) {
  return (
    <div className="mb-6 rounded-[28px] bg-white p-6 card-shadow">
      <div className="mb-5">
        <div className="text-xs font-black uppercase tracking-[0.35em] text-stone-500">
          Formação
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {formacoes.map((item) => (
            <button
              key={item}
              onClick={() => onFormacao(item)}
              className={`rounded-xl border-2 px-5 py-4 font-black transition ${
                formacao === item
                  ? "border-black bg-black text-white"
                  : "border-black bg-white text-black hover:bg-creme"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-xs font-black uppercase tracking-[0.35em] text-stone-500">
          Estilo
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {estilos.map((item) => (
            <button
              key={item}
              onClick={() => onEstilo(item)}
              className={`rounded-xl border-2 px-5 py-4 font-black transition ${
                estilo === item
                  ? "border-black bg-black text-white"
                  : "border-black bg-white text-black hover:bg-creme"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-[0.35em] text-stone-500">
          Modo • Dificuldade
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {modos.map((item) => (
            <button
              key={item}
              onClick={() => onModo(item)}
              className={`rounded-xl border-2 px-5 py-4 font-black transition ${
                modo === item
                  ? "border-black bg-black text-white"
                  : "border-black bg-white text-black hover:bg-creme"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}