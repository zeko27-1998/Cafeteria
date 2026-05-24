import { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shakeU, setShakeU] = useState(false);
  const [shakeP, setShakeP] = useState(false);
  const [loading, setLoading] = useState(false);
  const bubblesRef = useRef(null);

  useEffect(() => {
    const wrap = bubblesRef.current;
    if (!wrap) return;
    const bubbles = Array.from({ length: 16 }).map(() => {
      const b = document.createElement("div");
      b.className = "bubble";
      const size = 30 + Math.random() * 100;
      b.style.cssText = `width:${size}px;height:${size}px;right:${Math.random() * 100}%;animation-duration:${8 + Math.random() * 12}s;animation-delay:${Math.random() * 10}s;`;
      wrap.appendChild(b);
      return b;
    });
    return () => bubbles.forEach((b) => b.remove());
  }, []);

  const shake = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 400);
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      shake(setShakeU);
      return;
    }
    if (!password.trim()) {
      shake(setShakeP);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    const ok = login(username.trim(), password);
    if (!ok) {
      shake(setShakeU);
      shake(setShakeP);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg,#0B3D91 0%,#1565C0 50%,#1E88E5 100%)",
      }}
    >
      <div
        ref={bubblesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 70%,rgba(255,255,255,.07) 0%,transparent 60%),radial-gradient(circle at 80% 20%,rgba(255,255,255,.05) 0%,transparent 50%)",
        }}
      />

      <div className="bg-white rounded-xl3 px-10 py-10 w-full max-w-sm shadow-blue-xl relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-blue-pale shadow-blue-md mb-3 bg-white flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Scopesky Cafe & Bistro"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <h1 className="text-xl font-black text-blue-deep text-center">
            Scopesky Cafe & Bistro
          </h1>
          <p className="text-sm text-slate-400 mt-1 text-center">
            كافتريا الشركة — نظام الطلبات
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-500">
              اسم المستخدم
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="أدخل اسم المستخدم"
              autoComplete="username"
              className={`field-input w-full px-4 py-3  ${shakeU ? "animate-shake" : ""}`}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-500">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="●●●●●●"
              autoComplete="current-password"
              className={`field-input w-full px-4 py-3  ${shakeP ? "animate-shake" : ""}`}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary-gradient w-full py-3.5 rounded-full text-white font-bold text-base mt-1 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full inline-block"
                style={{ animation: "spin .7s linear infinite" }}
              />
            ) : (
              "🚀"
            )}
            {loading ? "جارٍ التحقق..." : "دخول"}
          </button>

          <p className="text-center text-xs text-slate-400">
            للحصول على حساب تواصل مع مدير النظام
          </p>
        </div>
      </div>
    </div>
  );
}
