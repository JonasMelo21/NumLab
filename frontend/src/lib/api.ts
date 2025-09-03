export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/** Linha de iteração comum a todos os métodos */
export type IterationRow = {
  iter: number;
  x: number;
  fx: number;
  dx: number | null;
};

/* =========================
 * Newton
 * ========================= */
export type NewtonParams = {
  fx: string;
  x0: number;
  tol?: number;
  max_iter?: number;
};

export type NewtonResult = {
  method: "newton";
  converged: boolean;
  root: number | null;
  iterations: IterationRow[];
  message?: string | null;
};

export async function runNewton(params: NewtonParams): Promise<NewtonResult> {
  const resp = await fetch(`${API_BASE}/api/root-finding/newton`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fx: params.fx,
      x0: params.x0,
      tol: params.tol ?? 1e-6,
      max_iter: params.max_iter ?? 50,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${resp.status}`);
  }
  return resp.json();
}

/* =========================
 * Secant
 * ========================= */
export type SecantParams = {
  fx: string;
  x0: number;
  x1: number;
  tol?: number;
  max_iter?: number;
};

export type SecantResult = {
  method: "secant";
  converged: boolean;
  root: number | null;
  iterations: IterationRow[];
  message?: string | null;
};

export async function runSecant(params: SecantParams): Promise<SecantResult> {
  const resp = await fetch(`${API_BASE}/api/root-finding/secant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fx: params.fx,
      x0: params.x0,
      x1: params.x1,
      tol: params.tol ?? 1e-6,
      max_iter: params.max_iter ?? 50,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${resp.status}`);
  }
  return resp.json();
}

/* =========================
 * Bisection
 * ========================= */
export type BisectionParams = {
  fx: string;
  a: number;
  b: number;
  tol?: number;
  max_iter?: number;
};

export type BisectionResult = {
  method: "bisection";
  converged: boolean;
  root: number | null;
  iterations: IterationRow[];
  message?: string | null;
};

export async function runBisection(params: BisectionParams): Promise<BisectionResult> {
  const resp = await fetch(`${API_BASE}/api/root-finding/bisection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fx: params.fx,
      a: params.a,
      b: params.b,
      tol: params.tol ?? 1e-6,
      max_iter: params.max_iter ?? 100,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${resp.status}`);
  }
  return resp.json();
}

/* =========================
 * Muller
 * ========================= */
export type MullerParams = {
  fx: string;
  x0: number;
  x1: number;
  x2: number;
  tol?: number;
  max_iter?: number;
};

export type MullerResult = {
  method: "muller";
  converged: boolean;
  root: number | null;
  iterations: IterationRow[];
  message?: string | null;
};

export async function runMuller(params: MullerParams): Promise<MullerResult> {
  const resp = await fetch(`${API_BASE}/api/root-finding/muller`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fx: params.fx,
      x0: params.x0,
      x1: params.x1,
      x2: params.x2,
      tol: params.tol ?? 1e-6,
      max_iter: params.max_iter ?? 100,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${resp.status}`);
  }
  return resp.json();
}