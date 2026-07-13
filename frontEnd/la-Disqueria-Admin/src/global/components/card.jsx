export default function StatCard({
  title,
  value,
  change,
  changeText,
  color = "#FA9598",
}) {
  return (
    <div
      className="rounded-2xl p-4 w-[250px]"
      style={{ backgroundColor: color }}
    >
      <p className="text-sm opacity-80">{title}</p>

      <h2 className="text-3xl font-bold mt-2">{value}</h2>

      {change && (
        <div className="flex items-center gap-2 mt-3 text-sm">
          <span className="font-semibold">{change}</span>
          <span className="opacity-80">{changeText}</span>
        </div>
      )}
    </div>
  );
}