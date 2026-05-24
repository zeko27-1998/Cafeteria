import { useApp } from "../../context/AppContext";

export default function CategoryChips() {
  const { activeCat, setActiveCat, DB } = useApp();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
      <button
        onClick={() => setActiveCat(null)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-[13px] font-bold whitespace-nowrap transition-all flex-shrink-0"
        style={{
          border: `2px solid ${activeCat === null ? "#1565C0" : "#94a3b8"}`,
          background:
            activeCat === null
              ? "linear-gradient(135deg,#1565C0,#1E88E5)"
              : "white",
          color: activeCat === null ? "white" : "#475569",
          boxShadow:
            activeCat === null ? "0 4px 12px rgba(21,101,192,0.3)" : "none",
        }}
      >
        🌐 الكل
      </button>
      {DB.categories.map((c) => (
        <button
          key={c.id}
          onClick={() => setActiveCat(c.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-[13px] font-bold whitespace-nowrap transition-all flex-shrink-0"
          style={{
            border: `2px solid ${activeCat === c.id ? "#1565C0" : "#94a3b8"}`,
            background:
              activeCat === c.id
                ? "linear-gradient(135deg,#1565C0,#1E88E5)"
                : "white",
            color: activeCat === c.id ? "white" : "#475569",
            boxShadow:
              activeCat === c.id ? "0 4px 12px rgba(21,101,192,0.3)" : "none",
          }}
        >
          {c.icon} {c.name}
        </button>
      ))}
    </div>
  );
}
