import { useMemo, useState } from "react";
type Method = "newton" | "secant" | "bisection" | "muller";
type Iteration = { i:number; x:number; fx:number; error:number };
type RunResponse = { method:Method; converged:boolean; root:number|null; message:string; iterations:Iteration[]; trace:{curve:{xs:number[];ys:number[]}} };

export default function RootFindingContent() {
  const [method, setMethod] = useState<Method>("newton");
  const [fn, setFn] = useState("x**3 - x - 2");
  const [x0, setX0] = useState(1.5);
  const [x1, setX1] = useState(2.0);
  const [a, setA]   = useState(1.0);
  const [b, setB]   = useState(2.0);
  const [tol, setTol] = useState(1e-8);
  const [maxIter, setMaxIter] = useState(50);
  const [res, setRes] = useState<RunResponse|null>(null);
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const canRun = useMemo(() => !!fn, [fn]);

  async function run() {
    try {
      setLoading(true); setErr(null); setRes(null);
      const body:any = { method, function: fn, x0, x1, a, b, tol, max_iter: maxIter };
      const r = await fetch("/api/root-finding/run", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(await r.text());
      setRes(await r.json());
    } catch(e:any){ setErr(e.message||String(e)); } finally { setLoading(false); }
  }

  return (
    <section className="w-full bg-white pb-16">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-semibold mb-3">Parameters</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium">f(x)</label>
              <input className="w-full border rounded-lg px-3 py-2" value={fn} onChange={e=>setFn(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={()=>setMethod("newton")}   className={`px-3 py-1.5 rounded ${method==="newton"?"bg-blue-600 text-white":"border"}`}>Newton</button>
                <button onClick={()=>setMethod("secant")}   className={`px-3 py-1.5 rounded ${method==="secant"?"bg-blue-600 text-white":"border"}`}>Secant</button>
                <button onClick={()=>setMethod("bisection")}className={`px-3 py-1.5 rounded ${method==="bisection"?"bg-blue-600 text-white":"border"}`}>Bisection</button>
                <button onClick={()=>setMethod("muller")}   className={`px-3 py-1.5 rounded ${method==="muller"?"bg-blue-600 text-white":"border"}`}>Müller</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="x₀" value={x0} onChange={setX0} />
              <Field label="x₁" value={x1} onChange={setX1} />
              <Field label="a"  value={a}  onChange={setA} />
              <Field label="b"  value={b}  onChange={setB} />
              <Field label="tol" value={tol} onChange={setTol} step="any" />
              <Field label="max iter" value={maxIter} onChange={(v)=>setMaxIter(Math.floor(v))} />
            </div>
          </div>
          <div className="mt-4">
            <button disabled={!canRun||loading} onClick={run} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
              {loading ? "Running…" : "Run"}
            </button>
            {err && <span className="ml-3 text-sm text-red-600">{err}</span>}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-semibold mb-3">Result</h2>
          {res ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-3">i</th>
                    <th className="py-2 pr-3">x</th>
                    <th className="py-2 pr-3">f(x)</th>
                    <th className="py-2 pr-0">|Δx|</th>
                  </tr>
                </thead>
                <tbody>
                  {res.iterations.map(row => (
                    <tr key={row.i} className="border-b last:border-0">
                      <td className="py-2 pr-3">{row.i}</td>
                      <td className="py-2 pr-3">{row.x}</td>
                      <td className="py-2 pr-3">{row.fx}</td>
                      <td className="py-2 pr-0">{row.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm text-slate-600">{res.message}</p>
            </div>
          ) : <p className="text-slate-600">Run para ver o resultado.</p>}
        </div>
      </div>
    </section>
  );
}

function Field({label, value, onChange, step}:{label:string; value:number; onChange:(v:number)=>void; step?:string}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type="number" step={step||"any"} className="w-full border rounded-lg px-3 py-2"
             value={value} onChange={e=>onChange(parseFloat(e.target.value))}/>
    </div>
  );
}
