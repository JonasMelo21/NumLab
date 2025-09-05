const API = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export type NewtonAnimRequest = {
  function: string;
  x0: number;
  max_iter?: number;
  tol?: number;
  x_range?: [number, number, number];
  y_range?: [number, number, number];
  fps?: number;
  quality?: "low_quality" | "medium_quality" | "high_quality";
};

export type NewtonAnimResponse = { video_url: string };

export async function animateNewton(payload: NewtonAnimRequest): Promise<string> {
  const res = await fetch(`${API}/api/animate/newton`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const j = await res.json();
      detail = j?.detail ?? detail;
    } catch {}
    throw new Error(detail);
  }
  const data = (await res.json()) as NewtonAnimResponse;
  // se vier relativo (/media/...), prefixa com a base da API
  return data.video_url.startsWith("http") ? data.video_url : `${API}${data.video_url}`;
}
