import { useApp } from "../../context/AppContext";
import { dbGetItems } from "../../data/db";
import MenuCard from "./MenuCard";

const SECTION_LABEL = {
  buy: "🛍️ وجبات جاهزة للشراء",
  cook: "🍳 وجبات تُحضَّر عند الطلب",
  custom: "✏️ جميع الأصناف — طلب مخصص",
  null: "🍴 القائمة الكاملة",
};

export default function MenuGrid() {
  const { activeCat, searchTerm, orderType } = useApp();
  const items = dbGetItems(activeCat, searchTerm, orderType);

  return (
    <>
      <div className="flex items-center gap-2 text-base font-black text-blue-deep mb-4">
        <span className="section-title-accent" />
        {SECTION_LABEL[orderType] || SECTION_LABEL["null"]}
        <span className="text-sm font-semibold text-slate-400 mr-1">
          ({items.length} صنف)
        </span>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))" }}
      >
        {items.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-400">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-base font-semibold">لا توجد أصناف مطابقة</p>
            <p className="text-sm mt-1">جرّب تغيير نوع الطلب أو الفئة</p>
          </div>
        ) : (
          items.map((item) => <MenuCard key={item.id} item={item} />)
        )}
      </div>
    </>
  );
}
