import { useState, useMemo } from "react";

const DICE = [
  { id: "d4", name: "D4", sides: 4 },
  { id: "d6", name: "D6", sides: 6 },
  { id: "d8", name: "D8", sides: 8 },
  { id: "d10", name: "D10", sides: 10 },
  { id: "d12", name: "D12", sides: 12 },
  { id: "d20", name: "D20", sides: 20 },
];

export default function App() {
  const [dice, setDice] = useState("d6");
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<{ dice: string; value: number; ts: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE || "", []);

  
  async function roll() {
    setIsRolling(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/roll?dice=${dice}`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const value = Number(data?.result);
      if (!Number.isFinite(value)) throw new Error("Resposta inválida");
      setResult(value);
      setHistory((h) => [{ dice, value, ts: new Date().toISOString() }, ...h].slice(0, 20));
    } catch (e: any) {
      setError(e.message || "Erro ao rolar o dado");
    } finally {
      setIsRolling(false);
    }
  }
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">🎲 Roll The Dice</h1>

        <div className="rounded-2xl bg-white shadow p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm text-slate-600">Modelo de dado</span>
              <select
                className="h-11 w-full rounded-xl border px-3"
                value={dice}
                onChange={(e) => setDice(e.target.value)}
              >
                {DICE.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </label>
            <button onClick={roll} disabled={isRolling} className="h-11 px-6 rounded-xl bg-slate-900 text-white disabled:opacity-70">
              {isRolling ? "Rolando..." : "Rolar dado"}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <h3 className="font-medium">Resultado</h3>
              <div className="mt-2 text-5xl font-semibold tabular-nums">{result ?? "—"}</div>
              <p className="text-sm text-slate-500">Dado: {dice.toUpperCase()}</p>
            </div>
            <div className="rounded-xl border p-4">
              <h3 className="font-medium">Histórico</h3>
              <ul className="mt-2 max-h-48 overflow-auto divide-y">
                {history.length === 0 && (
                  <li className="py-2 text-slate-500 text-sm">Sem rolagens ainda.</li>
                )}
                {history.map((h, i) => (
                  <li key={i} className="py-2 flex justify-between text-sm">
                    <span>{h.dice.toUpperCase()}</span>
                    <span className="font-semibold">{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}