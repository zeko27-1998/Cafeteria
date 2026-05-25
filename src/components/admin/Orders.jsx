import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Badge from "../ui/Badge";
import { typeAr } from "../../data/db";

const ALL_STATUSES = [
  "قيد التحضير",
  "جاري التحضير",
  "جاهز للاستلام",
  "تم التسليم",
  "ملغي",
];
const S_ICON = {
  "قيد التحضير": "🕐",
  "جاري التحضير": "🍳",
  "جاهز للاستلام": "✅",
  "تم التسليم": "🎉",
  ملغي: "❌",
};
const S_COLOR = {
  "قيد التحضير": "orange",
  "جاري التحضير": "blue",
  "جاهز للاستلام": "green",
  "تم التسليم": "green",
  ملغي: "red",
};

export default function Orders() {
  const { DB, toast } = useApp();
  const [, re] = useState(0);
  const refresh = () => re((n) => n + 1);
  const [filter, setFilter] = useState("الكل");
  const [expandId, setExpandId] = useState(null);
  const [showDate, setShowDate] = useState(false);

  const changeStatus = (order, s) => {
    order.status = s;
    refresh();
    toast(`طلب #${order.id} → ${s}`, "success");
  };

  const filtered =
    filter === "الكل"
      ? DB.orders
      : DB.orders.filter((o) => o.status === filter);

  // Summary counts per status
  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = DB.orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-lg font-black text-slate-800">
          <span className="section-title-accent" />
          إدارة الطلبات
          <span className="font-semibold text-slate-400 text-sm">
            ({DB.orders.length} إجمالي)
          </span>
        </div>
        {/* Toggle date/time visibility */}
        <button
          onClick={() => setShowDate((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all"
          style={{
            border: `2px solid ${showDate ? "#1565C0" : "#CBD5E1"}`,
            background: showDate ? "#EFF6FF" : "white",
            color: showDate ? "#1565C0" : "#475569",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {showDate ? "إخفاء التاريخ" : "إظهار التاريخ"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "الكل" : s)}
            className="rounded-2xl p-3 text-right transition-all hover:-translate-y-0.5"
            style={{
              border: `2px solid ${filter === s ? "#1565C0" : "#E2E8F0"}`,
              background: filter === s ? "#EFF6FF" : "white",
              boxShadow:
                filter === s
                  ? "0 4px 12px rgba(21,101,192,0.15)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div className="text-xl mb-1">{S_ICON[s]}</div>
            <div
              className={`font-black text-xl ${filter === s ? "text-blue-main" : "text-slate-800"}`}
            >
              {counts[s]}
            </div>
            <div className="text-[10px] text-slate-400 font-bold truncate">
              {s}
            </div>
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {["الكل", ...ALL_STATUSES].map((s) => {
          const count = s === "الكل" ? DB.orders.length : counts[s];
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0"
              style={{
                border: `2px solid ${active ? "#1565C0" : "#CBD5E1"}`,
                background: active
                  ? "linear-gradient(135deg,#1565C0,#1E88E5)"
                  : "white",
                color: active ? "white" : "#475569",
                boxShadow: active ? "0 4px 12px rgba(21,101,192,0.25)" : "none",
              }}
            >
              {S_ICON[s] || "📋"} {s}
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-white/25" : "bg-slate-100 text-slate-600"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Count info */}
      <div className="text-xs text-slate-400 font-semibold">
        عرض <span className="font-black text-slate-600">{filtered.length}</span>{" "}
        من أصل{" "}
        <span className="font-black text-slate-600">{DB.orders.length}</span>{" "}
        طلب
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div
          className="bg-white rounded-3xl p-12 text-center"
          style={{ border: "2px solid #E2E8F0" }}
        >
          <div className="text-5xl mb-3">📋</div>
          <p className="font-semibold text-slate-400">
            لا توجد طلبات في هذه الفئة
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isOpen = expandId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl overflow-hidden transition-all"
                style={{
                  border: `2px solid ${isOpen ? "#1565C0" : "#E2E8F0"}`,
                  boxShadow: isOpen
                    ? "0 6px 24px rgba(21,101,192,0.12)"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* Order header */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandId(isOpen ? null : order.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandId(isOpen ? null : order.id);
                    }
                  }}
                  className="flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors hover:bg-slate-50"
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
                        {order.user}
                      </span>
                      <Badge variant={S_COLOR[order.status] || "orange"}>
                        {S_ICON[order.status]} {order.status}
                      </Badge>
                      {order.paymentMethod === "cash" && (
                        <Badge variant="green">💵 نقدي</Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-2 mt-0.5">
                      {showDate && (
                        <span className="font-semibold text-slate-500">
                          📅 {order.date}
                        </span>
                      )}
                      <span>🕐 {order.time}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-blue-main">
                        {order.subtotal.toLocaleString("ar")} د.ع
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {order.items.reduce((s, c) => s + c.qty, 0)} صنف
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all flex-shrink-0"
                    style={{
                      border: "2px solid #E2E8F0",
                      background: isOpen ? "#EFF6FF" : "#F8FAFC",
                      color: isOpen ? "#1565C0" : "#94A3B8",
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div
                    className="animate-fade-in-up"
                    style={{ borderTop: "2px solid #F1F5F9" }}
                  >
                    {/* Date/time row */}
                    <div className="px-4 pt-3 pb-1 flex items-center gap-4 text-xs text-slate-400 font-semibold">
                      <span>📅 {order.date}</span>
                      <span>🕐 {order.time}</span>
                      <Badge variant="blue">{typeAr(order.type)}</Badge>
                    </div>

                    {/* Items */}
                    <div className="px-4 py-3 flex flex-wrap gap-2">
                      {order.items.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                          style={{
                            background: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                          }}
                        >
                          {c.item.image ? (
                            <img
                              src={c.item.image}
                              alt=""
                              className="w-6 h-6 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <span className="text-base">{c.item.icon}</span>
                          )}
                          <span className="text-xs font-semibold text-slate-700">
                            {c.item.name}
                          </span>
                          <span className="text-xs font-bold text-blue-main">
                            {(c.item.price * c.qty).toLocaleString("ar")} د.ع
                          </span>
                          {c.qty > 1 && (
                            <span className="text-orange-500 text-xs font-black">
                              ×{c.qty}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Payment */}
                    <div className="px-4 pb-2 flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-semibold">
                        طريقة الدفع:
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold border ${order.paymentMethod === "cash" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-blue-50 border-blue-200 text-blue-main"}`}
                      >
                        {order.paymentMethod === "cash"
                          ? "💵 دفع نقدي"
                          : "💳 رصيد حساب"}
                      </span>
                    </div>

                    {order.note && (
                      <div
                        className="mx-4 mb-3 px-3 py-2.5 rounded-2xl text-xs text-amber-800 font-semibold flex items-start gap-2"
                        style={{
                          background: "#FFFBEB",
                          border: "1px solid #FDE68A",
                        }}
                      >
                        <span>📝</span>
                        <span>{order.note}</span>
                      </div>
                    )}

                    {/* Status controls */}
                    <div
                      className="px-4 pb-4"
                      style={{ borderTop: "1px solid #F1F5F9", paddingTop: 12 }}
                    >
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                        تغيير حالة الطلب
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => changeStatus(order, s)}
                            disabled={order.status === s}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                            style={{
                              border: `2px solid ${order.status === s ? "#1565C0" : "#CBD5E1"}`,
                              background:
                                order.status === s
                                  ? "linear-gradient(135deg,#1565C0,#1E88E5)"
                                  : "white",
                              color: order.status === s ? "white" : "#475569",
                              cursor:
                                order.status === s ? "default" : "pointer",
                            }}
                          >
                            {S_ICON[s]} {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
