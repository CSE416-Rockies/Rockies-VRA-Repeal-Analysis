export default function Legend({ title, items }) {
  return (
    <div className="flex flex-col bg-white border-2 border-gray-300 rounded-md justify-center w-fit h-fit px-10 py-2">
      <div className="text-xl">{title}</div>

      {items.map(({ label, color }) => (
        <div key={label} className="flex gap-2 items-center">

          {label === "Ensemble" ? (
            <svg width="16" height="16" viewBox="0 0 16 16">
              <line x1="2" y1="8" x2="14" y2="8" stroke="black" strokeWidth="2"/>
              <line x1="2" y1="5" x2="2" y2="11" stroke="black" strokeWidth="2"/>
              <line x1="14" y1="5" x2="14" y2="11" stroke="black" strokeWidth="2"/>
            </svg>
          ) : (
            <div
              className="rounded w-4 h-4"
              style={{ backgroundColor: color }}
            />
          )}

          <div className="text-lg capitalize">{label}</div>
        </div>
      ))}
    </div>
  );
}