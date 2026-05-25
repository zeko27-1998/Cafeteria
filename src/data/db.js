/**
 * ════════════════════════════════════════
 *  DATABASE LAYER — db.js
 *  كل دالة مُعلَّمة بـ DB_API
 *  قابلة للاستبدال بـ fetch → SQLite/REST
 * ════════════════════════════════════════
 *
 *  نظام الصلاحيات:
 *  superadmin  ← مبرمج النظام (hardcoded)
 *  admin       ← مدير الكافتريا (يُضاف من قِبل superadmin)
 *  user        ← موظف عادي    (يُضاف من قِبل admin أو superadmin)
 */

// ── Super Admin — بيانات ثابتة في الكود (لا تُخزَّن في DB) ──────
export const SUPER_ADMIN = {
  username: "superadmin",
  password: "super@2025",
  name: "مدير النظام",
  role: "superadmin",
};

// ── In-memory store (يُستبدل لاحقاً بـ SQLite) ──────────────────
export const DB = {
  // ── الحسابات ────────────────────────────────────────────────
  // DB_API: جدول accounts
  accounts: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      name: "مدير الكافتريا",
      role: "admin",
      balance: 0,
      debt: 0,
    },
    {
      id: 2,
      username: "ahmed",
      password: "1234",
      name: "أحمد علي",
      role: "user",
      balance: 25000,
      debt: 0,
    },
    {
      id: 3,
      username: "sara",
      password: "1234",
      name: "سارة محمد",
      role: "user",
      balance: 15000,
      debt: 0,
    },
  ],

  // ── الفئات ──────────────────────────────────────────────────
  categories: [
    { id: 1, name: "وجبات رئيسية", icon: "🍔" },
    { id: 2, name: "مشروبات", icon: "🥤" },
    { id: 3, name: "حلويات", icon: "🍰" },
    { id: 4, name: "سلطات", icon: "🥗" },
    { id: 5, name: "وجبات خفيفة", icon: "🥪" },
  ],

  // ── الأصناف (image: base64 string | null) ───────────────────
  items: [
    {
      id: 1,
      name: "برجر دجاج",
      cat: 1,
      price: 2500,
      type: "buy",
      icon: "🍔",
      image: null,
      desc: "برجر دجاج مقرمش مع صوص خاص",
      available: true,
    },
    {
      id: 2,
      name: "بيتزا مشكلة",
      cat: 1,
      price: 3500,
      type: "cook",
      icon: "🍕",
      image: null,
      desc: "بيتزا طازجة بمكونات متنوعة",
      available: true,
    },
    {
      id: 3,
      name: "شاي حليب",
      cat: 2,
      price: 750,
      type: "buy",
      icon: "🧋",
      image: null,
      desc: "شاي كريمي بنكهة اللبن",
      available: true,
    },
    {
      id: 4,
      name: "عصير برتقال",
      cat: 2,
      price: 1000,
      type: "buy",
      icon: "🍊",
      image: null,
      desc: "عصير طازج يومياً",
      available: true,
    },
    {
      id: 5,
      name: "كيك شوكولاتة",
      cat: 3,
      price: 1500,
      type: "buy",
      icon: "🎂",
      image: null,
      desc: "كيك طري بكريمة الشوكولاتة",
      available: true,
    },
    {
      id: 6,
      name: "سلطة سيزر",
      cat: 4,
      price: 2000,
      type: "cook",
      icon: "🥗",
      image: null,
      desc: "خس طازج مع صوص سيزر والجبن",
      available: true,
    },
    {
      id: 7,
      name: "ساندويش تونة",
      cat: 5,
      price: 1200,
      type: "both",
      icon: "🥪",
      image: null,
      desc: "تونة مع خضروات في خبز أبيض",
      available: false,
    },
    {
      id: 8,
      name: "قهوة أمريكي",
      cat: 2,
      price: 800,
      type: "buy",
      icon: "☕",
      image: null,
      desc: "قهوة سوداء بدون سكر",
      available: true,
    },
    {
      id: 9,
      name: "دجاج مشوي",
      cat: 1,
      price: 4000,
      type: "cook",
      icon: "🍗",
      image: null,
      desc: "دجاج مشوي مع أرز وسلطة",
      available: true,
    },
    {
      id: 10,
      name: "كوكاكولا",
      cat: 2,
      price: 500,
      type: "buy",
      icon: "🥫",
      image: null,
      desc: "مشروب غازي مثلج",
      available: true,
    },
  ],

  orders: [],
  _nextItemId: 11,
  _nextOrderId: 1,
  _nextAccountId: 4,
  _nextTxId: 1,
  _nextDebtId: 1,
  transactions: [], // { id, accountId, accountName, type, amount, note, time, date }
  debts: [], // { id, accountId, accountName, amount, note, time, date }
};

// ── DB_API: جلب جميع الفئات ──────────────────────────────────────
// استبدال مستقبلي: GET /api/categories
export function dbGetCategories() {
  return [...DB.categories];
}

// ── DB_API: جلب الأصناف مع فلترة ────────────────────────────────
// استبدال مستقبلي: GET /api/items?cat=&q=
// orderType: 'buy' | 'cook' | 'custom' | null
export function dbGetItems(catId = null, search = "", orderType = null) {
  return DB.items.filter((i) => {
    const catOk = catId ? i.cat === catId : true;
    const searchOk = search
      ? i.name.includes(search) || i.desc.includes(search)
      : true;
    const typeOk =
      !orderType || orderType === "custom"
        ? true
        : orderType === "buy"
          ? i.type === "buy" || i.type === "both"
          : orderType === "cook"
            ? i.type === "cook" || i.type === "both"
            : true;
    return catOk && searchOk && typeOk;
  });
}

// ── DB_API: إضافة صنف ───────────────────────────────────────────
// استبدال مستقبلي: POST /api/items
export function dbAddItem(item) {
  const newItem = { ...item, id: DB._nextItemId++ };
  DB.items.push(newItem);
  return newItem;
}

// ── DB_API: تحديث صنف ───────────────────────────────────────────
// استبدال مستقبلي: PUT /api/items/:id
export function dbUpdateItem(id, changes) {
  const idx = DB.items.findIndex((i) => i.id === id);
  if (idx !== -1) DB.items[idx] = { ...DB.items[idx], ...changes };
  return DB.items[idx];
}

// ── DB_API: حذف صنف ─────────────────────────────────────────────
// استبدال مستقبلي: DELETE /api/items/:id
export function dbDeleteItem(id) {
  DB.items = DB.items.filter((i) => i.id !== id);
}

// ── DB_API: تبديل التوفر ────────────────────────────────────────
// استبدال مستقبلي: PATCH /api/items/:id/toggle
export function dbToggleAvail(id) {
  const item = DB.items.find((i) => i.id === id);
  if (item) item.available = !item.available;
  return item;
}

// ── DB_API: إضافة طلب ───────────────────────────────────────────
// استبدال مستقبلي: POST /api/orders
export function dbAddOrder(order) {
  const newOrder = {
    ...order,
    id: DB._nextOrderId++,
    time: new Date().toLocaleTimeString("ar-IQ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString("ar-IQ"),
    status: "قيد التحضير",
  };
  DB.orders.unshift(newOrder);
  return newOrder;
}

// ── DB_API: إضافة فئة ───────────────────────────────────────────
// استبدال مستقبلي: POST /api/categories
export function dbAddCategory(cat) {
  const newCat = {
    ...cat,
    id: Math.max(0, ...DB.categories.map((c) => c.id)) + 1,
  };
  DB.categories.push(newCat);
  return newCat;
}

// ── DB_API: حذف فئة ─────────────────────────────────────────────
// استبدال مستقبلي: DELETE /api/categories/:id
export function dbDeleteCategory(id) {
  DB.categories = DB.categories.filter((c) => c.id !== id);
}

// ── DB_API: البحث عن حساب بالبيانات ────────────────────────────
// استبدال مستقبلي: POST /api/auth/login
export function dbFindAccount(username, password) {
  return (
    DB.accounts.find(
      (a) => a.username === username && a.password === password,
    ) || null
  );
}

// ── DB_API: إضافة حساب جديد ─────────────────────────────────────
// استبدال مستقبلي: POST /api/accounts
export function dbAddAccount(account) {
  const exists = DB.accounts.some((a) => a.username === account.username);
  if (exists) return null; // اسم المستخدم مكرر
  const newAcc = { debt: 0, ...account, id: DB._nextAccountId++ };
  DB.accounts.push(newAcc);
  return newAcc;
}

// ── DB_API: تحديث حساب ──────────────────────────────────────────
// استبدال مستقبلي: PUT /api/accounts/:id
export function dbUpdateAccount(id, changes) {
  const idx = DB.accounts.findIndex((a) => a.id === id);
  if (idx !== -1) DB.accounts[idx] = { ...DB.accounts[idx], ...changes };
  return DB.accounts[idx];
}

// ── DB_API: حذف حساب ────────────────────────────────────────────
// استبدال مستقبلي: DELETE /api/accounts/:id
export function dbDeleteAccount(id) {
  DB.accounts = DB.accounts.filter((a) => a.id !== id);
  DB.transactions = DB.transactions.filter((t) => t.accountId !== id);
  DB.debts = DB.debts.filter((d) => d.accountId !== id);
}

// ── DB_API: إيداع رصيد في حساب ──────────────────────────────────
// استبدال مستقبلي: POST /api/accounts/:id/deposit
export function dbDeposit(id, amount) {
  const acc = DB.accounts.find((a) => a.id === id);
  if (!acc) return null;
  acc.balance = (acc.balance || 0) + amount;
  // Log transaction
  DB.transactions.push({
    id: DB._nextTxId++,
    accountId: id,
    accountName: acc.name,
    type: "deposit",
    amount,
    note: "إيداع من المدير",
    time: new Date().toLocaleTimeString("ar-IQ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString("ar-IQ"),
  });
  return acc;
}

// ── DB_API: استقطاع رصيد (عند الشراء) ───────────────────────────
// استبدال مستقبلي: POST /api/accounts/:id/deduct
export function dbDeduct(id, amount) {
  const acc = DB.accounts.find((a) => a.id === id);
  if (!acc) return { ok: false, reason: "account_not_found" };
  if ((acc.balance || 0) < amount)
    return { ok: false, reason: "insufficient", balance: acc.balance };
  acc.balance -= amount;
  DB.transactions.push({
    id: DB._nextTxId++,
    accountId: id,
    accountName: acc.name,
    type: "deduct",
    amount,
    note: "شراء من الكافتريا",
    time: new Date().toLocaleTimeString("ar-IQ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString("ar-IQ"),
  });
  return { ok: true, balance: acc.balance };
}

// ── DB_API: سجل المعاملات ────────────────────────────────────────
// استبدال مستقبلي: GET /api/transactions?accountId=
export function dbGetTransactions(accountId = null) {
  return accountId
    ? DB.transactions.filter((t) => t.accountId === accountId)
    : [...DB.transactions];
}

export function dbAddDebt(id, amount, note = "") {
  const acc = DB.accounts.find((a) => a.id === id);
  if (!acc) return null;
  acc.debt = (acc.debt || 0) + amount;
  const debt = {
    id: DB._nextDebtId++,
    accountId: id,
    accountName: acc.name,
    amount,
    note: note || "دين مسجل من المدير",
    time: new Date().toLocaleTimeString("ar-IQ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString("ar-IQ"),
  };
  DB.debts.push(debt);
  DB.transactions.push({
    id: DB._nextTxId++,
    accountId: id,
    accountName: acc.name,
    type: "debt",
    amount,
    note: debt.note,
    time: debt.time,
    date: debt.date,
  });
  return { account: acc, debt };
}

export function dbPayDebt(id, amount) {
  const acc = DB.accounts.find((a) => a.id === id);
  if (!acc) return { ok: false, reason: "account_not_found" };
  const paid = Math.min(amount, acc.debt || 0);
  acc.debt = Math.max(0, (acc.debt || 0) - paid);
  DB.transactions.push({
    id: DB._nextTxId++,
    accountId: id,
    accountName: acc.name,
    type: "debt_payment",
    amount: paid,
    note: "تسديد دين",
    time: new Date().toLocaleTimeString("ar-IQ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString("ar-IQ"),
  });
  return { ok: true, debt: acc.debt };
}

export function dbGetDebts(accountId = null) {
  return accountId ? DB.debts.filter((d) => d.accountId === accountId) : [...DB.debts];
}

// ── Helpers ──────────────────────────────────────────────────────
export const TYPE_AR = { buy: "جاهز", cook: "طازج", both: "جاهز/طازج" };
export const typeAr = (t) => TYPE_AR[t] || t;

export const ROLE_AR = { superadmin: "سوبر أدمن", admin: "مدير", user: "موظف" };
export const ROLE_BADGE = { superadmin: "red", admin: "blue", user: "green" };

export const EMOJIS = [
  "🍔",
  "🍕",
  "🌮",
  "🌯",
  "🥪",
  "🍗",
  "🥩",
  "🍖",
  "🥚",
  "🍳",
  "🥞",
  "🧇",
  "🥓",
  "🍟",
  "🌭",
  "🥨",
  "🧀",
  "🥗",
  "🥙",
  "🍱",
  "🍜",
  "🍝",
  "🍛",
  "🍲",
  "🥘",
  "🥫",
  "🍣",
  "🍤",
  "🍙",
  "🍚",
  "🧆",
  "🥜",
  "🍞",
  "🥐",
  "🥖",
  "🧁",
  "🍰",
  "🎂",
  "🍮",
  "🍭",
  "🍬",
  "🍫",
  "🍩",
  "🍪",
  "🍦",
  "🍧",
  "🍨",
  "🥧",
  "🧃",
  "🥤",
  "☕",
  "🧋",
  "🍵",
  "🍶",
  "🥛",
  "🧊",
  "🍇",
  "🍈",
  "🍉",
  "🍊",
  "🍋",
  "🍌",
  "🍍",
  "🥭",
  "🍎",
  "🍏",
  "🍐",
  "🍑",
  "🍒",
  "🍓",
  "🫐",
];
