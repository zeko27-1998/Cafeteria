import { useApp } from "../../context/AppContext";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CartSidebar() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    changeQty,
    cartTotal,
    setConfirmOpen,
    currentBalance,
    role,
    paymentMethod,
    setPaymentMethod,
  } = useApp();
  const [animateBadge, setAnimateBadge] = useState(false);
  useEffect(() => {
    if (cart.length > 0) {
      setAnimateBadge(true);
      const t = setTimeout(() => setAnimateBadge(false), 300);
      return () => clearTimeout(t);
    }
    const [displayCount, setDisplayCount] = useState(0);

    useEffect(() => {
      let start = displayCount;
      let end = cart.length;

      const step = () => {
        if (start < end) {
          start++;
          setDisplayCount(start);
          requestAnimationFrame(step);
        }
      };

      step();
    }, [cart.length]);
  }, [cart.length]);
  const location = useLocation();
  if (!location.pathname.startsWith("/menu")) return null;
  const cartItemsCount = cart.length;
  const cartQtyCount = cart.reduce((s, c) => s + c.qty, 0);
  const isUser = role === "user";
  const useWallet = paymentMethod === "wallet";
  const canAfford = !isUser || !useWallet || currentBalance >= cartTotal;

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[500]"
          style={{
            background: "rgba(7,30,61,0.4)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`cart-sidebar ${cartOpen ? "open" : ""} fixed top-0 left-0 bottom-0 z-[501] flex flex-col bg-white`}
        style={{
          width: "min(360px, 92vw)",
          boxShadow: "6px 0 40px rgba(7,30,61,0.25)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#0B3D91,#1565C0)",
            borderBottom: "2px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <span className="font-black text-lg">سلة الطلبات</span>

            {cart.length > 0 && (
              <span
                className={`
    bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full
    ${animateBadge ? "badge-pop" : ""}
  `}
              >
                {cart.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* Cart Summary */}
        {cartOpen && (
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-white border-b">
            <div className="flex justify-between font-bold text-slate-800">
              <span>🧺 الأصناف</span>
              <span className="badge-pop">{cartItemsCount}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mt-1">
              <span>📦 القطع</span>
              <span className="badge-pulse">{cartQtyCount}</span>
            </div>
          </div>
        )}
        {/* Payment method */}
        {isUser && (
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              طريقة الدفع
            </p>
            <div className="flex gap-2">
              {[
                {
                  key: "wallet",
                  icon: "💳",
                  label: "رصيد الحساب",
                  sub: currentBalance.toLocaleString("ar") + " د.ع",
                  okColor:
                    currentBalance >= cartTotal
                      ? "text-emerald-600"
                      : "text-red-500",
                },
                {
                  key: "cash",
                  icon: "💵",
                  label: "دفع نقدي",
                  sub: "عند الاستلام",
                  okColor: "text-slate-400",
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setPaymentMethod(opt.key)}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-right transition-all"
                  style={{
                    border: `2px solid ${paymentMethod === opt.key ? "#1565C0" : "#CBD5E1"}`,
                    background: paymentMethod === opt.key ? "#EFF6FF" : "white",
                  }}
                >
                  <span className="text-lg flex-shrink-0">{opt.icon}</span>
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-bold leading-tight ${paymentMethod === opt.key ? "text-blue-main" : "text-slate-600"}`}
                    >
                      {opt.label}
                    </div>
                    <div className={`text-[10px] font-semibold ${opt.okColor}`}>
                      {opt.sub}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {isUser && useWallet && cart.length > 0 && !canAfford && (
              <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold text-center">
                ⚠️ رصيد غير كافٍ — استخدم الدفع النقدي
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-16">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="font-bold text-slate-400 text-sm">السلة فارغة</p>
              <p className="text-xs text-slate-300 mt-1">
                أضف أصنافاً من القائمة
              </p>
            </div>
          ) : (
            cart.map((c) => (
              <div
                key={c.item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50"
                style={{ border: "2px solid #E2E8F0" }}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  {c.item.image ? (
                    <img
                      src={c.item.image}
                      alt={c.item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-2xl"
                      style={{
                        background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
                      }}
                    >
                      {c.item.icon}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">
                    {c.item.name}
                  </div>
                  <div className="text-sm font-black text-blue-main">
                    {(c.item.price * c.qty).toLocaleString("ar")}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      د.ع
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => changeQty(c.item.id, -1)}
                    className="w-7 h-7 rounded-xl font-black text-sm flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"
                    style={{
                      border: "2px solid #CBD5E1",
                      background: "white",
                      color: "#475569",
                    }}
                  >
                    −
                  </button>
                  <span className="text-sm font-black w-5 text-center text-slate-800">
                    {c.qty}
                  </span>
                  <button
                    onClick={() => changeQty(c.item.id, 1)}
                    className="w-7 h-7 rounded-xl font-black text-sm flex items-center justify-center transition-all hover:bg-blue-main hover:text-white"
                    style={{
                      border: "2px solid #CBD5E1",
                      background: "white",
                      color: "#475569",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 flex-shrink-0"
          style={{ borderTop: "2px solid #E2E8F0" }}
        >
          {cart.length > 0 && (
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-sm text-slate-500">
                <span>المجموع</span>
                <span>{cartTotal.toLocaleString("ar")} د.ع</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">التوصيل</span>
                <span className="text-emerald-600 font-bold">مجاناً 🎉</span>
              </div>
              <div
                className="flex justify-between font-black text-slate-800 text-lg pt-2"
                style={{ borderTop: "2px dashed #E2E8F0" }}
              >
                <span>الإجمالي</span>
                <span className="text-blue-main">
                  {cartTotal.toLocaleString("ar")} د.ع
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              if (!cart.length) return;
              setCartOpen(false);
              setTimeout(() => setConfirmOpen(true), 320);
            }}
            disabled={!cart.length || (isUser && useWallet && !canAfford)}
            className="btn-success-gradient w-full py-3.5 rounded-2xl font-bold text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {!cart.length
              ? "🛒 السلة فارغة"
              : isUser && useWallet && !canAfford
                ? "⚠️ رصيد غير كافٍ"
                : "✔ متابعة للدفع"}
          </button>
        </div>
      </div>
    </>
  );
}
