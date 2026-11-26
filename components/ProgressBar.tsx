export default function ProgressBar({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-emerald-100/90">{label}</span>
        <span className="text-emerald-300/80">{p}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-emerald-950">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all"
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
}
