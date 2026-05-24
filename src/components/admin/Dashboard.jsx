import { useApp } from "../../context/AppContext";
import Badge from "../ui/Badge";
import { typeAr } from "../../data/db";

export default function Dashboard() {
  const { DB, setAdminTab, role } = useApp();

  const totalRevenue = DB.orders
    .filter((o) => o.status !== "ملغي")
    .reduce((s, o) => s + o.subtotal, 0);
  const totalBalance = DB.accounts.reduce((s, a) => s + (a.balance || 0), 0);
  const pending = DB.orders.filter((o) => o.status === "قيد التحضير").length;

  // Accounts count based on role — admin sees users only, superadmin sees all
  const visibleAccounts =
    role === "superadmin"
      ? DB.accounts
      : DB.accounts.filter((a) => a.role === "user");

  const stats = [
    {
      icon: "🍔",
      label: "الأصناف",
      val: DB.items.length,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
    },
    {
      icon: "✅",
      label: "متاح حالياً",
      val: DB.items.filter((i) => i.available).length,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
    },
    {
      icon: "📋",
      label: "الطلبات",
      val: DB.orders.length,
      tab: "orders",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
    },
    {
      icon: "🕐",
      label: "قيد التحضير",
      val: pending,
      tab: "orders",
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
    },
    {
      icon: "👥",
      label: role === "superadmin" ? "جميع الحسابات" : "حسابات الموظفين",
      val: visibleAccounts.length,
      tab: "users",
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-700",
    },
    {
      icon: "💳",
      label: "إجمالي الأرصدة",
      val: totalBalance.toLocaleString("ar") + " د.ع",
      tab: "users",
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-700",
      small: true,
    },
  ];

  const recent = DB.orders.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background:
            "linear-gradient(135deg,#071E3D 0%,#0D47A1 50%,#1565C0 100%)",
        }}
      >
        <div
          className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle,#fff 0%,transparent 70%)",
          }}
        />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 border-2 border-white/25 overflow-hidden flex-shrink-0">
            <img
              src="/logo.png"
              alt="logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs opacity-60 font-semibold tracking-widest mb-0.5">
              ADMIN PANEL
            </div>
            <div className="text-xl font-black">Scopesky Cafe & Bistro</div>
            <div className="text-xs opacity-60 mt-0.5">لوحة تحكم الكافتريا</div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs opacity-60 font-semibold">
              إيرادات الكافتريا
            </div>
            <div className="text-2xl font-black">
              {totalRevenue.toLocaleString("ar")}
            </div>
            <div className="text-xs opacity-60">دينار عراقي</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <button
            key={i}
            onClick={() => s.tab && setAdminTab(s.tab)}
            className={`rounded-2xl border-2 p-4 text-right transition-all hover:shadow-md ${s.bg} ${s.border} ${s.tab ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default"}`}
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div
              className={`font-black ${s.small ? "text-sm leading-tight" : "text-2xl"} ${s.text}`}
            >
              {s.val}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Alerts */}
      {pending > 0 && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">
            🔔
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-orange-800 text-sm">
              {pending} طلب بانتظار التحضير
            </div>
            <div className="text-xs text-orange-600 mt-0.5">
              انقر لعرض الطلبات وتحديث حالتها
            </div>
          </div>
          <button
            onClick={() => setAdminTab("orders")}
            className="px-4 py-2 bg-orange-500 text-white rounded-full text-xs font-bold hover:bg-orange-600 transition-all whitespace-nowrap"
          >
            عرض الطلبات
          </button>
        </div>
      )}

      {DB.accounts.filter((a) => a.role === "user" && (a.balance || 0) < 5000)
        .length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">
            💸
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-amber-800 text-sm">
              {
                DB.accounts.filter(
                  (a) => a.role === "user" && (a.balance || 0) < 5000,
                ).length
              }{" "}
              موظف لديهم رصيد منخفض
            </div>
            <div className="text-xs text-amber-600 mt-0.5 truncate">
              {DB.accounts
                .filter((a) => a.role === "user" && (a.balance || 0) < 5000)
                .map((a) => a.name)
                .join("، ")}
            </div>
          </div>
          <button
            onClick={() => setAdminTab("users")}
            className="px-4 py-2 bg-amber-500 text-white rounded-full text-xs font-bold hover:bg-amber-600 transition-all whitespace-nowrap"
          >
            إيداع رصيد
          </button>
        </div>
      )}

      {/* Recent orders — with date & time */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-black text-slate-800 text-base">
            <span className="section-title-accent" /> 📋 آخر الطلبات
          </div>
          <button
            onClick={() => setAdminTab("orders")}
            className="text-sm text-blue-main font-bold hover:underline"
          >
            عرض الكل ←
          </button>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
          {/* Mobile */}
          <div className="block md:hidden divide-y divide-slate-100">
            {recent.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                لا توجد طلبات بعد
              </div>
            ) : (
              recent.map((o) => (
                <div key={o.id} className="p-3.5 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl text-xs font-black text-white flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#1565C0,#1E88E5)",
                    }}
                  >
                    #{o.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{o.user}</div>
                    <div className="text-xs text-slate-400 flex gap-2 mt-0.5">
                      <span>{o.date}</span>
                      <span className="text-slate-300">•</span>
                      <span>{o.time}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-blue-main text-sm">
                      {o.subtotal.toLocaleString("ar")} د.ع
                    </div>
                    <Badge
                      variant={
                        o.status === "تم التسليم"
                          ? "green"
                          : o.status === "ملغي"
                            ? "red"
                            : "orange"
                      }
                    >
                      {o.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop — includes date & time */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr
                  style={{
                    background: "#F1F5F9",
                    borderBottom: "2px solid #E2E8F0",
                  }}
                >
                  {[
                    "#",
                    "الموظف",
                    "التاريخ",
                    "الوقت",
                    "الأصناف",
                    "المبلغ",
                    "الحالة",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-right px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-slate-400"
                    >
                      لا توجد طلبات
                    </td>
                  </tr>
                ) : (
                  recent.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-sm">#{o.id}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                        {o.user}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-semibold">
                        {o.date}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-semibold">
                        {o.time}
                      </td>
                      <td className="px-4 py-3 text-xl">
                        {o.items
                          .slice(0, 4)
                          .map((c) => c.item.icon)
                          .join("")}
                      </td>
                      <td className="px-4 py-3 font-bold text-sm text-blue-main">
                        {o.subtotal.toLocaleString("ar")} د.ع
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            o.status === "تم التسليم"
                              ? "green"
                              : o.status === "ملغي"
                                ? "red"
                                : "orange"
                          }
                        >
                          {o.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
