import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/layout/TopBar";
import AdminSidebar from "../components/admin/AdminSidebar";
import Dashboard from "../components/admin/Dashboard";
import ManageItems from "../components/admin/ManageItems";
import AddItem from "../components/admin/AddItem";
import Orders from "../components/admin/Orders";
import Categories from "../components/admin/Categories";
import ManageUsers from "../components/admin/ManageUsers";

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

  // Desktop: sidebar collapsed/expanded
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Mobile: drawer open/closed
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    if (windowWidth >= 768) {
      setSidebarOpen((v) => !v); // desktop: collapse/expand
    } else {
      setDrawerOpen((v) => !v); // mobile: drawer
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: "100vh", overflow: "hidden", background: "#F8FAFC" }}
    >
      <TopBar isAdmin sidebarOpen={sidebarOpen} onMenuToggle={toggleMenu} />

      <div className="flex flex-1 min-h-0">
        {/* ── Main content ── */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-7 min-w-0"
          style={{
            marginRight:
              windowWidth >= 768 ? (sidebarOpen ? 240 : 64) : undefined,
            transition: "margin-right .3s",
          }}
        >
          {SECTIONS[adminTab] ?? <Dashboard />}
        </main>

        {/* ── Mobile overlay ── */}
        {drawerOpen && (
          <div
            className="fixed inset-0 md:hidden"
            onClick={() => setDrawerOpen(false)}
            style={{
              zIndex: 200,
              background: "rgba(7,30,61,0.5)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}

        {/* ── Desktop sidebar overlay on right ── */}
        <div
          className="hidden md:flex flex-col transition-all duration-300"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: sidebarOpen ? 240 : 64,
            zIndex: 150,
            boxShadow: "-6px 0 40px rgba(7,30,61,0.2)",
          }}
        >
          <AdminSidebar
            collapsed={!sidebarOpen}
            onNav={() => {}}
            onToggle={() => setSidebarOpen((v) => !v)}
          />
        </div>

        {/* ── Mobile drawer (slides from right, RTL) ── */}
        <div
          className={`fixed top-0 right-0 bottom-0 md:hidden flex flex-col transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{
            zIndex: 201,
            width: 240,
            boxShadow: "-6px 0 40px rgba(7,30,61,0.2)",
          }}
        >
          {/* Drawer header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#0B3D91,#1565C0)",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/15 border border-white/25">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-black text-white text-sm">
                لوحة الإدارة
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
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
          <div
            className="flex-1 overflow-y-auto"
            style={{ background: "#F8FAFC" }}
          >
            <AdminSidebar
              collapsed={false}
              onNav={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
