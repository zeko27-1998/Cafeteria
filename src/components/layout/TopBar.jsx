import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function TopBar({
  isAdmin = false,
  sidebarOpen = false,
  onMenuToggle,
}) {
  const { currentUser, logout, setCartOpen, cartCount, DB } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const pendingOrders = isAdmin
    ? DB?.orders?.filter((o) => o.status === "قيد التحضير").length || 0
    : 0;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    const handleResize = () => setWindowWidth(window.innerWidth);

    document.addEventListener("mousedown", handler);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ROLE_LABEL = {
    superadmin: "🔑 سوبر أدمن",
    admin: "🛡️ مدير",
    user: "👤 موظف",
  };

  const userMenuItems = isAdmin
    ? [
        {
          icon: "⚙️",
          label: "إعدادات الحساب",
          action: () => navigate("/admin/settings"),
        },
        { divider: true },
        {
          icon: "🚪",
          label: "تسجيل خروج",
          action: () => logout(navigate),
          danger: true,
        },
      ]
    : [
        {
          icon: "📋",
          label: "طلباتي السابقة",
          action: () => navigate("/menu/orders"),
        },
        {
          icon: "⚙️",
          label: "إعدادات الحساب",
          action: () => navigate("/menu/settings"),
        },
        { divider: true },
        {
          icon: "🚪",
          label: "تسجيل خروج",
          action: () => logout(navigate),
          danger: true,
        },
      ];

  return (
    <header
      className="px-3 md:px-6 h-[66px] flex items-center justify-between sticky top-0 z-[100]"
      style={{
        background: isAdmin
          ? "linear-gradient(135deg, #0B3D91 0%, #1565C0 100%)"
          : "linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)",
        boxShadow: "0 4px 20px rgba(11,61,145,0.3)",
        paddingLeft: 12,
        paddingRight: windowWidth >= 768 ? (sidebarOpen ? 240 : 64) : undefined,
        transition: "padding .3s",
      }}
    >
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-2 md:gap-3">
        {isAdmin && onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden w-10 h-10 rounded-xl bg-white/15 border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition-all relative flex-shrink-0"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                menuOpen ? "rotate-180 scale-110" : ""
              }`}
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            {pendingOrders > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => navigate(isAdmin ? "/admin" : "/menu")}
          className="flex items-center gap-2.5 md:gap-3 mr-4"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/30 bg-white flex-shrink-0 shadow-md">
            <img
              src="/logo.png"
              alt="Scopesky"
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="text-[15px] font-black text-white tracking-tight">
              {isAdmin ? "لوحة الإدارة" : "Scopesky Cafe"}
            </div>
            <div className="text-[10px] text-white/70 font-semibold">
              {isAdmin ? "Scopesky Cafe & Bistro" : "كافتريا الشركة"}
            </div>
          </div>
        </button>
      </div>

      {/* Right: cart + user menu */}
      <div className="flex items-center gap-2 md:gap-3">
        {!isAdmin && (
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition-all"
          >
            <svg
              width="19"
              height="19"
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
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        )}

        {/* User avatar dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3 bg-white/15 border border-white/25 hover:bg-white/25 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              {(currentUser?.name || "?")[0]}
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-[12px] font-bold text-white leading-none truncate max-w-[80px]">
                {currentUser?.name || ""}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">
                {ROLE_LABEL[currentUser?.role] || ""}
              </div>
            </div>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={`transition-all duration-300 hidden sm:block ${
                menuOpen ? "rotate-180 scale-110" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute left-0 mt-2 w-56 rounded-2xl shadow-2xl border border-slate-200 py-2 z-[200]"
              style={{
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.9)",
              }}
            >
              <div
                className="px-4 py-3 mb-1"
                style={{
                  background: "linear-gradient(135deg,#F1F5F9,#FFFFFF)",
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-black text-lg shadow">
                    {(currentUser?.name || "?")[0]}
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-slate-800 text-sm leading-tight">
                      {currentUser?.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {currentUser?.username || "superadmin"}
                    </div>

                    <span
                      className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentUser?.role === "superadmin"
                          ? "bg-red-100 text-red-600"
                          : currentUser?.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ROLE_LABEL[currentUser?.role]}
                    </span>
                  </div>
                </div>
              </div>
              {userMenuItems.map((item, i) =>
                item.divider ? (
                  <div key={i} className="border-t border-slate-100 my-1" />
                ) : (
                  <button
                    key={i}
                    onClick={() => {
                      item.action();
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all text-right rounded-xl ${
                      item.danger
                        ? "text-red-500 hover:bg-red-50"
                        : "text-slate-700 hover:bg-blue-50"
                    }`}
                  >
                    <span
                      className="w-5 text-base flex-shrink-0"
                      style={{
                        transition: "transform .2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector("span").style.transform =
                          "scale(1.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector("span").style.transform =
                          "scale(1)";
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
