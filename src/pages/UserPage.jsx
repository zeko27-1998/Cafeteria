import TopBar from "../components/layout/TopBar";
import HeroBanner from "../components/user/HeroBanner";
import OrderTypeStrip from "../components/user/OrderTypeStrip";
import CategoryChips from "../components/user/CategoryChips";
import MenuGrid from "../components/user/MenuGrid";
import ItemDetailModal from "../components/user/ItemDetailModal";
import ConfirmOrderModal from "../components/user/ConfirmOrderModal";
import MobileBottomNav from "../components/user/MobileBottomNav";
import { useApp } from "../context/AppContext";

export default function UserPage() {
  const { searchTerm, setSearchTerm } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 animate-fade-in-up">
      <TopBar />

      <main className="flex-1 px-3 sm:px-5 py-4 max-w-[1100px] w-full mx-auto pb-24 sm:pb-6">
        <HeroBanner />
        <OrderTypeStrip />

        {/* ── Search bar — icon on LEFT (end of RTL text) ── */}
        <div className="mb-4 relative">
          {/* Search icon — LEFT side so it doesn't overlap Arabic placeholder */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 z-10">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن أي صنف..."
            className="field-input rounded-full pr-5 pl-12"
            style={{ paddingLeft: "3rem", paddingRight: "1.25rem" }}
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute left-11 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-all text-xs"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <CategoryChips />
        <MenuGrid />
      </main>

      <MobileBottomNav />
      <ItemDetailModal />
      <ConfirmOrderModal />
    </div>
  );
}
