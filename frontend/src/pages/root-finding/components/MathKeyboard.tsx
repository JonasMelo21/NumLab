export default function MathKeyboard({ onInsert }: { onInsert: (s: string) => void }) {
  const keys = ["+", "-", "*", "/", "(", ")", "^", "sin(", "cos(", "exp(", "log("];
  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onInsert(k)}
          className="px-2 py-1 rounded border text-sm bg-white hover:bg-slate-50"
        >
          {k}
        </button>
      ))}
    </div>
  );
}
