import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import EyeIcon from "../ui/EyeIcon";
import { ROLE_AR, ROLE_BADGE } from "../../data/db";

const EMPTY = { name: "", username: "", password: "1234", role: "user" };

export default function ManageUsers() {
  const { DB, role, addAccount, deleteAccount, toast } = useApp();
  const isSA = role === "superadmin";
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [showPw, setShowPw] = useState(false);

  const visibleAccounts = isSA
    ? DB.accounts
    : DB.accounts.filter((a) => a.role === "user");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) {
      toast("ملء جميع الحقول مطلوب", "error");
      return;
    }
    const ok = addAccount(form);
    if (!ok) return;
    setForm(EMPTY);
    setShowPw(false);
    setAddOpen(false);
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="section-title-accent" />
          <h2 className="text-lg font-black text-slate-800">المستخدمون</h2>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY);
            setAddOpen(true);
          }}
          className="btn-primary-gradient px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          مستخدم جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat
          label="عدد المستخدمين"
          value={visibleAccounts.filter((a) => a.role === "user").length}
        />
      </div>

      <div className="block md:hidden space-y-3">
        {visibleAccounts.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center text-slate-400">
            لا توجد حسابات
          </div>
        ) : (
          visibleAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                <Avatar name={acc.name} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">{acc.name}</div>
                  <code className="text-xs text-slate-400 font-mono">{acc.username}</code>
                </div>
                <Badge variant={ROLE_BADGE[acc.role]}>{ROLE_AR[acc.role]}</Badge>
              </div>
              <div className="flex justify-end px-4 pb-4">
                <button
                  onClick={() => deleteAccount(acc.id)}
                  className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                {["#", "الاسم", "اسم المستخدم", "الدور", "إجراءات"].map((h) => (
                  <th key={h} className="text-right px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    لا توجد حسابات
                  </td>
                </tr>
              ) : (
                visibleAccounts.map((acc) => (
                  <tr key={acc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-sm font-mono">#{acc.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={acc.name} />
                        <div>
                          <div className="font-bold text-sm text-slate-800">{acc.name}</div>
                          {acc.dept && <div className="text-xs text-slate-400">{acc.dept}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-600">
                        {acc.username}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_BADGE[acc.role]}>{ROLE_AR[acc.role]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteAccount(acc.id)}
                        className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setForm(EMPTY);
          setShowPw(false);
        }}
        title="إضافة مستخدم جديد"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <Field label="الاسم الكامل" required>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="مثال: أحمد علي"
              className="field-input"
            />
          </Field>
          <Field label="اسم المستخدم" required>
            <input
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="ahmed2025"
              className="field-input"
            />
          </Field>
          <Field label="كلمة المرور" required>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="field-input pl-11"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-main hover:border-blue-main transition-all"
              >
                <EyeIcon open={showPw} size={15} />
              </button>
            </div>
          </Field>
          <div className="flex gap-3 pt-1">
            <button onClick={handleAdd} className="btn-primary-gradient flex-1 py-3 rounded-full font-bold">
              إضافة المستخدم
            </button>
            <button
              onClick={() => setAddOpen(false)}
              className="border-2 border-slate-200 text-slate-600 px-5 py-3 rounded-full font-bold hover:bg-slate-50 transition-all"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4">
      <div className="text-2xl font-black text-blue-main">{value}</div>
      <div className="text-xs text-slate-500 font-semibold mt-0.5">{label}</div>
    </div>
  );
}

function Avatar({ name }) {
  return (
    <div
      className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg,#1565C0,#1E88E5)" }}
    >
      {(name || "?")[0]}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
