import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { runNewton, runSecant, runBisection, runMuller, type IterationRow } from "../../../lib/api";
import { useLang } from "../../../app/i18n/LangProvider";

type Method = "newton" | "secant" | "bisection" | "muller";

export default function MethodContent({
  method,
  title = "Method",
  pseudo = "1. step\n2. step",
  isCompact = false,
}: {
  method: Method;
  title?: string;
  pseudo?: string;
  isCompact?: boolean;
}) {
  const { lang } = useLang();

  const t = {
    en: {
      explanation: "Explanation placeholder",
      algorithm: "Algorithm",
      params: "Parameters",
      fx: "Function f(x)",
      newton_x0: "Initial guess (x0)",
      secant_x0: "Initial x0",
      secant_x1: "Initial x1",
      bis_a: "Interval start (a)",
      bis_b: "Interval end (b)",
      muller_x0: "Initial x0",
      muller_x1: "Initial x1",
      muller_x2: "Initial x2",
      run: "Run Method",
      running: "Running…",
      soon: "Coming soon",
      errorFallback: "Failed to run method",
      approxRoot: "Approx. root:",
      iterResults: "Iteration Results",
      iter: "Iter",
      x: "x",
      fx_col: "f(x)",
      dx: "|Δx|",
      computing: "Computing…",
      viz: "Method Visualization",
      graphPh: "graph placeholder",
    },
    pt: {
      explanation: "Explicação (placeholder)",
      algorithm: "Algoritmo",
      params: "Parâmetros",
      fx: "Função f(x)",
      newton_x0: "Chute inicial (x0)",
      secant_x0: "x0 inicial",
      secant_x1: "x1 inicial",
      bis_a: "Início do intervalo (a)",
      bis_b: "Fim do intervalo (b)",
      muller_x0: "x0 inicial",
      muller_x1: "x1 inicial",
      muller_x2: "x2 inicial",
      run: "Executar método",
      running: "Executando…",
      soon: "Em breve",
      errorFallback: "Falha ao executar o método",
      approxRoot: "Raiz aprox.:",
      iterResults: "Resultados das Iterações",
      iter: "Iter",
      x: "x",
      fx_col: "f(x)",
      dx: "|Δx|",
      computing: "Calculando…",
      viz: "Visualização do Método",
      graphPh: "gráfico (placeholder)",
    },
  }[lang];

  const [fx, setFx] = useState("x**3 - x - 2");

  // Newton / Secant
  const [x0, setX0] = useState(1.5);
  const [x1, setX1] = useState(2.0);

  // Bisection
  const [a, setA] = useState(1.0);
  const [b, setB] = useState(2.0);

  // Muller
  const [x2, setX2] = useState(2.5);

  const [rows, setRows] = useState<IterationRow[] | null>(null);
  const [root, setRoot] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRun =
    method === "newton" || method === "secant" || method === "bisection" || method === "muller";

  async function handleRun() {
    if (!canRun) return;
    try {
      setLoading(true);
      setError(null);
      setRows(null);
      setRoot(null);

      if (method === "newton") {
        const res = await runNewton({ fx, x0 });
        setRows(res.iterations);
        setRoot(res.root);
      } else if (method === "secant") {
        const res = await runSecant({ fx, x0, x1 });
        setRows(res.iterations);
        setRoot(res.root);
      } else if (method === "bisection") {
        const res = await runBisection({ fx, a, b });
        setRows(res.iterations);
        setRoot(res.root);
      } else if (method === "muller") {
        const res = await runMuller({ fx, x0, x1, x2 });
        setRows(res.iterations);
        setRoot(res.root);
      }
    } catch (e: any) {
      setError(e?.message || t.errorFallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isCompact && <p className="text-slate-600 text-center">{t.explanation}</p>}

        <div>
          <h4 className="font-semibold mb-2 text-center">{t.algorithm}</h4>
          <pre className="bg-slate-50 p-4 rounded border overflow-auto text-sm whitespace-pre font-mono leading-relaxed">
            {pseudo}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-center">{t.params}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* f(x) ocupa a linha toda */}
            <div className="md:col-span-2">
              <Label htmlFor={`fx-${title}`}>{t.fx}</Label>
              <Input
                id={`fx-${title}`}
                placeholder="x**3 - x - 2"
                value={fx}
                onChange={(e) => setFx(e.target.value)}
                disabled={loading || !canRun}
              />
            </div>

            {/* Newton */}
            {method === "newton" && (
              <div>
                <Label htmlFor={`x0-${title}`}>{t.newton_x0}</Label>
                <Input
                  id={`x0-${title}`}
                  type="number"
                  step="any"
                  value={x0}
                  onChange={(e) => setX0(parseFloat(e.target.value))}
                  disabled={loading || !canRun}
                />
              </div>
            )}

            {/* Secant */}
            {method === "secant" && (
              <>
                <div>
                  <Label htmlFor={`x0-${title}`}>{t.secant_x0}</Label>
                  <Input
                    id={`x0-${title}`}
                    type="number"
                    step="any"
                    value={x0}
                    onChange={(e) => setX0(parseFloat(e.target.value))}
                    disabled={loading || !canRun}
                  />
                </div>
                <div>
                  <Label htmlFor={`x1-${title}`}>{t.secant_x1}</Label>
                  <Input
                    id={`x1-${title}`}
                    type="number"
                    step="any"
                    value={x1}
                    onChange={(e) => setX1(parseFloat(e.target.value))}
                    disabled={loading || !canRun}
                  />
                </div>
              </>
            )}

            {/* Bisection */}
            {method === "bisection" && (
              <>
                <div>
                  <Label htmlFor={`a-${title}`}>{t.bis_a}</Label>
                  <Input
                    id={`a-${title}`}
                    type="number"
                    step="any"
                    value={a}
                    onChange={(e) => setA(parseFloat(e.target.value))}
                    disabled={loading || !canRun}
                  />
                </div>
                <div>
                  <Label htmlFor={`b-${title}`}>{t.bis_b}</Label>
                  <Input
                    id={`b-${title}`}
                    type="number"
                    step="any"
                    value={b}
                    onChange={(e) => setB(parseFloat(e.target.value))}
                    disabled={loading || !canRun}
                  />
                </div>
              </>
            )}

            {/* Muller */}
            {method === "muller" && (
              <>
                <div>
                  <Label htmlFor={`x0-${title}`}>{t.muller_x0}</Label>
                  <Input
                    id={`x0-${title}`}
                    type="number"
                    step="any"
                    value={x0}
                    onChange={(e) => setX0(parseFloat(e.target.value))}
                    disabled={loading || !canRun}
                  />
                </div>
                <div>
                  <Label htmlFor={`x1-${title}`}>{t.muller_x1}</Label>
                  <Input
                    id={`x1-${title}`}
                    type="number"
                    step="any"
                    value={x1}
                    onChange={(e) => setX1(parseFloat(e.target.value))}
                    disabled={loading || !canRun}
                  />
                </div>
                <div>
                  <Label htmlFor={`x2-${title}`}>{t.muller_x2}</Label>
                  <Input
                    id={`x2-${title}`}
                    type="number"
                    step="any"
                    value={x2}
                    onChange={(e) => setX2(parseFloat(e.target.value))}
                    disabled={loading || !canRun}
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleRun}
            disabled={loading || !canRun}
            className={`w-full mt-4 rounded-lg py-2 ${
              canRun
                ? loading
                  ? "bg-blue-600/70 text-white cursor-wait"
                  : "bg-blue-600 text-white hover:bg-blue-600/90"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            {loading ? t.running : canRun ? t.run : t.soon}
          </button>

          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
          {root !== null && (
            <p className="text-sm text-center text-slate-600 mt-2">
              {t.approxRoot} <span className="font-medium">{root}</span>
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-center">{t.iterResults}</h4>
          <div className="rounded border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.iter}</TableHead>
                  <TableHead className="text-right">{t.x}</TableHead>
                  <TableHead className="text-right">{t.fx_col}</TableHead>
                  <TableHead className="text-right">{t.dx}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows && rows.length > 0 ? (
                  rows.map((r) => (
                    <TableRow key={r.iter}>
                      <TableCell>{r.iter}</TableCell>
                      <TableCell className="text-right">{formatNum(r.x)}</TableCell>
                      <TableCell className="text-right">{formatNum(r.fx)}</TableCell>
                      <TableCell className="text-right">{r.dx == null ? "—" : formatNum(r.dx)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                      {loading ? t.computing : "—"}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-center">{t.viz}</h4>
          <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-slate-500">
            {t.graphPh}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatNum(v: number, digits = 6) {
  const abs = Math.abs(v);
  if ((abs !== 0 && abs < 1e-4) || abs >= 1e6) return v.toExponential(3);
  return Number(v.toFixed(digits)).toString();
}
