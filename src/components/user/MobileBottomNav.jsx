import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function MobileBottomNav() {
  const { setCartOpen, cartCount, DB, currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const activeOrder = DB.orders.find(
    (o) =>
      o.user === currentUser?.name &&
      ["قيد التحضير", "جاري التحضير", "جاهز للاستلام"].includes(o.status),
  );

  const NAV = [
    {
      label: "القائمة",
      path: "/menu",
      exact: true,
      icon: (a) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={a ? "#1565C0" : "none"}
          stroke={a ? "#1565C0" : "#94a3b8"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "السلة",
      action: "cart",
      icon: (a) => (
        <div className="relative">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={cartCount > 0 ? "#1565C0" : "#94a3b8"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "طلباتي",
      path: "/menu/orders",
      icon: (a) => (
        <div className="relative">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={a ? "#1565C0" : "none"}
            stroke={a ? "#1565C0" : "#94a3b8"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          {activeOrder && (
            <span
              className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border-2 border-white ${activeOrder.status === "جاهز للاستلام" ? "bg-emerald-500" : "bg-orange-400"}`}
            />
          )}
        </div>
      ),
    },
    {
      label: "حسابي",
      path: "/menu/settings",
      icon: (a) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={a ? "#1565C0" : "none"}
          stroke={a ? "#1565C0" : "#94a3b8"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mobile-bottom-nav sm:hidden">
      {NAV.map((item, i) => {
        const active = item.path
          ? item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)
          : false;
        return (
          <button
            key={i}
            onClick={() => {
              if (item.action === "cart") setCartOpen(true);
              else if (item.path) navigate(item.path);
            }}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all"
          >
            {item.icon(active)}
            <span
              className={`text-[10px] font-bold transition-colors ${active ? "text-blue-main" : "text-slate-400"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
