import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { EMOJIS } from "../../data/db";

const EMPTY = {
  name: "",
  cat: "",
  price: "",
  type: "buy",
  desc: "",
  icon: "🍽️",
  image: null,
};

function SectionCard({ title, children }) {
  return (
    <div
      className="bg-white rounded-3xl p-6 space-y-4"
      style={{ border: "2px solid #E2E8F0" }}
    >
      <div className="font-black text-slate-800 text-sm">{title}</div>
      {children}
    </div>
  );
}

export default function AddItem({ onSaved }) {
  const { DB, addItem, toast } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [prev, setPrev] = useState(null);
  const [imgLoad, setImgLoad] = useState(false);
  const fileRef = useRef(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("حجم الصورة يتجاوز 5MB", "error");
      return;
    }
    setImgLoad(true);
    const r = new FileReader();
    r.onload = (e) => {
      setPrev(e.target.result);
      set("image", e.target.result);
      setImgLoad(false);
    };
    r.readAsDataURL(file);
  };

  const removeImg = () => {
    setPrev(null);
    set("image", null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.cat ||
      isNaN(Number(form.price)) ||
      !form.price
    ) {
      toast("ملء الحقول الإلزامية * مطلوب", "error");
      return;
    }
    addItem({
      name: form.name.trim(),
      cat: Number(form.cat),
      price: Number(form.price),
      type: form.type,
      icon: form.icon,
      image: form.image,
      desc: form.desc.trim(),
    });
    setForm(EMPTY);
    removeImg();
    onSaved?.();
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      <div className="flex items-center gap-2 text-lg font-black text-slate-800">
        <span className="section-title-accent" /> إضافة صنف جديد
      </div>

      {/* Info */}
      <SectionCard title="🍽️ معلومات الصنف">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              الاسم <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="مثال: برجر دجاج"
              className="field-input"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              الفئة <span className="text-red-500">*</span>
            </label>
            <select
              value={form.cat}
              onChange={(e) => set("cat", e.target.value)}
              className="field-input"
            >
              <option value="">— اختر —</option>
              {DB.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              السعر (د.ع) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0"
              min="0"
              step="250"
              className="field-input"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              نوع التحضير
            </label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="field-input"
            >
              <option value="buy">🛍️ جاهز للشراء</option>
              <option value="cook">🍳 تحضير طازج</option>
              <option value="both">✨ كلاهما</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              الوصف
            </label>
            <textarea
              value={form.desc}
              onChange={(e) => set("desc", e.target.value)}
              rows={2}
              placeholder="وصف مختصر..."
              className="field-input resize-none"
            />
          </div>
        </div>
      </SectionCard>

      {/* Image upload */}
      <SectionCard title="📸 صورة الصنف">
        <p className="text-xs text-slate-400 -mt-2">
          اختياري — تظهر في القائمة بدلاً من الأيقونة
        </p>
        {prev ? (
          <div className="relative max-w-xs">
            <img
              src={prev}
              alt="preview"
              className="w-full h-44 object-cover rounded-2xl"
              style={{ border: "2px solid #E2E8F0" }}
            />
            <button
              onClick={removeImg}
              className="absolute top-2 left-2 w-8 h-8 rounded-xl bg-red-600 text-white text-sm flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
            >
              ✕
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-2 left-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 text-blue-main transition-all"
              style={{ border: "1px solid #BFDBFE" }}
            >
              🔄 تغيير
            </button>
          </div>
        ) : (
          <div
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 p-10 rounded-2xl cursor-pointer transition-all text-center"
            style={{ border: "2px dashed #94a3b8", background: "#F8FAFC" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#1565C0";
              e.currentTarget.style.background = "#EFF6FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#94a3b8";
              e.currentTarget.style.background = "#F8FAFC";
            }}
          >
            {imgLoad ? (
              <div
                className="w-8 h-8 border-4 border-blue-100 border-t-blue-main rounded-full"
                style={{ animation: "spin .7s linear infinite" }}
              />
            ) : (
              <>
                <div className="text-4xl">📸</div>
                <div className="text-sm font-bold text-slate-500">
                  اسحب الصورة هنا أو{" "}
                  <span className="text-blue-main">انقر للاختيار</span>
                </div>
                <div className="text-xs text-slate-400">
                  PNG, JPG, WEBP — حتى 5MB
                </div>
              </>
            )}
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </SectionCard>

      {/* Emoji */}
      <SectionCard title="🎨 الأيقونة">
        <p className="text-xs text-slate-400 -mt-2">تُستخدم عند غياب الصورة</p>
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(40px,1fr))" }}
        >
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => set("icon", e)}
              className={`emoji-opt w-10 h-10 rounded-xl border-2 text-xl flex items-center justify-center ${form.icon === e ? "selected" : "border-slate-200"}`}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <span className="text-sm text-slate-400 font-semibold">المختار:</span>
          <span className="text-4xl">{form.icon}</span>
        </div>
      </SectionCard>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="btn-primary-gradient flex-1 sm:flex-none px-10 py-3.5 rounded-2xl font-bold text-[15px]"
        >
          💾 حفظ الصنف
        </button>
        <button
          onClick={() => {
            setForm(EMPTY);
            removeImg();
          }}
          className="px-6 py-3.5 rounded-2xl font-bold transition-all"
          style={{
            border: "2px solid #CBD5E1",
            color: "#475569",
            background: "white",
          }}
        >
          ↺ مسح
        </button>
      </div>
    </div>
  );
}
