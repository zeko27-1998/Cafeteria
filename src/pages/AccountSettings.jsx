import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopBar from "../components/layout/TopBar";
import MobileBottomNav from "../components/user/MobileBottomNav";
import EyeIcon from "../components/ui/EyeIcon";

function PwField({
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
  extra,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-600 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`field-input pl-12 ${extra || ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-main hover:border-blue-main transition-all"
        >
          <EyeIcon open={show} size={16} />
        </button>
      </div>
    </div>
  );
}

export default function AccountSettings() {
  const {
    currentUser,
    updateSelfProfile,
    getTransactions,
    toast,
    isAdmin,
    DB,
  } = useApp();
  const navigate = useNavigate();
  const backPath = isAdmin ? "/admin" : "/menu";

  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [dept, setDept] = useState(currentUser?.dept || "");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [saving, setSaving] = useState(false);

  const balance =
    currentUser?.role !== "superadmin"
      ? (DB.accounts.find((a) => a.id === currentUser?.id)?.balance ?? 0)
      : 0;
  const debt =
    currentUser?.role !== "superadmin"
      ? (DB.accounts.find((a) => a.id === currentUser?.id)?.debt ?? 0)
      : 0;

  const transactions =
    currentUser?.role !== "superadmin" ? getTransactions(currentUser?.id) : [];
  const totalDeposited = transactions
    .filter((t) => t.type === "deposit")
    .reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions
    .filter((t) => t.type === "deduct")
    .reduce((s, t) => s + t.amount, 0);

  const saveProfile = async () => {
    if (!name.trim()) {
      toast("الاسم مطلوب", "error");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 250));
    updateSelfProfile({
      name: name.trim(),
      phone: phone.trim(),
      dept: dept.trim(),
    });
    setSaving(false);
  };

  const changePw = async () => {
    if (!newPw) {
      toast("أدخل كلمة المرور الجديدة", "error");
      return;
    }
    if (newPw !== confPw) {
      toast("كلمتا المرور غير متطابقتان", "error");
      return;
    }
    if (newPw.length < 4) {
      toast("كلمة المرور قصيرة جداً", "error");
      return;
    }
    if (currentUser?.role !== "superadmin") {
      if (!oldPw) {
        toast("أدخل كلمة المرور الحالية", "error");
        return;
      }
      if (oldPw !== currentUser?.password) {
        toast("كلمة المرور الحالية غير صحيحة", "error");
        return;
      }
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 250));
    updateSelfProfile({ password: newPw });
    setOldPw("");
    setNewPw("");
    setConfPw("");
    setSaving(false);
  };

  const pwStr = !newPw
    ? 0
    : newPw.length < 4
      ? 1
      : newPw.length < 7
        ? 2
        : newPw.length < 10
          ? 3
          : 4;
  const pwC = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-emerald-500",
  ];
  const pwL = ["", "ضعيفة جداً ⚠️", "ضعيفة", "متوسطة", "قوية ✓"];

  const ROLE_COLORS = {
    superadmin: "bg-red-100 text-red-700",
    admin: "bg-blue-100 text-blue-700",
    user: "bg-emerald-100 text-emerald-700",
  };
  const ROLE_LABEL = {
    superadmin: "🔑 سوبر أدمن",
    admin: "🛡️ مدير",
    user: "👤 موظف",
  };

  const TABS = [
    { key: "profile", label: "👤 ملفي" },
    { key: "password", label: "🔒 كلمة المرور" },
    ...(!isAdmin ? [{ key: "wallet", label: "💰 محفظتي" }] : []),
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F8FAFC" }}
    >
      <TopBar isAdmin={isAdmin} />
      <main className="flex-1 px-4 py-5 max-w-xl w-full mx-auto pb-24 sm:pb-6">
        {/* Back */}
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-sm font-bold text-blue-main mb-5 hover:underline"
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {isAdmin ? "لوحة الإدارة" : "القائمة"}
        </button>

        {/* Profile card */}
        <div
          className="bg-white rounded-3xl p-5 mb-5"
          style={{ border: "2px solid #E2E8F0" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl text-white text-2xl font-black flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#1565C0,#1E88E5)" }}
            >
              {(currentUser?.name || "?")[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-slate-800 text-lg leading-tight">
                {currentUser?.name}
              </div>
              <div className="text-sm text-slate-400 font-mono mt-0.5">
                {currentUser?.username || "superadmin"}
              </div>
              {currentUser?.dept && (
                <div className="text-xs text-blue-main font-semibold mt-0.5">
                  🏢 {currentUser.dept}
                </div>
              )}
              {currentUser?.phone && (
                <div className="text-xs text-slate-400 font-mono">
                  {currentUser.phone}
                </div>
              )}
              {debt > 0 && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-red-500/25 border border-red-200/40 rounded-full px-3 py-1.5 text-xs font-semibold">
                  دين عليك: {debt.toLocaleString("ar")} د.ع
                </div>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[currentUser?.role]}`}
              >
                {ROLE_LABEL[currentUser?.role]}
              </span>
              {!isAdmin && (
                <div className="mt-2">
                  <div className="text-[10px] text-slate-400">رصيدي</div>
                  <div
                    className={`font-black text-xl ${balance > 0 ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {balance.toLocaleString("ar")}
                  </div>
                  <div className="text-[10px] text-slate-400">د.ع</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 rounded-2xl p-1 mb-5"
          style={{ background: "#F1F5F9", border: "2px solid #E2E8F0" }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all"
              style={{
                background: tab === t.key ? "white" : "transparent",
                color: tab === t.key ? "#1565C0" : "#64748B",
                boxShadow:
                  tab === t.key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === "profile" && (
          <div
            className="bg-white rounded-3xl p-5 space-y-4 animate-fade-in-up"
            style={{ border: "2px solid #E2E8F0" }}
          >
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                الاسم الكامل
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                رقم الهاتف{" "}
                <span className="text-slate-400 text-xs font-normal">
                  (اختياري)
                </span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07xxxxxxxx"
                className="field-input"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                القسم / الدائرة{" "}
                <span className="text-slate-400 text-xs font-normal">
                  (اختياري)
                </span>
              </label>
              <input
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="مثال: قسم المحاسبة"
                className="field-input"
              />
            </div>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="btn-primary-gradient w-full py-3.5 rounded-2xl font-bold gap-2"
            >
              {saving && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  style={{ animation: "spin .7s linear infinite" }}
                />
              )}
              💾 حفظ المعلومات
            </button>
          </div>
        )}

        {/* Password tab */}
        {tab === "password" && (
          <div
            className="bg-white rounded-3xl p-5 space-y-4 animate-fade-in-up"
            style={{ border: "2px solid #E2E8F0" }}
          >
            {currentUser?.role !== "superadmin" && (
              <PwField
                label="كلمة المرور الحالية"
                value={oldPw}
                onChange={setOldPw}
                show={showOld}
                setShow={setShowOld}
                placeholder="أدخل كلمة المرور الحالية"
              />
            )}
            <PwField
              label="كلمة المرور الجديدة"
              value={newPw}
              onChange={setNewPw}
              show={showNew}
              setShow={setShowNew}
              placeholder="اختر كلمة مرور قوية"
            />
            {newPw && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${i <= pwStr ? pwC[pwStr] : "bg-slate-200"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 font-semibold">
                  {pwL[pwStr]}
                </p>
              </div>
            )}
            <PwField
              label="تأكيد كلمة المرور"
              value={confPw}
              onChange={setConfPw}
              show={showConf}
              setShow={setShowConf}
              placeholder="أعد إدخال كلمة المرور"
              extra={
                confPw
                  ? confPw === newPw
                    ? "border-emerald-400"
                    : "border-red-400"
                  : ""
              }
            />
            {confPw && (
              <p
                className={`text-xs font-bold ${confPw === newPw ? "text-emerald-600" : "text-red-500"}`}
              >
                {confPw === newPw
                  ? "✓ كلمتا المرور متطابقتان"
                  : "✗ كلمتا المرور غير متطابقتين"}
              </p>
            )}
            <button
              onClick={changePw}
              disabled={saving}
              className="btn-success-gradient w-full py-3.5 rounded-2xl font-bold gap-2"
            >
              {saving && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  style={{ animation: "spin .7s linear infinite" }}
                />
              )}
              🔒 تحديث كلمة المرور
            </button>
          </div>
        )}

        {/* Wallet tab */}
        {tab === "wallet" && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Balance card */}
            <div
              className="relative overflow-hidden rounded-3xl p-6 text-white"
              style={{
                background: "linear-gradient(135deg,#071E3D,#0D47A1,#1565C0)",
              }}
            >
              <div
                className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-10"
                style={{
                  background: "radial-gradient(circle,#fff 0%,transparent 70%)",
                }}
              />
              <div className="text-sm opacity-70 font-semibold mb-1">
                💰 رصيدك الحالي
              </div>
              <div className="text-5xl font-black mb-0.5">
                {balance.toLocaleString("ar")}
              </div>
              <div className="text-sm opacity-60 font-semibold">
                دينار عراقي
              </div>
              {balance < 5000 && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold">
                  ⚠️ رصيد منخفض — تواصل مع المدير
                </div>
              )}
              {debt > 0 && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-red-500/25 border border-red-200/40 rounded-full px-3 py-1.5 text-xs font-semibold">
                  دين عليك: {debt.toLocaleString("ar")} د.ع
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: "⬇️",
                  label: "إجمالي الإيداعات",
                  val: totalDeposited,
                  c: "text-emerald-600",
                  bg: "bg-emerald-50",
                  br: "border-emerald-200",
                },
                {
                  icon: "🛒",
                  label: "إجمالي الإنفاق",
                  val: totalSpent,
                  c: "text-blue-main",
                  bg: "bg-blue-50",
                  br: "border-blue-200",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl border-2 p-4 ${s.bg} ${s.br}`}
                >
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`font-black text-lg ${s.c}`}>
                    {s.val.toLocaleString("ar")}{" "}
                    <span className="text-xs text-slate-400 font-semibold">
                      د.ع
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Transactions */}
            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{ border: "2px solid #E2E8F0" }}
            >
              <div
                className="px-4 py-3 flex items-center gap-2 font-bold text-slate-800 text-sm"
                style={{ borderBottom: "2px solid #F1F5F9" }}
              >
                <span className="section-title-accent" /> سجل المعاملات
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-sm font-semibold">لا توجد معاملات بعد</p>
                  </div>
                ) : (
                  [...transactions].reverse().map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${tx.type === "deposit" ? "bg-emerald-100" : "bg-blue-50"}`}
                      >
                        {tx.type === "deposit" ? "💰" : "🛒"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-700">
                          {tx.note}
                        </div>
                        <div className="text-xs text-slate-400">
                          {tx.date} — {tx.time}
                        </div>
                      </div>
                      <div
                        className={`font-black text-sm flex-shrink-0 ${tx.type === "deposit" ? "text-emerald-600" : "text-blue-main"}`}
                      >
                        {tx.type === "deposit" ? "+" : "-"}
                        {tx.amount.toLocaleString("ar")}{" "}
                        <span className="text-xs opacity-70">د.ع</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {!isAdmin && <MobileBottomNav />}
    </div>
  );
}
