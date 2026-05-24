import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4`}
      style={{
        zIndex: 9999,
        background: "rgba(7,30,61,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl p-6 sm:p-8 w-full ${maxWidth} animate-scale-in`}
        style={{
          border: "2px solid #E2E8F0",
          boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all hover:bg-red-50 hover:text-red-500"
            style={{
              border: "2px solid #E2E8F0",
              background: "#F8FAFC",
              color: "#64748B",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}
