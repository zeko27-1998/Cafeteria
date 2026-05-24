import { createContext, useContext, useState, useCallback } from "react";
import { useRef } from "react";
import {
  DB,
  SUPER_ADMIN,
  dbFindAccount,
  dbAddAccount,
  dbUpdateAccount,
  dbDeleteAccount,
  dbAddOrder,
  dbToggleAvail,
  dbDeleteItem,
  dbUpdateItem,
  dbAddItem,
  dbAddCategory,
  dbDeleteCategory,
  dbDeposit,
  dbDeduct,
  dbGetTransactions,
} from "../data/db";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState("buy");
  const [activeCat, setActiveCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailItem, setDetailItem] = useState(null);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet"); // 'wallet' | 'cash'
  const [toasts, setToasts] = useState([]);
  const [, forceUpdate] = useState(0);
  const lastToastRef = useRef({});
  const cartItemsCount = cart.length; // عدد الأصناف
  const cartQtyCount = cart.reduce((s, c) => s + c.qty, 0); // عدد القطع

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const toast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3400,
    );
  }, []);

  // ── Sync currentUser balance from DB ──────────────────────────
  const syncBalance = useCallback(() => {
    if (!currentUser || currentUser.role === "superadmin") return;
    const acc = DB.accounts.find((a) => a.id === currentUser.id);
    if (acc) setCurrentUser((prev) => ({ ...prev, balance: acc.balance }));
  }, [currentUser]);

  /* ══ AUTH ══════════════════════════════════════════════════════ */
  const login = (username, password) => {
    if (
      username === SUPER_ADMIN.username &&
      password === SUPER_ADMIN.password
    ) {
      setCurrentUser({ ...SUPER_ADMIN, balance: 0 });
      setRole("superadmin");
      toast(`مرحباً ${SUPER_ADMIN.name} 🔑`, "success");
      return "admin";
    }
    const account = dbFindAccount(username, password);
    if (!account) {
      toast("اسم المستخدم أو كلمة المرور غير صحيحة", "error");
      return null;
    }
    setCurrentUser(account);
    setRole(account.role);
    toast(`مرحباً ${account.name}`, "success");
    return account.role;
  };

  const logout = (navigate) => {
    setCart([]);
    setCartOpen(false);
    setRole(null);
    setCurrentUser(null);
    setActiveCat(null);
    setSearchTerm("");
    setAdminTab("dashboard");
    if (navigate) navigate("/login");
  };

  /* ══ CART ═══════════════════════════════════════════════════════ */
  const addToCart = (item) => {
    if (!item.available) return;

    setCart((prev) => {
      const ex = prev.find((c) => c.item.id === item.id);
      if (ex)
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      return [...prev, { item, qty: 1 }];
    });

    // 🧠 منع التكرار
    const now = Date.now();
    const last = lastToastRef.current[item.id] || 0;

    if (now - last > 1500) {
      toast(`${item.icon} أُضيف: ${item.name}`, "success");
      lastToastRef.current[item.id] = now;
    }
  };

  const changeQty = (itemId, delta) =>
    setCart((prev) =>
      prev
        .map((c) => (c.item.id === itemId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const cartCount = cart.length;

  // Current balance from live DB (always fresh)
  const currentBalance =
    currentUser?.role !== "superadmin"
      ? (DB.accounts.find((a) => a.id === currentUser?.id)?.balance ?? 0)
      : 0;

  /* ══ ORDERS ══════════════════════════════════════════════════════ */
  const submitOrder = (note) => {
    // Wallet payment: check & deduct balance
    if (
      paymentMethod === "wallet" &&
      currentUser &&
      currentUser.role === "user"
    ) {
      const result = dbDeduct(currentUser.id, cartTotal);
      if (!result.ok) {
        if (result.reason === "insufficient") {
          toast(
            `❌ رصيدك غير كافٍ — الرصيد الحالي: ${(result.balance || 0).toLocaleString("ar")} د.ع`,
            "error",
          );
        } else {
          toast("خطأ في الحساب", "error");
        }
        return;
      }
      setCurrentUser((prev) => ({ ...prev, balance: result.balance }));
    }
    const order = dbAddOrder({
      user: currentUser?.name || "",
      userId: currentUser?.id,
      items: [...cart],
      subtotal: cartTotal,
      type: orderType,
      paymentMethod: paymentMethod,
      note,
    });
    setCart([]);
    setConfirmOpen(false);
    setPaymentMethod("wallet");
    refresh();
    const pm = paymentMethod === "cash" ? "💵 دفع نقدي" : "💳 خصم من رصيدك";
    toast(`✅ تم إرسال طلبك #${order.id} — ${pm}`, "success");
  };

  /* ══ ITEMS ════════════════════════════════════════════════════════ */
  const toggleAvail = (id) => {
    const item = dbToggleAvail(id);
    refresh();
    toast(`${item.name}${item.available ? " ✔ متاح" : " ✕ غير متاح"}`, "info");
  };
  const deleteItem = (id) => {
    const item = DB.items.find((i) => i.id === id);
    if (!item || !window.confirm(`حذف "${item.name}"؟`)) return;
    dbDeleteItem(id);
    refresh();
    toast(`🗑️ ${item.name}`, "error");
  };
  const saveEditItem = (id, changes) => {
    dbUpdateItem(id, changes);
    refresh();
    toast("✔ تم التحديث", "success");
  };
  const addItem = (data) => {
    dbAddItem({ ...data, available: true });
    refresh();
    toast(`✅ ${data.name}`, "success");
  };

  /* ══ CATEGORIES ═══════════════════════════════════════════════════ */
  const addCategory = (cat) => {
    dbAddCategory(cat);
    refresh();
    toast(`✅ ${cat.name}`, "success");
  };
  const deleteCategory = (id) => {
    const cat = DB.categories.find((c) => c.id === id);
    if (!cat) return;
    if (DB.items.some((i) => i.cat === id)) {
      toast("الفئة تحتوي أصنافاً — لا يمكن حذفها", "error");
      return;
    }
    dbDeleteCategory(id);
    refresh();
    toast(`🗑️ ${cat.name}`, "error");
  };

  /* ══ ACCOUNTS ════════════════════════════════════════════════════ */
  const addAccount = (data) => {
    if (role === "admin" && data.role !== "user") {
      toast("المدير يضيف موظفين فقط", "error");
      return false;
    }
    if (role === "superadmin" && data.role === "superadmin") {
      toast("لا يمكن إضافة سوبر أدمن آخر", "error");
      return false;
    }
    const acc = dbAddAccount({ ...data, balance: 0 });
    if (!acc) {
      toast("اسم المستخدم مستخدم بالفعل", "error");
      return false;
    }
    refresh();
    toast(`✅ ${acc.name}`, "success");
    return true;
  };
  const deleteAccount = (id) => {
    const acc = DB.accounts.find((a) => a.id === id);
    if (!acc) return;
    if (role === "admin" && acc.role !== "user") {
      toast("ليس لديك صلاحية", "error");
      return;
    }
    if (!window.confirm(`حذف "${acc.name}"؟`)) return;
    dbDeleteAccount(id);
    refresh();
    toast(`🗑️ ${acc.name}`, "error");
  };
  const updateAccount = (id, changes) => {
    const acc = DB.accounts.find((a) => a.id === id);
    if (!acc) return;
    if (role === "admin" && acc.role !== "user") {
      toast("ليس لديك صلاحية", "error");
      return;
    }
    dbUpdateAccount(id, changes);
    if (currentUser?.id === id)
      setCurrentUser((prev) => ({ ...prev, ...changes }));
    refresh();
    toast("✔ تم التحديث", "success");
  };
  const updateSelfProfile = (changes) => {
    if (!currentUser || currentUser.role === "superadmin") {
      setCurrentUser((prev) => ({ ...prev, ...changes }));
      toast("✔ تم التحديث", "success");
      return;
    }
    dbUpdateAccount(currentUser.id, changes);
    setCurrentUser((prev) => ({ ...prev, ...changes }));
    refresh();
    toast("✔ تم التحديث", "success");
  };

  /* ══ WALLET ═══════════════════════════════════════════════════════ */
  const depositBalance = (accountId, amount) => {
    if (isNaN(amount) || amount === 0) {
      toast("أدخل مبلغاً صحيحاً", "error");
      return false;
    }
    const isDeduct = amount < 0;
    const absAmt = Math.abs(amount);
    let acc;
    if (isDeduct) {
      const result = dbDeduct(accountId, absAmt);
      if (!result.ok) {
        toast(
          `رصيد غير كافٍ — الرصيد الحالي: ${(result.balance || 0).toLocaleString("ar")} د.ع`,
          "error",
        );
        return false;
      }
      acc = DB.accounts.find((a) => a.id === accountId);
    } else {
      acc = dbDeposit(accountId, absAmt);
      if (!acc) {
        toast("الحساب غير موجود", "error");
        return false;
      }
    }
    refresh();
    const msg = isDeduct
      ? `💸 تم خصم ${absAmt.toLocaleString("ar")} د.ع من حساب ${acc.name}`
      : `💰 تم إيداع ${absAmt.toLocaleString("ar")} د.ع في حساب ${acc.name}`;
    toast(msg, "success");
    return true;
  };

  const getTransactions = (accountId) => dbGetTransactions(accountId);

  const value = {
    cartItemsCount,
    cartQtyCount,
    role,
    currentUser,
    login,
    logout,
    isAdmin: role === "admin" || role === "superadmin",
    isSuperAdmin: role === "superadmin",
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    changeQty,
    cartTotal,
    cartCount,
    currentBalance,
    orderType,
    setOrderType,
    confirmOpen,
    setConfirmOpen,
    submitOrder,
    paymentMethod,
    setPaymentMethod,
    activeCat,
    setActiveCat,
    searchTerm,
    setSearchTerm,
    detailItem,
    setDetailItem,
    adminTab,
    setAdminTab,
    toggleAvail,
    deleteItem,
    saveEditItem,
    addItem,
    addCategory,
    deleteCategory,
    addAccount,
    deleteAccount,
    updateAccount,
    updateSelfProfile,
    depositBalance,
    getTransactions,
    DB,
    toast,
    toasts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
