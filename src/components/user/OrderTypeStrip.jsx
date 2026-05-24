import { useApp } from "../../context/AppContext";

const TYPES = [
  {
    key: "buy",
    emoji: "🛍️",
    label: "جاهز للشراء",
    sub: "وجبة جاهزة",
    activeGrad: "linear-gradient(135deg,#1565C0,#1E88E5)",
    activeBorder: "#1565C0",
    activeBg: "#EFF6FF",
  },
  {
    key: "cook",
    emoji: "🍳",
    label: "تحضير طازج",
    sub: "يُحضَّر عند الطلب",
    activeGrad: "linear-gradient(135deg,#16A34A,#15803D)",
    activeBorder: "#16A34A",
    activeBg: "#F0FDF4",
  },
  {
    key: "custom",
    emoji: "✏️",
    label: "طلب مخصص",
    sub: "مع ملاحظات",
    activeGrad: "linear-gradient(135deg,#D97706,#B45309)",
    activeBorder: "#D97706",
    activeBg: "#FFFBEB",
  },
];

export default function OrderTypeStrip() {
  const { orderType, setOrderType } = useApp();

  return (
    <div className="flex gap-2.5 mb-5 overflow-x-auto pb-1 no-scrollbar">
      {TYPES.map((t) => {
        const active = orderType === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setOrderType(t.key)}
            className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-2xl min-w-[148px] transition-all duration-200 text-right"
            style={{
              border: `2px solid ${active ? t.activeBorder : "#CBD5E1"}`,
              background: active ? t.activeBg : "white",
              boxShadow: active
                ? `0 4px 14px ${t.activeBorder}28`
                : "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            {/* Icon circle */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: active ? t.activeGrad : "#F1F5F9" }}
            >
              <span
                style={{
                  filter: active ? "brightness(0) invert(1)" : "none",
                  fontSize: 20,
                }}
              >
                {t.emoji}
              </span>
            </div>
            <div className="min-w-0">
              <strong
                className="block text-sm font-extrabold leading-tight"
                style={{ color: active ? t.activeBorder : "#374151" }}
              >
                {t.label}
              </strong>
              <span className="text-[11px] text-slate-400">{t.sub}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
