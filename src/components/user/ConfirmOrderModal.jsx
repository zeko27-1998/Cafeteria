import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Modal from "../ui/Modal";

export default function ConfirmOrderModal() {
  const {
    confirmOpen,
    setConfirmOpen,
    cart,
    cartTotal,
    submitOrder,
    currentBalance,
    role,
    paymentMethod,
    setPaymentMethod,
  } = useApp();
  const [note, setNote] = useState("");

  const isUser = role === "user";
  const useWallet = paymentMethod === "wallet";
  const canAfford = !isUser || !useWallet || currentBalance >= cartTotal;
  const remaining = currentBalance - cartTotal;

  const handleSubmit = () => {
    submitOrder(note);
    setNote("");
  };

  return (
    <Modal
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      title="تأكيد الطلب"
    >
      {/* Items */}
      <p className="text-sm text-slate-500 font-semibold mb-3">مراجعة الطلب</p>
      <div className="max-h-44 overflow-y-auto space-y-2 mb-4">
        {cart.map((c) => (
          <div
            key={c.item.id}
            className="flex justify-between items-center px-3 py-2.5 rounded-2xl"
            style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center gap-2">
              {c.item.image ? (
                <img
                  src={c.item.image}
                  alt=""
                  className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <span className="text-xl">{c.item.icon}</span>
              )}
              <span className="font-semibold text-sm text-slate-700">
                {c.item.name} × {c.qty}
              </span>
            </div>
            <strong className="text-blue-main flex-shrink-0 text-sm">
              {(c.item.price * c.qty).toLocaleString("ar")} د.ع
            </strong>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        className="flex justify-between font-black text-slate-800 text-lg mb-5 pb-4"
        style={{ borderBottom: "2px dashed #E2E8F0" }}
      >
        <span>الإجمالي</span>
        <span className="text-blue-main">
          {cartTotal.toLocaleString("ar")} د.ع
        </span>
      </div>

      {/* Payment method — users only */}
      {isUser && (
        <div className="mb-5">
          <p className="text-sm font-bold text-slate-600 mb-2.5">طريقة الدفع</p>
          <div className="flex gap-3">
            {[
              {
                key: "wallet",
                icon: "💳",
                title: "رصيد الحساب",
                sub: `${currentBalance.toLocaleString("ar")} د.ع متاح`,
                warn: currentBalance < cartTotal,
              },
              {
                key: "cash",
                icon: "💵",
                title: "دفع نقدي",
                sub: "ادفع عند الاستلام",
                warn: false,
              },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setPaymentMethod(opt.key)}
                className="flex-1 flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-2xl transition-all"
                style={{
                  border: `2px solid ${paymentMethod === opt.key ? "#1565C0" : "#CBD5E1"}`,
                  background: paymentMethod === opt.key ? "#EFF6FF" : "white",
                  boxShadow:
                    paymentMethod === opt.key
                      ? "0 4px 12px rgba(21,101,192,0.15)"
                      : "none",
                }}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span
                  className={`text-xs font-bold ${paymentMethod === opt.key ? "text-blue-main" : "text-slate-600"}`}
                >
                  {opt.title}
                </span>
                <span
                  className={`text-[10px] font-semibold ${opt.warn ? "text-red-500" : "text-slate-400"}`}
                >
                  {opt.sub}
                </span>
              </button>
            ))}
          </div>

          {/* Balance preview */}
          {useWallet && (
            <div
              className={`mt-3 flex items-center justify-between p-3 rounded-2xl text-sm ${canAfford ? "bg-emerald-50" : "bg-red-50"}`}
              style={{
                border: `2px solid ${canAfford ? "#BBF7D0" : "#FECACA"}`,
              }}
            >
              <div>
                <div className="text-xs text-slate-500 font-semibold">
                  رصيدك الحالي
                </div>
                <div
                  className={`font-black ${canAfford ? "text-emerald-600" : "text-red-600"}`}
                >
                  {currentBalance.toLocaleString("ar")} د.ع
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold">
                  بعد الخصم
                </div>
                <div
                  className={`font-black ${remaining >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {remaining >= 0
                    ? remaining.toLocaleString("ar") + " د.ع"
                    : "❌ غير كافٍ"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-slate-600 mb-1.5">
          ملاحظات للكافتريا{" "}
          <span className="text-slate-400 font-normal text-xs">(اختياري)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="مثال: بدون بصل، طلب عاجل..."
          className="field-input resize-none"
        />
      </div>

      {!canAfford && isUser && useWallet && (
        <div
          className="px-3 py-2.5 rounded-2xl text-xs text-red-700 font-semibold text-center mb-4"
          style={{ background: "#FEF2F2", border: "2px solid #FECACA" }}
        >
          ⚠️ رصيدك غير كافٍ — غيّر طريقة الدفع إلى نقدي أو تواصل مع المدير
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={isUser && useWallet && !canAfford}
          className="btn-success-gradient flex-1 py-3.5 rounded-2xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isUser
            ? useWallet
              ? `إرسال وخصم ${cartTotal.toLocaleString("ar")} د.ع 🚀`
              : "إرسال (دفع نقدي) 💵"
            : "إرسال الطلب 🚀"}
        </button>
        <button
          onClick={() => setConfirmOpen(false)}
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
    </Modal>
  );
}
