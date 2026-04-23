export default function StatCard({
  title,
  value,
  change,
  changeText,
  color = "#FA9598",
}) {
  return (
    /* Cambiamos w-[250px] por w-full */
    <div className="bg-[#F9FAF4] p-4 rounded-2xl shadow-md w-full h-full">
      <div
        className="rounded-xl p-4 h-full flex flex-col justify-between"
        style={{ backgroundColor: color }}
      >
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>

        <div className="flex items-center gap-2 mt-3 text-sm">
          <span className="bg-[#F9FAF4]/60 px-2 py-1 rounded-md font-bold">
            {change}
          </span>
          <span className="opacity-80 text-[10px] leading-tight">{changeText}</span>
        </div>
      </div>
    </div>
  );
}