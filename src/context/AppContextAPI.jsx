/**
 * ══════════════════════════════════════════════════════
 *  AppContext — نسخة الـ Real API
 *  استبدل src/context/AppContext.jsx بهذا الملف
 *  عند ربط الـ Backend
 * ══════════════════════════════════════════════════════
 *
 *  التغييرات الرئيسية عن النسخة الوهمية:
 *  1. login()      → POST /api/auth/login  (JWT)
 *  2. addToCart()  → local state فقط
 *  3. submitOrder()→ POST /api/orders  (يخصم من الرصيد في الـ backend)
 *  4. كل عمليات الـ admin → API calls حقيقية
 *  5. balance يُحدَّث من الـ server بعد كل طلب
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  authApi,
  accountsApi,
  itemsApi,
  categoriesApi,
  ordersApi,
  walletApi,
  token,
} from "../api/client";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ── Auth ── */
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ── Data (loaded from API) ── */
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  /* ── UI State ── */
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState("buy");
  const [activeCat, setActiveCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailItem, setDetailItem] = useState(null);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ── Toast ── */
  const toast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3400,
    );
  }, []);

  /* ══ RESTORE SESSION on mount ════════════════════════════════ */
  useEffect(() => {
    const savedToken = token.get();
    if (!savedToken) {
      setAuthLoading(false);
      return;
    }

    authApi
      .me()
      .then((user) => {
        setCurrentUser(user);
        setRole(user.role);
        loadInitialData(user.role);
      })
      .catch(() => {
        token.remove();
      })
      .finally(() => setAuthLoading(false));
  }, []);

  /* ══ LOAD INITIAL DATA ════════════════════════════════════════ */
  async function loadInitialData(userRole) {
    try {
      const [cats, itemList] = await Promise.all([
        categoriesApi.list(),
        itemsApi.list(),
      ]);
      setCategories(cats);
      setItems(itemList);

      if (userRole === "admin" || userRole === "superadmin") {
        const [accs, ords] = await Promise.all([
          accountsApi.list(),
          ordersApi.list(),
        ]);
        setAccounts(accs);
        setOrders(ords);
      } else {
        const myOrders = await ordersApi.list();
        setOrders(myOrders);
        const myTx = await walletApi.myTransactions();
        setTransactions(myTx);
      }
    } catch (err) {
      console.error("loadInitialData error:", err);
    }
  }

  /* ══ AUTH ════════════════════════════════════════════════════ */
  const login = async (username, password) => {
    try {
      const { token: jwt, user } = await authApi.login(username, password);
      token.set(jwt);
      setCurrentUser(user);
      setRole(user.role);
      await loadInitialData(user.role);
      toast(`مرحباً ${user.name}`, "success");
      return user.role;
    } catch (err) {
      toast(err.message || "خطأ في تسجيل الدخول", "error");
      return null;
    }
  };

  const logout = (navigate) => {
    authApi.logout().catch(() => {});
    token.remove();
    setCart([]);
    setCartOpen(false);
    setRole(null);
    setCurrentUser(null);
    setCategories([]);
    setItems([]);
    setOrders([]);
    setAccounts([]);
    setActiveCat(null);
    setSearchTerm("");
    setAdminTab("dashboard");
    if (navigate) navigate("/login");
  };

  /* ══ CART ════════════════════════════════════════════════════ */
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
    toast(`${item.icon} أُضيف: ${item.name}`, "success");
  };

  const changeQty = (itemId, delta) =>
    setCart((prev) =>
      prev
        .map((c) => (c.item.id === itemId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const currentBalance = currentUser?.balance ?? 0;

  /* ══ SUBMIT ORDER ════════════════════════════════════════════ */
  const submitOrder = async (note) => {
    try {
      setLoading(true);
      const payload = {
        items: cart.map((c) => ({ item_id: c.item.id, qty: c.qty })),
        order_type: orderType,
        payment_method: paymentMethod,
        note,
      };

      const { order, balance: newBalance } = await ordersApi.create(payload);

      // Update local state
      setOrders((prev) => [order, ...prev]);
      if (newBalance !== null && newBalance !== undefined) {
        setCurrentUser((prev) => ({ ...prev, balance: newBalance }));
      }

      // Refresh transactions
      if (paymentMethod === "wallet") {
        const myTx = await walletApi.myTransactions();
        setTransactions(myTx);
      }

      setCart([]);
      setConfirmOpen(false);
      setPaymentMethod("wallet");
      toast(`✅ تم إرسال طلبك! رقم: #${order.id}`, "success");
    } catch (err) {
      toast(err.message || "فشل إرسال الطلب", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ══ ITEMS (Admin) ═══════════════════════════════════════════ */
  const addItem = async (data, imageFile) => {
    try {
      const newItem = await itemsApi.create(data, imageFile);
      setItems((prev) => [...prev, newItem]);
      toast(`✅ تمت إضافة ${newItem.name}`, "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const saveEditItem = async (id, data, imageFile) => {
    try {
      const updated = await itemsApi.update(id, data, imageFile);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast("✔ تم التحديث", "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const toggleAvail = async (id) => {
    try {
      const updated = await itemsApi.toggle(id);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast(
        `${updated.name}${updated.available ? " ✔ متاح" : " ✕ غير متاح"}`,
        "info",
      );
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const deleteItem = async (id) => {
    const item = items.find((i) => i.id === id);
    if (!item || !window.confirm(`حذف "${item.name}"؟`)) return;
    try {
      await itemsApi.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast(`🗑️ ${item.name}`, "error");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  /* ══ CATEGORIES (Admin) ══════════════════════════════════════ */
  const addCategory = async (cat) => {
    try {
      const newCat = await categoriesApi.create(cat);
      setCategories((prev) => [...prev, newCat]);
      toast(`✅ ${newCat.name}`, "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const deleteCategory = async (id) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    try {
      await categoriesApi.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast(`🗑️ ${cat.name}`, "error");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  /* ══ ACCOUNTS (Admin) ════════════════════════════════════════ */
  const addAccount = async (data) => {
    try {
      const acc = await accountsApi.create(data);
      setAccounts((prev) => [...prev, acc]);
      toast(`✅ ${acc.name}`, "success");
      return true;
    } catch (err) {
      toast(err.message, "error");
      return false;
    }
  };

  const deleteAccount = async (id) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc || !window.confirm(`حذف "${acc.name}"؟`)) return;
    try {
      await accountsApi.remove(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      toast(`🗑️ ${acc.name}`, "error");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const updateAccount = async (id, changes) => {
    try {
      const updated = await accountsApi.update(id, changes);
      setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (currentUser?.id === id)
        setCurrentUser((prev) => ({ ...prev, ...updated }));
      toast("✔ تم التحديث", "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const updateSelfProfile = async (changes) => {
    try {
      const updated = await accountsApi.updateMe(changes);
      setCurrentUser((prev) => ({ ...prev, ...updated }));
      toast("✔ تم التحديث", "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  /* ══ WALLET ══════════════════════════════════════════════════ */
  const depositBalance = async (accountId, amount) => {
    try {
      const result = await walletApi.deposit(accountId, amount);
      // Update local accounts balance
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountId ? { ...a, balance: result.new_balance } : a,
        ),
      );
      toast(`💰 تم الإيداع: ${amount.toLocaleString("ar")} د.ع`, "success");
      return true;
    } catch (err) {
      toast(err.message, "error");
      return false;
    }
  };

  const getTransactions = (accountId) =>
    accountId
      ? transactions.filter((t) => t.account_id === accountId)
      : transactions;

  /* ══ ORDERS STATUS (Admin) ═══════════════════════════════════ */
  const updateOrderStatus = async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
      toast(`#${orderId} → ${status}`, "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  /* ══ DB COMPATIBILITY SHIM (for components using DB.xxx) ════ */
  // This bridges components that still read from DB.xxx to the real API state
  const DB = {
    categories,
    items,
    orders,
    accounts,
    transactions,
  };

  /* ══ CONTEXT VALUE ═══════════════════════════════════════════ */
  const value = {
    // Auth
    role,
    currentUser,
    login,
    logout,
    authLoading,
    isAdmin: role === "admin" || role === "superadmin",
    isSuperAdmin: role === "superadmin",
    // Cart
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    changeQty,
    cartTotal,
    cartCount,
    currentBalance,
    // Order
    orderType,
    setOrderType,
    confirmOpen,
    setConfirmOpen,
    submitOrder,
    loading,
    paymentMethod,
    setPaymentMethod,
    // User UI
    activeCat,
    setActiveCat,
    searchTerm,
    setSearchTerm,
    detailItem,
    setDetailItem,
    // Admin
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
    updateOrderStatus,
    // Data (real API state)
    categories,
    items,
    orders,
    accounts,
    transactions,
    DB, // compatibility shim
    // Misc
    toast,
    toasts,
  };

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EFF6FF",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "4px solid #E3F2FD",
              borderTopColor: "#1565C0",
              borderRadius: "50%",
              animation: "spin .8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div
            style={{
              fontFamily: "Cairo,sans-serif",
              color: "#1565C0",
              fontWeight: 700,
            }}
          >
            جارٍ التحميل...
          </div>
        </div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
