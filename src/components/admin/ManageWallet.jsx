import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Modal from "../ui/Modal";

const QUICK = [5000, 10000, 15000, 25000, 50000];

export default function ManageWallet() {
  const {
    DB,
    role,
    depositBalance,
    getTransactions,
    addDebt,
    payDebt,
    getDebts,
  } = useApp();
  const isSA = role === "superadmin";
  const accounts = (isSA ? DB.accounts : DB.accounts.filter((a) => a.role === "user")).filter(
    (a) => a.role !== "admin" || isSA,
  );
  const [walletAcc, setWalletAcc] = useState(null);
  const [walletMode, setWalletMode] = useState("deposit");
  const [walletAmt, setWalletAmt] = useState("");
  const [debtAcc, setDebtAcc] = useState(null);
  const [debtAmt, setDebtAmt] = useState("");
  const [debtNote, setDebtNote] = useState("");
  const [payDebtAcc, setPayDebtAcc] = useState(null);
  const [payDebtAmt, setPayDebtAmt] = useState("");
  const [txAcc, setTxAcc] = useState(null);

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);
  const totalDebt = accounts.reduce((s, a) => s + (a.debt || 0), 0);
  const totalDeposited = DB.transactions
    .filter((t) => t.type === "deposit")
    .reduce((s, t) => s + t.amount, 0);

  const openWallet = (acc, mode) => {
    setWalletAcc(acc);
    setWalletMode(mode);
    setWalletAmt("");
  };

  const handleWallet = () => {
    const amt = parseFloat(walletAmt);
    const ok = depositBalance(walletAcc.id, walletMode === "deduct" ? -amt : amt);
    if (ok) {
      setWalletAmt("");
      setWalletAcc(null);
    }
  };

  const handleDebt = () => {
    const amt = parseFloat(debtAmt);
    const ok = addDebt(debtAcc.id, amt, debtNote.trim());
    if (ok) {
      setDebtAmt("");
      setDebtNote("");
      setDebtAcc(null);
    }
  };

  const openPayDebt = (acc) => {
    if (!(acc.debt > 0)) return;
    setPayDebtAcc(acc);
    setPayDebtAmt(String(acc.debt || ""));
  };

  const handlePayDebt = () => {
    const amt = parseFloat(payDebtAmt);
    const ok = payDebt(payDebtAcc.id, amt);
    if (ok) {
      setPayDebtAmt("");
      setPayDebtAcc(null);
    }
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      <div className="flex items-center gap-2.5">
        <span className="section-title-accent" />
        <h2 className="text-lg font-black text-slate-800">المحافظ والديون</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="إجمالي الأرصدة" value={totalBalance} color="text-emerald-600" />
        <Stat label="إجمالي الإيداعات" value={totalDeposited} color="text-blue-main" />
        <Stat label="إجمالي الديون" value={totalDebt} color="text-red-600" />
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center text-slate-400">
          لا توجد حسابات لإدارة المحافظ
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {accounts.map((acc) => {
          const live = DB.accounts.find((a) => a.id === acc.id) || acc;
          return (
            <div key={acc.id} className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                <Avatar name={acc.name} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800">{acc.name}</div>
                  <code className="text-xs text-slate-400 font-mono">{acc.username}</code>
                </div>
                <button
                  onClick={() => setTxAcc(acc)}
                  className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:border-blue-main hover:text-blue-main transition-all"
                >
                  السجل
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50">
                <MoneyBlock label="الرصيد" value={live.balance || 0} color="text-emerald-600" />
                <MoneyBlock label="الدين" value={live.debt || 0} color={(live.debt || 0) > 0 ? "text-red-600" : "text-slate-400"} />
              </div>

              <div className="flex flex-wrap gap-2 p-4">
                <button onClick={() => openWallet(acc, "deposit")} className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all">
                  إيداع
                </button>
                <button onClick={() => openWallet(acc, "deduct")} className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all">
                  خصم
                </button>
                <button onClick={() => setDebtAcc(acc)} className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all">
                  إضافة دين
                </button>
                <button
                  onClick={() => openPayDebt(acc)}
                  disabled={!(live.debt > 0)}
                  className="px-3 py-2 rounded-xl border-2 border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  تسديد الدين
                </button>
              </div>
            </div>
          );
          })}
        </div>
      )}

      <Modal
        open={!!walletAcc}
        onClose={() => setWalletAcc(null)}
        title={walletMode === "deposit" ? "إيداع رصيد" : "خصم من الرصيد"}
        maxWidth="max-w-sm"
      >
        {walletAcc && (
          <AmountForm
            amount={walletAmt}
            setAmount={setWalletAmt}
            accent={walletMode === "deposit" ? "#16A34A" : "#F97316"}
            submitLabel={walletMode === "deposit" ? "تأكيد الإيداع" : "تأكيد الخصم"}
            onSubmit={handleWallet}
          />
        )}
      </Modal>

      <Modal
        open={!!debtAcc}
        onClose={() => setDebtAcc(null)}
        title="إضافة دين"
        maxWidth="max-w-sm"
      >
        {debtAcc && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border-2 border-red-200 bg-red-50">
              <div className="font-bold text-slate-800">{debtAcc.name}</div>
              <div className="text-xs text-slate-500">سيتم ربط الدين بهذا المستخدم</div>
            </div>
            <AmountForm
              amount={debtAmt}
              setAmount={setDebtAmt}
              accent="#DC2626"
              submitLabel="تسجيل الدين"
              onSubmit={handleDebt}
            />
            <textarea
              value={debtNote}
              onChange={(e) => setDebtNote(e.target.value)}
              placeholder="ملاحظة اختيارية..."
              rows={2}
              className="field-input resize-none"
            />
          </div>
        )}
      </Modal>

      <Modal
        open={!!payDebtAcc}
        onClose={() => setPayDebtAcc(null)}
        title="تسديد دين"
        maxWidth="max-w-sm"
      >
        {payDebtAcc && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-800">{payDebtAcc.name}</div>
              <div className="text-xs text-slate-500">
                الدين الحالي: {(payDebtAcc.debt || 0).toLocaleString("ar")} د.ع
              </div>
            </div>
            <AmountForm
              amount={payDebtAmt}
              setAmount={setPayDebtAmt}
              accent="#1565C0"
              submitLabel="تأكيد التسديد"
              onSubmit={handlePayDebt}
              maxAmount={payDebtAcc.debt || 0}
            />
          </div>
        )}
      </Modal>

      <Modal
        open={!!txAcc}
        onClose={() => setTxAcc(null)}
        title={`سجل ${txAcc?.name || ""}`}
        maxWidth="max-w-lg"
      >
        {txAcc && <History txs={getTransactions(txAcc.id)} debts={getDebts(txAcc.id)} />}
      </Modal>
    </div>
  );
}

function AmountForm({ amount, setAmount, accent, submitLabel, onSubmit, maxAmount }) {
  const quickAmounts = maxAmount
    ? QUICK.filter((a) => a <= maxAmount)
    : QUICK;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {quickAmounts.map((a) => (
          <button
            key={a}
            onClick={() => setAmount(String(a))}
            className="py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              border: `2px solid ${amount === String(a) ? accent : "#E2E8F0"}`,
              background: amount === String(a) ? "#F8FAFC" : "white",
              color: amount === String(a) ? accent : "#475569",
            }}
          >
            {a.toLocaleString("ar")}
          </button>
        ))}
        {maxAmount > 0 && !quickAmounts.includes(maxAmount) && (
          <button
            onClick={() => setAmount(String(maxAmount))}
            className="py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              border: `2px solid ${amount === String(maxAmount) ? accent : "#E2E8F0"}`,
              background: amount === String(maxAmount) ? "#F8FAFC" : "white",
              color: amount === String(maxAmount) ? accent : "#475569",
            }}
          >
            الكل
          </button>
        )}
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="أدخل المبلغ..."
        min="0"
        step="500"
        className="field-input"
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />
      <button
        onClick={onSubmit}
        className="w-full py-3 rounded-full font-bold text-white transition-all"
        style={{ background: accent }}
      >
        {submitLabel}
      </button>
    </div>
  );
}

function History({ txs, debts }) {
  const debtIds = new Set(
    txs.filter((t) => t.type === "debt").map((t) => `${t.accountId}-${t.amount}-${t.note}`),
  );
  const rows = [
    ...txs.map((t) => ({ ...t, kind: "tx" })),
    ...debts
      .filter((d) => !debtIds.has(`${d.accountId}-${d.amount}-${d.note}`))
      .map((d) => ({ ...d, type: "debt_record", kind: "debt" })),
  ].sort((a, b) => b.id - a.id);

  if (!rows.length) {
    return <div className="py-8 text-center text-slate-400">لا توجد عمليات بعد</div>;
  }

  return (
    <div className="max-h-80 overflow-y-auto space-y-2">
      {rows.map((row) => (
        <div key={`${row.kind}-${row.id}`} className="p-3 rounded-xl border-2 border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-700">{labelFor(row.type)}</div>
            <div className="text-xs text-slate-400">{row.note} · {row.date} · {row.time}</div>
          </div>
          <div className={`font-black text-sm ${row.type?.includes("debt") ? "text-red-600" : row.type === "deposit" ? "text-emerald-600" : "text-blue-main"}`}>
            {row.amount.toLocaleString("ar")} د.ع
          </div>
        </div>
      ))}
    </div>
  );
}

function labelFor(type) {
  if (type === "deposit") return "إيداع";
  if (type === "deduct") return "خصم";
  if (type === "debt") return "دين";
  if (type === "debt_payment") return "تسديد دين";
  return "دين مسجل";
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4">
      <div className={`text-2xl font-black ${color}`}>{value.toLocaleString("ar")}</div>
      <div className="text-xs text-slate-500 font-semibold mt-0.5">{label}</div>
    </div>
  );
}

function MoneyBlock({ label, value, color }) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-3">
      <div className="text-xs text-slate-400 font-semibold">{label}</div>
      <div className={`text-lg font-black ${color}`}>
        {value.toLocaleString("ar")} <span className="text-xs text-slate-400">د.ع</span>
      </div>
    </div>
  );
}

function Avatar({ name }) {
  return (
    <div
      className="w-11 h-11 rounded-full text-white font-black text-base flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg,#1565C0,#1E88E5)" }}
    >
      {(name || "?")[0]}
    </div>
  );
}
