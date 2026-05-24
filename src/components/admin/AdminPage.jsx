import { useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../layout/TopBar";
import AdminSidebar from "./AdminSidebar";
import Dashboard from "./Dashboard";
import ManageItems from "./ManageItems";
import AddItem from "./AddItem";
import Orders from "./Orders";
import Categories from "./Categories";
import ManageUsers from "./ManageUsers";

const SECTIONS = {
  dashboard: <Dashboard />,
  items: <ManageItems />,
  "add-item": <AddItem />,
  orders: <Orders />,
  categories: <Categories />,
  users: <ManageUsers />,
};

export default function AdminPage() {
  const { adminTab } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col animate-fade-in-up bg-slate-50">
      <TopBar isAdmin onMenuToggle={() => setDrawerOpen((o) => !o)} />

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* ── Desktop sidebar ── */}
        <div className="hidden md:block flex-shrink-0">
          <AdminSidebar onNav={() => {}} />
        </div>

        {/* ── Mobile drawer overlay ── */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-[200] md:hidden"
            style={{
              background: "rgba(11,61,145,0.35)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* ── Mobile sidebar drawer ── */}
        <div
          className={`
          fixed top-0 right-0 bottom-0 z-[201] w-[260px] bg-white shadow-blue-lg
          transition-transform duration-300 md:hidden flex flex-col
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="logo"
                className="w-8 h-8 rounded-full object-contain border border-blue-pale"
              />
              <span className="font-black text-blue-deep text-sm">
                لوحة الإدارة
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-all"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminSidebar onNav={() => setDrawerOpen(false)} />
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 p-4 md:p-7 overflow-y-auto bg-slate-50 min-w-0">
          {SECTIONS[adminTab] ?? <Dashboard />}
        </main>
      </div>
    </div>
  );
}
