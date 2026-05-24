import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Modal from "../ui/Modal";

const TYPE_LABEL = {
  buy: "🛍️ جاهز للشراء",
  cook: "🍳 تحضير طازج",
  both: "✨ جاهز وطازج",
};

export default function ItemDetailModal() {
  const { detailItem, setDetailItem, addToCart } = useApp();
  const [qty, setQty] = useState(1);

  const handleClose = () => {
    setDetailItem(null);
    setQty(1);
  };
  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(detailItem);
    handleClose();
  };

  return (
    <Modal
      open={!!detailItem}
      onClose={handleClose}
      title={detailItem?.name || ""}
      maxWidth="max-w-sm"
    >
      {detailItem && (
        <>
          {/* Image or emoji */}
          {detailItem.image ? (
            <img
              src={detailItem.image}
              alt={detailItem.name}
              className="w-full h-48 object-cover rounded-2xl mb-4"
              style={{ border: "2px solid #E2E8F0" }}
            />
          ) : (
            <div className="text-center text-[80px] my-3 leading-none">
              {detailItem.icon}
            </div>
          )}

          {/* Description */}
          {detailItem.desc && (
            <p className="text-center text-sm text-slate-500 mb-4 leading-relaxed">
              {detailItem.desc}
            </p>
          )}

          {/* Price + type */}
          <div
            className="flex justify-between items-center p-3.5 rounded-2xl mb-4"
            style={{ background: "#F8FAFC", border: "2px solid #E2E8F0" }}
          >
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-0.5">
                السعر
              </div>
              <div className="text-2xl font-black text-blue-main">
                {detailItem.price.toLocaleString("ar")}
                <span className="text-sm font-semibold text-slate-400 mr-1">
                  د.ع
                </span>
              </div>
            </div>
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{
                background: "#DBEAFE",
                color: "#1565C0",
                border: "1px solid #93C5FD",
              }}
            >
              {TYPE_LABEL[detailItem.type]}
            </span>
          </div>

          {/* Qty control */}
          <div className="flex items-center justify-center gap-5 mb-5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-11 h-11 rounded-2xl font-black text-xl flex items-center justify-center transition-all"
              style={{
                border: "2px solid #94a3b8",
                background: "white",
                color: "#1565C0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1565C0";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#1565C0";
              }}
            >
              −
            </button>
            <span className="text-3xl font-black text-slate-800 w-10 text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-11 h-11 rounded-2xl font-black text-xl flex items-center justify-center transition-all"
              style={{
                border: "2px solid #94a3b8",
                background: "white",
                color: "#1565C0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1565C0";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#1565C0";
              }}
            >
              +
            </button>
          </div>

          {/* Total preview */}
          {qty > 1 && (
            <div className="text-center text-sm text-slate-400 mb-3">
              الإجمالي:{" "}
              <span className="font-black text-blue-main">
                {(detailItem.price * qty).toLocaleString("ar")} د.ع
              </span>
            </div>
          )}

          <button
            onClick={handleAdd}
            className="btn-primary-gradient w-full py-3.5 rounded-2xl text-base"
          >
            🛒 أضف إلى السلة {qty > 1 ? `(${qty})` : ""}
          </button>
        </>
      )}
    </Modal>
  );
}
