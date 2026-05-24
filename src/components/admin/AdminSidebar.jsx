import { useApp } from "../../context/AppContext";

export default function AdminSidebar({
  collapsed = false,
  onNav = () => {},
  onToggle = () => {},
}) {
  const { adminTab, setAdminTab, DB } = useApp();
  const pending = DB.orders.filter((o) => o.status === "قيد التحضير").length;

  const NAV = [
    { key: "dashboard", icon: "📊", label: "لوحة التحكم" },

    { divider: true },

    { key: "items", icon: "🍔", label: "إدارة الأصناف" },
    { key: "add-item", icon: "➕", label: "إضافة صنف" },
    { key: "orders", icon: "📋", label: "الطلبات", badge: pending },

    { divider: true },

    { key: "users", icon: "👥", label: "الحسابات والمحافظ" },

    { divider: true },

    { key: "categories", icon: "🗂️", label: "الفئات" },
  ];

  const handleNav = (key) => {
    setAdminTab(key);
    onNav();
  };

  return (
    <aside
      className="flex flex-col h-full "
      style={{
        background: "#F8FAFC",
        borderLeft: "2px solid #E2E8F0",
        width: collapsed ? 64 : 240,
        minWidth: collapsed ? 64 : 240,
        transition:
          "width .35s cubic-bezier(.25,.8,.25,1), min-width .35s cubic-bezier(.25,.8,.25,1)",
        willChange: "width",
      }}
    >
      {/* ── Logo row + toggle button ── */}
      <div
        className={`hidden md:flex items-center ${collapsed ? "justify-center" : "justify-between"} flex-shrink-0`}
        style={{
          borderBottom: "2px solid #E2E8F0",
          padding: collapsed ? "6px 0" : "10px 16px",
          gap: 10,
        }}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-blue-100 bg-white flex-shrink-0">
              <img
                src="/logo.png"
                alt="logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="text-xs leading-tight overflow-hidden">
              <div className="font-black text-slate-800 whitespace-nowrap">
                Scopesky
              </div>
              <div className="font-semibold text-slate-400 text-[10px] whitespace-nowrap">
                Admin Panel
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onToggle}
          className="flex items-center justify-center rounded-xl transition-all"
          style={{
            width: 44,
            height: 44,
            background: "#EFF6FF",
            color: "#1565C0",
            border: "2px solid #BFDBFE",
            padding: 0,
          }}
          title={collapsed ? "توسيع القائمة" : "طي القائمة"}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#DBEAFE";
            e.currentTarget.style.borderColor = "#93C5FD";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#EFF6FF";
            e.currentTarget.style.borderColor = "#BFDBFE";
          }}
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .3s",
            }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {NAV.map((item, idx) => {
          /* Section header — hide when collapsed */
          if (item.divider) {
            return (
              <div
                key={idx}
                className="mx-2 my-2"
                style={{
                  height: 1,
                  background:
                    "linear-gradient(to left, transparent, #E2E8F0, transparent)",
                }}
              />
            );
            return (
              <div
                key={idx}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 pt-5 pb-1.5 whitespace-nowrap"
              >
                {item.section}
              </div>
            );
          }

          const isActive = adminTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              title={collapsed ? item.label : undefined}
              className="w-full flex items-center rounded-2xl text-sm font-bold transition-all relative"
              style={{
                gap: collapsed ? 0 : 10,
                padding: collapsed ? "11px 0" : "11px 14px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive
                  ? "linear-gradient(135deg,#1565C0,#1E88E5)"
                  : "transparent",
                color: isActive ? "white" : "#475569",
                boxShadow: isActive
                  ? "0 4px 14px rgba(21,101,192,0.28)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#EFF6FF";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Icon */}
              <span
                className="text-lg flex-shrink-0"
                style={{
                  transform: collapsed ? "scale(1.1)" : "scale(1)",
                  transition: "transform .25s",
                }}
              >
                {item.icon}
              </span>

              {/* Label */}
              {!collapsed && (
                <span
                  className="flex-1 text-right whitespace-nowrap"
                  style={{
                    opacity: collapsed ? 0 : 1,
                    transform: collapsed ? "translateX(10px)" : "translateX(0)",
                    transition: "all .25s ease",
                  }}
                >
                  {item.label}
                </span>
              )}

              {/* Pending badge */}
              {item.badge > 0 &&
                (collapsed ? (
                  /* small dot on icon when collapsed */
                  <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : (
                  <span
                    className={`w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? "bg-white/30 text-white" : "bg-red-500 text-white"}`}
                  >
                    {item.badge}
                  </span>
                ))}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
