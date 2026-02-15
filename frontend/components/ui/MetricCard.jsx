export default function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 text-left">
      <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
        {title}
      </p>
      <p className="mt-2 text-2xl font-bold text-neutral-900 tabular-nums">
        {value ?? "—"}
      </p>
    </div>
  );
}
