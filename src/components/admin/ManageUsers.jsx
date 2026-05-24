import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import { ROLE_AR, ROLE_BADGE } from "../../data/db";

const EMPTY = { name: "", username: "", password: "1234", role: "user" };
const QUICK = [5000, 10000, 15000, 25000, 50000];

export default function ManageUsers() {
  const {
    DB,
    role,
    addAccount,
    deleteAccount,
    depositBalance,
    getTransactions,
    toast,
  } = useApp();
  const isSA = role === "superadmin";

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [showFormPw, setShowFormPw] = useState(false);
  const [walletAcc, setWalletAcc] = useState(null);
  const [walletMode, setWalletMode] = useState("deposit");
  const [walletAmt, setWalletAmt] = useState("");
  const [txAcc, setTxAcc] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const visibleAccounts = isSA
    ? DB.accounts
    : DB.accounts.filter((a) => a.role === "user");
  const allowedRoles = isSA
    ? [
        { value: "admin", label: "مدير 🛡️" },
        { value: "user", label: "موظف 👤" },
      ]
    : [{ value: "user", label: "موظف 👤" }];

  const handleAdd = () => {
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) {
      toast("ملء جميع الحقول مطلوب", "error");
      return;
    }
    const ok = addAccount(form);
    if (ok) {
      setForm(EMPTY);
      setAddOpen(false);
      setShowFormPw(false);
    }
  };

  const openWallet = (acc, mode) => {
    setWalletAcc(acc);
    setWalletMode(mode);
    setWalletAmt("");
  };

  const handleWallet = () => {
    const amt = parseFloat(walletAmt);
    if (!amt || amt <= 0) {
      toast("أدخل مبلغاً صحيحاً", "error");
      return;
    }
    const liveAcc = DB.accounts.find((a) => a.id === walletAcc.id);
    if (walletMode === "deduct" && (liveAcc?.balance || 0) < amt) {
      toast(
        `رصيد غير كافٍ — الرصيد: ${(liveAcc?.balance || 0).toLocaleString("ar")} د.ع`,
        "error",
      );
      return;
    }
    const ok = depositBalance(
      walletAcc.id,
      walletMode === "deduct" ? -amt : amt,
    );
    if (ok) {
      setWalletAmt("");
      setWalletAcc(null);
    }
  };

  const totalDeposited = DB.transactions
    .filter((t) => t.type === "deposit")
    .reduce((s, t) => s + t.amount, 0);
  const totalSpent = DB.transactions
    .filter((t) => t.type === "deduct")
    .reduce((s, t) => s + t.amount, 0);
  const totalBalances = DB.accounts.reduce((s, a) => s + (a.balance || 0), 0);

  // EyeIcon SVG inline (no emoji)
  const Eye = ({ open }) =>
    open ? (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="section-title-accent" />
          <h2 className="text-lg font-black text-slate-800">
            إدارة الحسابات والمحافظ
          </h2>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY);
            setAddOpen(true);
          }}
          className="btn-primary-gradient px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          حساب جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            icon: "💰",
            label: "إجمالي الإيداعات",
            val: totalDeposited,
            c: "text-emerald-600",
            bg: "bg-emerald-50",
            br: "border-emerald-200",
          },
          {
            icon: "🛒",
            label: "إجمالي المشتريات",
            val: totalSpent,
            c: "text-blue-600",
            bg: "bg-blue-50",
            br: "border-blue-200",
          },
          {
            icon: "💳",
            label: "الأرصدة الحالية",
            val: totalBalances,
            c: "text-violet-600",
            bg: "bg-violet-50",
            br: "border-violet-200",
            span: true,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border-2 p-4 ${s.bg} ${s.br} ${s.span ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-xl font-black ${s.c}`}>
              {s.val.toLocaleString("ar")}{" "}
              <span className="text-xs font-semibold text-slate-400">د.ع</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="block md:hidden space-y-3">
        {visibleAccounts.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center text-slate-400">
            لا توجد حسابات
          </div>
        )}
        {visibleAccounts.map((acc) => {
          const live = DB.accounts.find((a) => a.id === acc.id);
          return (
            <div
              key={acc.id}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                <div
                  className="w-11 h-11 rounded-full text-white font-black text-base flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#1565C0,#1E88E5)",
                  }}
                >
                  {acc.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800">{acc.name}</div>
                  <code className="text-xs text-slate-400 font-mono">
                    {acc.username}
                  </code>
                </div>
                <Badge variant={ROLE_BADGE[acc.role]}>
                  {ROLE_AR[acc.role]}
                </Badge>
              </div>
              <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-l from-blue-50 to-white">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">
                    الرصيد
                  </div>
                  <div
                    className={`text-xl font-black ${(live?.balance || 0) > 0 ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {(live?.balance || 0).toLocaleString("ar")}{" "}
                    <span className="text-xs text-slate-400">د.ع</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openWallet(acc, "deposit")}
                    className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all"
                  >
                    + إيداع
                  </button>
                  <button
                    onClick={() => openWallet(acc, "deduct")}
                    className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all"
                  >
                    − خصم
                  </button>
                </div>
              </div>
              <div className="px-4 py-3 flex gap-2">
                <button
                  onClick={() => setTxAcc(acc)}
                  className="flex-1 py-2 rounded-xl border-2 border-slate-200 text-slate-600 text-xs font-bold hover:border-blue-main hover:text-blue-main transition-all"
                >
                  📋 السجل
                </button>
                <button
                  onClick={() => deleteAccount(acc.id)}
                  className="flex-1 py-2 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-bold transition-all"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table — NO password column */}
      <div className="hidden md:block bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr
                style={{
                  background: "#F1F5F9",
                  borderBottom: "2px solid #E2E8F0",
                }}
              >
                {[
                  "#",
                  "الاسم",
                  "اسم المستخدم",
                  "الرصيد",
                  "الدور",
                  "إجراءات",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-right px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    لا توجد حسابات
                  </td>
                </tr>
              ) : (
                visibleAccounts.map((acc) => {
                  const live = DB.accounts.find((a) => a.id === acc.id);
                  return (
                    <tr
                      key={acc.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 text-sm font-mono">
                        #{acc.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg,#1565C0,#1E88E5)",
                            }}
                          >
                            {acc.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-800">
                              {acc.name}
                            </div>
                            {acc.dept && (
                              <div className="text-xs text-slate-400">
                                {acc.dept}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-600">
                          {acc.username}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-sm ${(live?.balance || 0) > 0 ? "text-emerald-600" : "text-slate-400"}`}
                          >
                            {(live?.balance || 0).toLocaleString("ar")}{" "}
                            <span className="text-xs font-normal text-slate-400">
                              د.ع
                            </span>
                          </span>
                          <button
                            onClick={() => openWallet(acc, "deposit")}
                            title="إيداع"
                            className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-500 hover:text-white text-sm font-black flex items-center justify-center transition-all"
                          >
                            +
                          </button>
                          <button
                            onClick={() => openWallet(acc, "deduct")}
                            title="خصم"
                            className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-500 hover:text-white text-sm font-black flex items-center justify-center transition-all"
                          >
                            −
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ROLE_BADGE[acc.role]}>
                          {ROLE_AR[acc.role]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setTxAcc(acc)}
                            className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:bg-blue-pale hover:text-blue-main hover:border-blue-main text-xs font-bold transition-all"
                          >
                            📋 السجل
                          </button>
                          <button
                            onClick={() => deleteAccount(acc.id)}
                            className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                          >
                            🗑️ حذف
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

      {/* Wallet Modal */}
      <Modal
        open={!!walletAcc}
        onClose={() => {
          setWalletAcc(null);
          setWalletAmt("");
        }}
        title={walletMode === "deposit" ? "💰 إيداع رصيد" : "💸 خصم من الرصيد"}
        maxWidth="max-w-sm"
      >
        {walletAcc &&
          (() => {
            const live = DB.accounts.find((a) => a.id === walletAcc.id);
            const amt = parseFloat(walletAmt) || 0;
            const after =
              walletMode === "deposit"
                ? (live?.balance || 0) + amt
                : (live?.balance || 0) - amt;
            const isDed = walletMode === "deduct";
            const insuf = isDed && amt > (live?.balance || 0);
            return (
              <div className="space-y-4">
                <div
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${isDed ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"}`}
                >
                  <div
                    className="w-12 h-12 rounded-full text-white font-black flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#1565C0,#1E88E5)",
                    }}
                  >
                    {walletAcc.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      {walletAcc.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {walletAcc.username}
                    </div>
                    <div
                      className={`text-sm font-black mt-0.5 ${(live?.balance || 0) > 0 ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      الرصيد: {(live?.balance || 0).toLocaleString("ar")} د.ع
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {QUICK.map((a) => (
                    <button
                      key={a}
                      onClick={() => setWalletAmt(String(a))}
                      className="py-2.5 rounded-xl text-sm font-bold transition-all"
                      style={{
                        border: `2px solid ${walletAmt === String(a) ? (isDed ? "#F97316" : "#16A34A") : "#E2E8F0"}`,
                        background:
                          walletAmt === String(a)
                            ? isDed
                              ? "#FFF7ED"
                              : "#F0FDF4"
                            : "white",
                        color:
                          walletAmt === String(a)
                            ? isDed
                              ? "#C2410C"
                              : "#15803D"
                            : "#475569",
                      }}
                    >
                      {a.toLocaleString("ar")}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1.5">
                    المبلغ (د.ع)
                  </label>
                  <input
                    type="number"
                    value={walletAmt}
                    onChange={(e) => setWalletAmt(e.target.value)}
                    placeholder="أدخل المبلغ..."
                    min="0"
                    step="500"
                    className="field-input"
                    onKeyDown={(e) => e.key === "Enter" && handleWallet()}
                  />
                </div>

                {amt > 0 && (
                  <div
                    className="p-3.5 rounded-xl text-sm space-y-1.5"
                    style={{
                      background: insuf
                        ? "#FEF2F2"
                        : isDed
                          ? "#FFF7ED"
                          : "#F0FDF4",
                      border: `2px solid ${insuf ? "#FECACA" : isDed ? "#FED7AA" : "#BBF7D0"}`,
                    }}
                  >
                    <div className="flex justify-between text-slate-600">
                      <span>الرصيد الحالي</span>
                      <span>
                        {(live?.balance || 0).toLocaleString("ar")} د.ع
                      </span>
                    </div>
                    <div
                      className={`flex justify-between font-bold ${isDed ? "text-orange-600" : "text-emerald-600"}`}
                    >
                      <span>{isDed ? "− خصم" : "+ إيداع"}</span>
                      <span>{amt.toLocaleString("ar")} د.ع</span>
                    </div>
                    <div
                      className={`flex justify-between font-black border-t pt-1.5 ${insuf ? "border-red-200 text-red-600" : isDed ? "border-orange-200 text-orange-700" : "border-emerald-200 text-emerald-700"}`}
                    >
                      <span>الرصيد بعد العملية</span>
                      <span>
                        {insuf
                          ? "❌ رصيد غير كافٍ"
                          : after.toLocaleString("ar") + " د.ع"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleWallet}
                    disabled={insuf || !amt}
                    className="flex-1 py-3 rounded-full font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: isDed ? "#F97316" : "#16A34A",
                      boxShadow:
                        !insuf && amt
                          ? `0 4px 14px ${isDed ? "rgba(249,115,22,.35)" : "rgba(22,163,74,.35)"}`
                          : "none",
                    }}
                  >
                    {isDed ? "💸 تأكيد الخصم" : "💰 تأكيد الإيداع"}
                  </button>
                  <button
                    onClick={() => {
                      setWalletAcc(null);
                      setWalletAmt("");
                    }}
                    className="border-2 border-slate-200 text-slate-600 px-5 py-3 rounded-full font-bold hover:bg-slate-50 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            );
          })()}
      </Modal>

      {/* Transactions Modal */}
      <Modal
        open={!!txAcc}
        onClose={() => setTxAcc(null)}
        title={`📋 سجل ${txAcc?.name || ""}`}
        maxWidth="max-w-lg"
      >
        {txAcc &&
          (() => {
            const txs = getTransactions(txAcc.id);
            const live = DB.accounts.find((a) => a.id === txAcc.id);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "الإيداعات",
                      val: txs
                        .filter((t) => t.type === "deposit")
                        .reduce((s, t) => s + t.amount, 0),
                      c: "text-emerald-600",
                      bg: "bg-emerald-50",
                      br: "border-emerald-200",
                    },
                    {
                      label: "الإنفاق",
                      val: txs
                        .filter((t) => t.type === "deduct")
                        .reduce((s, t) => s + t.amount, 0),
                      c: "text-blue-main",
                      bg: "bg-blue-50",
                      br: "border-blue-200",
                    },
                    {
                      label: "الرصيد",
                      val: live?.balance || 0,
                      c: "text-orange-600",
                      bg: "bg-orange-50",
                      br: "border-orange-200",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`${s.bg} border-2 ${s.br} rounded-xl p-3 text-center`}
                    >
                      <div className="text-xs font-bold text-slate-500 mb-0.5">
                        {s.label}
                      </div>
                      <div className={`font-black text-sm ${s.c}`}>
                        {s.val.toLocaleString("ar")}{" "}
                        <span className="text-xs opacity-60">د.ع</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {txs.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-sm">لا توجد معاملات</p>
                    </div>
                  ) : (
                    [...txs].reverse().map((tx) => (
                      <div
                        key={tx.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 ${tx.type === "deposit" ? "border-emerald-100 bg-emerald-50" : "border-blue-100 bg-blue-50"}`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${tx.type === "deposit" ? "bg-emerald-100" : "bg-blue-pale"}`}
                        >
                          {tx.type === "deposit" ? "💰" : "🛒"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-700">
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
                          {tx.amount.toLocaleString("ar")} د.ع
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
      </Modal>

      {/* Add Account Modal */}
      <Modal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setForm(EMPTY);
          setShowFormPw(false);
        }}
        title="➕ إضافة حساب جديد"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="مثال: أحمد علي"
              className="field-input"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              اسم المستخدم <span className="text-red-500">*</span>
            </label>
            <input
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="ahmed2025"
              className="field-input"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              كلمة المرور <span className="text-red-500">*</span>
              <span className="text-xs text-slate-400 font-normal mr-2">
                (الافتراضي: 1234)
              </span>
            </label>
            <div className="relative">
              <input
                type={showFormPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="field-input pl-11"
              />
              <button
                type="button"
                onClick={() => setShowFormPw((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-main hover:border-blue-main hover:bg-blue-pale transition-all"
              >
                <Eye open={showFormPw} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">
              الدور
            </label>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="field-input"
            >
              {allowedRoles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleAdd}
              className="btn-primary-gradient flex-1 py-3 rounded-full font-bold"
            >
              💾 إضافة الحساب
            </button>
            <button
              onClick={() => {
                setAddOpen(false);
                setForm(EMPTY);
              }}
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
