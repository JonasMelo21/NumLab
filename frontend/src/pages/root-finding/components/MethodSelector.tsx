import { Button } from "../../../components/ui/button";
import { useLang } from "../../../app/i18n/LangProvider";

export type Method = "newton" | "secant" | "bisection" | "muller";

export default function MethodSelector({
  selectedMethods,
  onMethodToggle,
}: {
  selectedMethods: Method[];
  onMethodToggle: (m: Method) => void;
}) {
  const t = {
    title: "Select Methods",
    labels: {
      newton: "Newton",
      secant: "Secant",
      bisection: "Bisection",
      muller: "Müller",
    },
    ariaToggle: (label: string) => `Toggle ${label} method`,
  };

  const methods: { key: Method; label: string }[] = [
    { key: "newton", label: t.labels.newton },
    { key: "secant", label: t.labels.secant },
    { key: "bisection", label: t.labels.bisection },
    { key: "muller", label: t.labels.muller },
  ];

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <h3 className="text-slate-900 text-lg font-semibold mb-4 text-center">
        {t.title}
      </h3>

      <div className="flex flex-wrap justify-center gap-3">
        {methods.map(({ key, label }) => {
          const active = selectedMethods.includes(key);
          return (
            <Button
              key={key}
              variant="pill"
              aria-pressed={active}
              aria-label={t.ariaToggle(label)}
              onClick={() => onMethodToggle(key)}
              className={
                active
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-600"
                  : "bg-white text-slate-700 border-gray-300 hover:bg-slate-50"
              }
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
