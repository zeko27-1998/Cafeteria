import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopBar from "../components/layout/TopBar";
import MobileBottomNav from "../components/user/MobileBottomNav";
import Badge from "../components/ui/Badge";
import { typeAr } from "../data/db";

const S_COLOR = {
  "قيد التحضير": "orange",
  "جاري التحضير": "blue",
  "جاهز للاستلام": "green",
  "تم التسليم": "green",
  ملغي: "red",
};
const S_ICON = {
  "قيد التحضير": "🕐",
  "جاري التحضير": "🍳",
  "جاهز للاستلام": "✅",
  "تم التسليم": "🎉",
  ملغي: "❌",
};
const STEPS = ["قيد التحضير", "جاري التحضير", "جاهز للاستلام", "تم التسليم"];
const paymentLabel = (method) =>
  method === "cash" ? "دفع نقدي" : "رصيد الحساب";
const paymentIcon = (method) => (method === "cash" ? "💵" : "💳");

export default function MyOrders() {
  const { DB, currentUser } = useApp();
  const navigate = useNavigate();

  const myOrders = DB.orders.filter((o) => o.user === currentUser?.name);
  const activeOrder = myOrders.find((o) =>
    STEPS.slice(0, 3).includes(o.status),
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F8FAFC" }}
    >
      <TopBar />
      <main className="flex-1 px-4 py-5 max-w-2xl w-full mx-auto pb-24 sm:pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/menu")}
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all hover:-translate-x-0.5"
            style={{
              border: "2px solid #CBD5E1",
              background: "white",
              color: "#475569",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex items-center gap-2 text-lg font-black text-slate-800">
            <span className="section-title-accent" />
            طلباتي
            {myOrders.length > 0 && (
              <span className="text-sm font-semibold text-slate-400">
                ({myOrders.length})
              </span>
            )}
          </div>
        </div>

        {/* Active order card */}
        {activeOrder && (
          <div
            className="rounded-3xl p-5 mb-5 text-white animate-fade-in-up relative overflow-hidden"
            style={{
              background:
                activeOrder.status === "جاهز للاستلام"
                  ? "linear-gradient(135deg,#16A34A,#15803D)"
                  : "linear-gradient(135deg,#0B3D91,#1565C0)",
            }}
          >
            <div className="absolute -bottom-8 -right-8 text-[80px] opacity-10 pointer-events-none">
              {S_ICON[activeOrder.status]}
            </div>

            <div className="flex items-start gap-3 mb-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                {S_ICON[activeOrder.status]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-base leading-tight">
                  {activeOrder.status === "جاهز للاستلام"
                    ? "🎉 طلبك جاهز! توجه للاستلام"
                    : `طلب #${activeOrder.id} — ${activeOrder.status}`}
                </div>
                <div className="text-xs opacity-70 mt-0.5 truncate">
                  {activeOrder.items
                    .map((c) => `${c.item.icon} ${c.item.name}`)
                    .join("، ")}
                </div>
                <div className="font-black mt-1 text-sm">
                  {activeOrder.subtotal.toLocaleString("ar")} د.ع
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-1 relative">
              {STEPS.map((step, i) => {
                const curIdx = STEPS.indexOf(activeOrder.status);
                const done = i <= curIdx;
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all flex-shrink-0 ${done ? "bg-white text-blue-deep" : "bg-white/20 text-white/60"}`}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 rounded ${done && i < curIdx ? "bg-white" : "bg-white/20"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1.5">
              {STEPS.map((s) => (
                <span
                  key={s}
                  className="text-[9px] opacity-60 font-semibold flex-1 text-center"
                >
                  {s.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Orders list */}
        {myOrders.length === 0 ? (
          <div
            className="bg-white rounded-3xl p-16 text-center"
            style={{ border: "2px solid #E2E8F0" }}
          >
            <div className="text-6xl mb-4">🍽️</div>
            <p className="font-bold text-slate-500 mb-1">لا توجد طلبات بعد</p>
            <p className="text-sm text-slate-400 mb-5">
              ابدأ بتصفح القائمة واختر وجبتك
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="btn-primary-gradient px-8 py-3 rounded-2xl text-sm font-bold"
            >
              تصفح القائمة ←
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl overflow-hidden transition-all"
                style={{
                  border: `2px solid ${order === activeOrder ? "#1565C0" : "#E2E8F0"}`,
                  boxShadow:
                    order === activeOrder
                      ? "0 4px 20px rgba(21,101,192,0.12)"
                      : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: "1px solid #F1F5F9" }}
                >
                  <div
                    className="w-10 h-10 rounded-2xl text-xs font-black text-white flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#1565C0,#1E88E5)",
                    }}
                  >
                    #{order.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-800">
                        {S_ICON[order.status]} {order.status}
                      </span>
                      <Badge variant={S_COLOR[order.status] || "orange"}>
                        {typeAr(order.type)}
                      </Badge>
                      <Badge
                        variant={order.paymentMethod === "cash" ? "green" : "blue"}
                      >
                        {paymentIcon(order.paymentMethod)}{" "}
                        {paymentLabel(order.paymentMethod)}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {order.date} — {order.time}
                    </div>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <div className="font-black text-blue-main text-sm">
                      {order.subtotal.toLocaleString("ar")}{" "}
                      <span className="text-xs font-normal text-slate-400">
                        د.ع
                      </span>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400">
                      {order.items.reduce((s, c) => s + c.qty, 0)} قطعة
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <MiniStat label="الحالة" value={order.status} />
                  <MiniStat label="الدفع" value={paymentLabel(order.paymentMethod)} />
                  <MiniStat
                    label="الإجمالي"
                    value={`${order.subtotal.toLocaleString("ar")} د.ع`}
                    strong
                  />
                </div>

                {/* Items */}
                <div className="px-4 py-3 flex flex-wrap gap-2">
                  {order.items.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      {c.item.image ? (
                        <img
                          src={c.item.image}
                          alt=""
                          className="w-5 h-5 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-sm">{c.item.icon}</span>
                      )}
                      <span className="text-xs font-semibold text-slate-700">
                        {c.item.name}
                      </span>
                      {c.qty > 1 && (
                        <span className="text-blue-main text-xs font-black">
                          ×{c.qty}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div
                    className="mx-4 mb-3 px-3 py-2 rounded-xl text-xs text-amber-800 font-semibold"
                    style={{
                      background: "#FFFBEB",
                      border: "1px solid #FDE68A",
                    }}
                  >
                    📝 {order.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <MobileBottomNav />
    </div>
  );
}

function MiniStat({ label, value, strong = false }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 px-3 py-2 min-w-0">
      <div className="text-[10px] text-slate-400 font-bold mb-0.5">
        {label}
      </div>
      <div
        className={`text-xs truncate ${strong ? "font-black text-blue-main" : "font-bold text-slate-700"}`}
      >
        {value}
      </div>
    </div>
  );
}
