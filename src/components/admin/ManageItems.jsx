import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import { typeAr, EMOJIS } from "../../data/db";

export default function ManageItems() {
  const { DB, toggleAvail, deleteItem, saveEditItem, setAdminTab } = useApp();
  const [filter, setFilter] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImg, setEditImg] = useState(null);

  const items = DB.items.filter(
    (i) => !filter || i.name.includes(filter) || i.desc?.includes(filter),
  );

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({
      name: item.name,
      price: item.price,
      desc: item.desc || "",
      icon: item.icon,
      item_type: item.type || "buy",
    });
    setEditImg(item.image || null);
  };

  const handleEditImg = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => {
      setEditImg(e.target.result);
      setEditForm((f) => ({ ...f, image: e.target.result }));
    };
    r.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!editForm.name || isNaN(editForm.price)) return;
    saveEditItem(editItem.id, {
      name: editForm.name,
      price: Number(editForm.price),
      desc: editForm.desc,
      icon: editForm.icon,
      image: editImg,
      type: editForm.item_type,
    });
    setEditItem(null);
  };

  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Toolbar */}
      <div
        className="bg-white rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
        style={{ border: "2px solid #E2E8F0" }}
      >
        <div className="font-black text-slate-800 flex-1">
          🍔 جميع الأصناف
          <span className="text-slate-400 font-semibold text-sm mr-2">
            ({items.length})
          </span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-48">
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="بحث..."
              className="field-input pr-9 text-sm rounded-2xl py-2.5"
              style={{ borderRadius: 16 }}
            />
          </div>
          <button
            onClick={() => setAdminTab("add-item")}
            className="btn-primary-gradient px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap flex items-center gap-1.5"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            إضافة
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="block md:hidden space-y-3">
        {items.length === 0 && (
          <div
            className="bg-white rounded-3xl p-10 text-center text-slate-400"
            style={{ border: "2px solid #E2E8F0" }}
          >
            لا توجد أصناف
          </div>
        )}
        {items.map((item) => {
          const cat = DB.categories.find((c) => c.id === item.cat);
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden"
              style={{ border: "2px solid #E2E8F0" }}
            >
              <div className="flex gap-3 p-4">
                {/* Thumbnail */}
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">
                    {item.name}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat && (
                      <Badge variant="blue">
                        {cat.icon} {cat.name}
                      </Badge>
                    )}
                    <Badge variant="orange">{typeAr(item.type)}</Badge>
                  </div>
                  <div className="font-black text-blue-main text-sm mt-1">
                    {item.price.toLocaleString("ar")} د.ع
                  </div>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                  <button
                    onClick={() => toggleAvail(item.id)}
                    className={`toggle-track ${item.available ? "on" : ""}`}
                  />
                  <button
                    onClick={() => openEdit(item)}
                    className="btn-primary-gradient px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                      color: "#DC2626",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div
        className="hidden md:block bg-white rounded-3xl overflow-hidden"
        style={{ border: "2px solid #E2E8F0" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr
                style={{
                  background: "#F1F5F9",
                  borderBottom: "2px solid #E2E8F0",
                }}
              >
                {[
                  "الصنف",
                  "الصورة",
                  "الفئة",
                  "السعر",
                  "النوع",
                  "التوفر",
                  "إجراءات",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-right px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    لا توجد أصناف
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const cat = DB.categories.find((c) => c.id === item.cat);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-bold text-sm text-slate-800">
                              {item.name}
                            </div>
                            {item.desc && (
                              <div className="text-xs text-slate-400 truncate max-w-[160px]">
                                {item.desc}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-10 object-cover rounded-xl"
                            style={{ border: "2px solid #E2E8F0" }}
                          />
                        ) : (
                          <span
                            className="text-xs text-slate-400 px-2.5 py-1 rounded-xl"
                            style={{
                              background: "#F1F5F9",
                              border: "1px solid #E2E8F0",
                            }}
                          >
                            بدون صورة
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="blue">
                          {cat ? `${cat.icon} ${cat.name}` : "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-black text-sm text-blue-main">
                        {item.price.toLocaleString("ar")}{" "}
                        <span className="text-slate-400 font-normal text-xs">
                          د.ع
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="orange">{typeAr(item.type)}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAvail(item.id)}
                          className={`toggle-track ${item.available ? "on" : ""}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openEdit(item)}
                            className="btn-primary-gradient px-3.5 py-1.5 rounded-xl text-xs font-bold"
                          >
                            ✏️ تعديل
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:text-white"
                            style={{
                              background: "#FEF2F2",
                              border: "1px solid #FECACA",
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
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title="✏️ تعديل الصنف"
        maxWidth="max-w-lg"
      >
        {editItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                الاسم
              </label>
              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
                className="field-input"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                السعر (د.ع)
              </label>
              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, price: e.target.value }))
                }
                className="field-input"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                الوصف
              </label>
              <textarea
                value={editForm.desc}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, desc: e.target.value }))
                }
                rows={2}
                className="field-input resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                نوع التحضير
              </label>
              <select
                value={editForm.item_type}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, item_type: e.target.value }))
                }
                className="field-input"
              >
                <option value="buy">🛍️ جاهز للشراء</option>
                <option value="cook">🍳 تحضير طازج</option>
                <option value="both">✨ كلاهما</option>
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                📸 الصورة
              </label>
              {editImg ? (
                <div className="relative">
                  <img
                    src={editImg}
                    alt="preview"
                    className="w-full h-36 object-cover rounded-2xl"
                    style={{ border: "2px solid #E2E8F0" }}
                  />
                  <button
                    onClick={() => setEditImg(null)}
                    className="absolute top-2 left-2 w-7 h-7 rounded-xl bg-red-600 text-white text-xs flex items-center justify-center shadow"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl cursor-pointer transition-all"
                  style={{
                    border: "2px dashed #94a3b8",
                    background: "#F8FAFC",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#1565C0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#94a3b8")
                  }
                >
                  <span className="text-3xl">📸</span>
                  <span className="text-sm text-blue-main font-bold">
                    انقر لرفع صورة
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleEditImg(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            {/* Emoji picker */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">
                🎨 الأيقونة{" "}
                <span className="text-slate-400 font-normal text-xs">
                  (عند غياب الصورة)
                </span>
              </label>
              <div
                className="grid gap-1.5"
                style={{
                  gridTemplateColumns: "repeat(auto-fill,minmax(38px,1fr))",
                }}
              >
                {EMOJIS.slice(0, 40).map((e) => (
                  <button
                    key={e}
                    onClick={() => setEditForm((f) => ({ ...f, icon: e }))}
                    className={`emoji-opt w-9 h-9 rounded-xl border-2 text-xl flex items-center justify-center ${editForm.icon === e ? "selected" : "border-slate-200"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                className="btn-primary-gradient flex-1 py-3 rounded-2xl font-bold"
              >
                💾 حفظ
              </button>
              <button
                onClick={() => setEditItem(null)}
                className="px-5 py-3 rounded-2xl font-bold transition-all"
                style={{
                  border: "2px solid #CBD5E1",
                  color: "#475569",
                  background: "white",
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
