import * as React from "react";
import { animateNewton } from "../../../lib/animations";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function NewtonAnimation() {
  const [fn, setFn] = React.useState("x**3 - x - 2");
  const [x0, setX0] = React.useState<number>(1.5);
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleAnimate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setVideoUrl("");
    try {
      const url = await animateNewton({
        function: fn.replaceAll("^", "**"),
        x0,
        max_iter: 6,
        fps: 30,
        quality: "low_quality",
        x_range: [-5, 5, 1],
        y_range: [-5, 5, 1],
      });
      setVideoUrl(url);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao gerar animação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="newton-animation" className="w-full mt-8">
      <h2 className="text-2xl font-semibold mb-4">Newton Animation</h2>

      <form onSubmit={handleAnimate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <Label htmlFor="fn">f(x)</Label>
          <Input
            id="fn"
            value={fn}
            onChange={(e) => setFn(e.target.value)}
            placeholder="Ex: x**3 - x - 2 (use ** em vez de ^)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Dica: use <code>**</code> para potência; funções válidas: sin, cos, tan, exp, log, sqrt, abs, etc.
          </p>
        </div>

        <div>
          <Label htmlFor="x0">x₀ (chute inicial)</Label>
          <Input
            id="x0"
            type="number"
            step="any"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
          />
        </div>

        <div className="md:col-span-3 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Gerando..." : "Gerar animação"}
          </Button>
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
      </form>

      <div className="mt-6">
        {videoUrl ? (
          <video key={videoUrl} src={videoUrl} controls className="w-full rounded-xl shadow" />
        ) : (
          <div className="text-sm text-gray-500">
            A animação aparecerá aqui após gerar.
          </div>
        )}
      </div>
    </section>
  );
}
