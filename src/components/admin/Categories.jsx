import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Badge from "../ui/Badge";

export default function Categories() {
  const { DB, addCategory, deleteCategory } = useApp();
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    addCategory({ name: name.trim(), icon: "📦" });
    setName("");
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      <div className="flex items-center gap-2 text-lg font-black text-slate-800">
        <span className="section-title-accent" /> إدارة الفئات
      </div>

      {/* Add form — name only, no icon */}
      <div
        className="bg-white rounded-3xl p-6"
        style={{ border: "2px solid #E2E8F0" }}
      >
        <div className="font-black text-slate-800 text-sm mb-4">
          ➕ إضافة فئة جديدة
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              اسم الفئة
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="مثال: مشروبات باردة"
              className="field-input"
            />
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary-gradient px-6 py-3 rounded-2xl font-bold whitespace-nowrap"
            style={{ height: 48 }}
          >
            إضافة
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-3">
        {DB.categories.length === 0 && (
          <div
            className="bg-white rounded-3xl p-8 text-center text-slate-400"
            style={{ border: "2px solid #E2E8F0" }}
          >
            لا توجد فئات
          </div>
        )}
        {DB.categories.map((c) => {
          const count = DB.items.filter((i) => i.cat === c.id).length;
          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-4 flex items-center gap-3"
              style={{ border: "2px solid #E2E8F0" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-white text-lg"
                style={{
                  background: "linear-gradient(135deg,#1565C0,#1E88E5)",
                }}
              >
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800">{c.name}</div>
                <Badge variant="blue">{count} صنف</Badge>
              </div>
              <button
                onClick={() => deleteCategory(c.id)}
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  border: "2px solid #FECACA",
                  background: "#FEF2F2",
                  color: "#DC2626",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#DC2626";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FEF2F2";
                  e.currentTarget.style.color = "#DC2626";
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
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Desktop table — no icon column */}
      <div
        className="hidden sm:block bg-white rounded-3xl overflow-hidden"
        style={{ border: "2px solid #E2E8F0" }}
      >
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "#F1F5F9",
                borderBottom: "2px solid #E2E8F0",
              }}
            >
              {["#", "اسم الفئة", "عدد الأصناف", "إجراءات"].map((h) => (
                <th
                  key={h}
                  className="text-right px-5 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DB.categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-slate-400">
                  لا توجد فئات — أضف فئة جديدة أعلاه
                </td>
              </tr>
            ) : (
              DB.categories.map((c) => {
                const count = DB.items.filter((i) => i.cat === c.id).length;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-400 font-mono text-sm">
                      #{c.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg,#1565C0,#1E88E5)",
                            fontSize: 16,
                          }}
                        >
                          {c.name[0]}
                        </div>
                        <span className="font-bold text-slate-800">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="blue">{count} صنف</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          border: "2px solid #FECACA",
                          background: "#FEF2F2",
                          color: "#DC2626",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#DC2626";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.borderColor = "#DC2626";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#FEF2F2";
                          e.currentTarget.style.color = "#DC2626";
                          e.currentTarget.style.borderColor = "#FECACA";
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                        </svg>
                        حذف
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
