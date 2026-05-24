import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import EyeIcon from "../components/ui/EyeIcon";

export default function LoginPage() {
  const { login, role } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [shakeU, setShakeU] = useState(false);
  const [shakeP, setShakeP] = useState(false);
  const [loading, setLoading] = useState(false);
  const bubblesRef = useRef(null);

  useEffect(() => {
    if (role === "user") navigate("/menu", { replace: true });
    else if (role === "admin" || role === "superadmin")
      navigate("/admin", { replace: true });
  }, [role]);

  useEffect(() => {
    const wrap = bubblesRef.current;
    if (!wrap) return;
    const bs = Array.from({ length: 12 }).map(() => {
      const b = document.createElement("div");
      b.className = "bubble";
      const s = 40 + Math.random() * 100;
      b.style.cssText = `width:${s}px;height:${s}px;right:${Math.random() * 100}%;animation-duration:${10 + Math.random() * 14}s;animation-delay:${Math.random() * 8}s;`;
      wrap.appendChild(b);
      return b;
    });
    return () => bs.forEach((b) => b.remove());
  }, []);

  const shake = (s) => {
    s(true);
    setTimeout(() => s(false), 420);
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
    await new Promise((r) => setTimeout(r, 300));
    const result = login(username.trim(), password);
    if (!result) {
      shake(setShakeU);
      shake(setShakeP);
      setLoading(false);
      return;
    }
    if (result === "user") navigate("/menu", { replace: true });
    else navigate("/admin", { replace: true });
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #071E3D 0%, #0D47A1 45%, #1565C0 75%, #1E88E5 100%)",
      }}
    >
      <div
        ref={bubblesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />

      {/* Decorative circles */}
      <div
        className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-[240px] h-[240px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div className="w-full max-w-[380px] relative z-10 animate-scale-in">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-3xl overflow-hidden mb-4 border-4 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Scopesky"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Scopesky
          </h1>
          <p className="text-sm text-white/60 font-semibold mt-0.5">
            Cafe & Bistro — نظام الكافتريا
          </p>
        </div>

        {/* Form card */}
        <div
          className="bg-white rounded-3xl p-7 shadow-2xl"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}
        >
          <h2 className="text-lg font-black text-slate-800 mb-5 text-center">
            تسجيل الدخول
          </h2>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                اسم المستخدم
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="أدخل اسم المستخدم"
                autoComplete="username"
                className={`field-input ${shakeU ? "animate-shake" : ""}`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="أدخل كلمة المرور"
                  autoComplete="current-password"
                  className={`field-input pl-12 ${shakeP ? "animate-shake" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl border border-slate-200 bg-white/80 text-slate-400 hover:text-blue-main hover:border-blue-main transition-all"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPw} size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary-gradient w-full py-3.5 rounded-2xl text-[15px] mt-2 gap-2"
            >
              {loading ? (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  style={{ animation: "spin .7s linear infinite" }}
                />
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
              {loading ? "جارٍ التحقق..." : "دخول"}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            للحصول على حساب تواصل مع مدير الكافتريا
          </p>
        </div>
      </div>
    </div>
  );
}
