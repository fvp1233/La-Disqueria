export default function StatCard({
  title,
  value,
  change,
  changeText,
  color = "#FA9598",
  textColor = "#000",
}) {
  return (
    <div className="bg-[#F9FAF4] p-4 rounded-2xl shadow-md w-[250px]">
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: color }}
      >
        <p className="text-sm opacity-80">{title}</p>

        <h2 className="text-3xl font-bold mt-2">{value}</h2>

        <div className="flex items-center gap-2 mt-3 text-sm">
          <span className="bg-[#F9FAF4]/60 px-2 py-1 rounded-md">
            {change}
          </span>
          <span className="opacity-80">{changeText}</span>
        </div>
      </div>
    </div>
  );
}