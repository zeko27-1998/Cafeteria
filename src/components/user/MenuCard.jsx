import { useApp } from "../../context/AppContext";

export default function MenuCard({ item }) {
  const { addToCart, setDetailItem } = useApp();

  return (
    <div
      onClick={() => setDetailItem(item)}
      className={`group bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${
        item.available
          ? "hover:-translate-y-1.5 hover:shadow-xl"
          : "opacity-50 pointer-events-none"
      }`}
      style={{
        border: "2px solid #E2E8F0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ height: 145 }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
            }}
          >
            <span className="text-[58px]">{item.icon}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Availability */}
        <span
          className={`absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            item.available
              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
              : "bg-red-100 text-red-600 border-red-300"
          }`}
        >
          {item.available ? "✔ متاح" : "✕ نفد"}
        </span>

        {/* Type badge */}
        <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-600 border border-white/50 backdrop-blur-sm">
          {{ buy: "🛍️ جاهز", cook: "🍳 طازج", both: "✨ متعدد" }[item.type]}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="font-extrabold text-[14px] text-slate-800 mb-1 leading-snug">
          {item.name}
        </div>
        <div className="text-[12px] text-slate-400 mb-3 leading-relaxed line-clamp-2">
          {item.desc}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-black text-blue-main text-base">
              {item.price.toLocaleString("ar")}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold mr-0.5">
              د.ع
            </span>
          </div>
          <button
            className="add-btn w-9 h-9 rounded-2xl text-white text-xl font-black flex items-center justify-center shadow-md"
            style={{
              background: "linear-gradient(135deg,#1565C0,#1E88E5)",
              boxShadow: "0 4px 12px rgba(21,101,192,.35)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
