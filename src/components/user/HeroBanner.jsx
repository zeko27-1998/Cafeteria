import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const { currentUser, DB } = useApp();
  const navigate = useNavigate();
  const balance =
    DB.accounts.find((a) => a.id === currentUser?.id)?.balance ?? 0;

  const activeOrder = DB.orders.find(
    (o) =>
      o.user === currentUser?.name &&
      ["قيد التحضير", "جاري التحضير", "جاهز للاستلام"].includes(o.status),
  );

  const S_ICON = {
    "قيد التحضير": "🕐",
    "جاري التحضير": "🍳",
    "جاهز للاستلام": "✅",
  };

  return (
    <div className="mb-5 space-y-3">
      {/* Main banner */}
      <div
        className="hero-banner relative overflow-hidden rounded-3xl text-white p-5 sm:p-7"
        style={{
          background:
            "linear-gradient(135deg, #0B3D91 0%, #1565C0 55%, #1E88E5 100%)",
        }}
      >
        {/* Glow blobs */}
        <div
          className="absolute -top-12 -left-12 w-40 h-40 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-8 right-20 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          }}
        />

        <div className="relative flex items-center gap-4">
          {/* Logo */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border-2 border-white/25 flex-shrink-0 overflow-hidden">
            <img
              src="/logo.png"
              alt="Scopesky"
              className="w-full h-full object-contain p-1"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold opacity-70 mb-0.5 tracking-wide">
              SCOPESKY CAFE & BISTRO
            </div>
            <div className="text-lg sm:text-xl font-black leading-tight">
              أهلاً، {currentUser?.name} 👋
            </div>
            <div className="text-xs opacity-60 hidden sm:block mt-0.5">
              اختر وجبتك المفضلة من قائمتنا اليومية
            </div>
          </div>

          {/* Balance chip */}
          <button
            onClick={() => navigate("/menu/settings?tab=wallet")}
            className="flex-shrink-0 bg-white/12 hover:bg-white/22 border border-white/25 rounded-2xl px-3.5 py-2.5 text-center transition-all backdrop-blur-sm"
          >
            <div className="text-[10px] opacity-70 font-semibold">💰 رصيدي</div>
            <div
              className={`font-black text-base sm:text-lg leading-tight ${balance > 0 ? "text-white" : "text-white/50"}`}
            >
              {balance.toLocaleString("ar")}
            </div>
            <div className="text-[9px] opacity-50 font-semibold">د.ع</div>
          </button>
        </div>
      </div>

      {/* Active order notification */}
      {activeOrder && (
        <div
          className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 animate-fade-in-up ${
            activeOrder.status === "جاهز للاستلام"
              ? "bg-emerald-50 border-emerald-300"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
              activeOrder.status === "جاهز للاستلام"
                ? "bg-emerald-100"
                : "bg-blue-100"
            }`}
          >
            {S_ICON[activeOrder.status]}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`font-black text-sm ${activeOrder.status === "جاهز للاستلام" ? "text-emerald-700" : "text-blue-deep"}`}
            >
              {activeOrder.status === "جاهز للاستلام"
                ? "🎉 طلبك جاهز! توجه للاستلام"
                : `طلب #${activeOrder.id} — ${activeOrder.status}`}
            </div>
            <div className="text-xs text-slate-400 truncate mt-0.5">
              {activeOrder.items.map((c) => c.item.icon).join(" ")} —{" "}
              {activeOrder.subtotal.toLocaleString("ar")} د.ع
            </div>
          </div>
          <button
            onClick={() => navigate("/menu/orders")}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap flex-shrink-0 text-white transition-all ${
              activeOrder.status === "جاهز للاستلام"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-blue-main hover:bg-blue-deep"
            }`}
          >
            عرض
          </button>
        </div>
      )}
    </div>
  );
}
