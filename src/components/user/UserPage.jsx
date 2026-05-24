import TopBar from "../layout/TopBar";
import HeroBanner from "./HeroBanner";
import OrderTypeStrip from "./OrderTypeStrip";
import CategoryChips from "./CategoryChips";
import MenuGrid from "./MenuGrid";
import ItemDetailModal from "./ItemDetailModal";
import ConfirmOrderModal from "./ConfirmOrderModal";
import { useApp } from "../../context/AppContext";

export default function UserPage() {
  const { searchTerm, setSearchTerm } = useApp();

  return (
    <div className="min-h-screen flex flex-col animate-fade-in-up">
      <TopBar />

      <main className="flex-1 px-6 py-6 max-w-[1100px] w-full mx-auto">
        <HeroBanner />
        <OrderTypeStrip />

        {/* Search */}
        <div className="flex gap-2 items-center mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
              🔍
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن صنف..."
              className="field-input w-full py-3 pr-4 pl-11 rounded-full bg-white text-[15px]"
            />
          </div>
        </div>

        <CategoryChips />
        <MenuGrid />
      </main>

      <ItemDetailModal />
      <ConfirmOrderModal />
    </div>
  );
}
