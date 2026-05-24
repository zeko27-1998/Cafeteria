import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import MyOrders from "./pages/MyOrders";
import AccountSettings from "./pages/AccountSettings";
import Toast from "./components/ui/Toast";
import CartSidebar from "./components/cart/CartSidebar";

/* ── Auth guard ── */
function RequireAuth({ children, allow }) {
  const { role } = useApp();
  if (!role) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(role)) {
    return <Navigate to={role === "user" ? "/menu" : "/admin"} replace />;
  }
  return children;
}

function Router() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* User routes */}
        <Route
          path="/menu"
          element={
            <RequireAuth allow={["user"]}>
              <UserPage />
            </RequireAuth>
          }
        />
        <Route
          path="/menu/orders"
          element={
            <RequireAuth allow={["user"]}>
              <MyOrders />
            </RequireAuth>
          }
        />
        <Route
          path="/menu/settings"
          element={
            <RequireAuth allow={["user"]}>
              <AccountSettings />
            </RequireAuth>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth allow={["admin", "superadmin"]}>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <RequireAuth allow={["admin", "superadmin"]}>
              <AccountSettings />
            </RequireAuth>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>

      <CartSidebar />
      <Toast />
    </>
  );
}

function RootRedirect() {
  const { role } = useApp();
  if (!role) return <Navigate to="/login" replace />;
  if (role === "user") return <Navigate to="/menu" replace />;
  return <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
