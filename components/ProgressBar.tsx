export default function ProgressBar({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-4 text-base">
        <span className="text-emerald-50">{label}</span>
        <span className="tabular-nums text-emerald-200">{p}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-emerald-950">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
          style={{
            width: `${p}%`,
            transition: "width 220ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      </div>
    </div>
  );
}
