import type { Method } from "./MethodSelector";

export default function ComparisonSection({ selectedMethods }: { selectedMethods: Method[] }) {
  if (selectedMethods.length < 2) return null;
  return (
    <section className="rounded-xl border bg-white p-4">
      <h3 className="font-semibold mb-2">Comparison</h3>
      <p className="text-slate-600 text-sm">
        (placeholder) Table comparing iterations for: {selectedMethods.join(", ")}.
      </p>
    </section>
  );
}
