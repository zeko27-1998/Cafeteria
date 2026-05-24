import { useApp } from "../../context/AppContext";

const STYLES = {
  success: { bg: "#16A34A", icon: "✓" },
  error: { bg: "#DC2626", icon: "✕" },
  info: { bg: "#1565C0", icon: "ℹ" },
  default: { bg: "#1E293B", icon: "•" },
};

export default function Toast() {
  const { toasts } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2.5 pointer-events-none px-4 w-full max-w-sm">
      {toasts.map((t) => {
        const style = STYLES[t.type] || STYLES.default;
        return (
          <div
            key={t.id}
            className="toast-item flex items-center gap-3 px-4 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl"
            style={{
              background: style.bg,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black flex-shrink-0">
              {style.icon}
            </span>
            <span className="flex-1">{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
