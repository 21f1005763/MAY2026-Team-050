import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { restoreSession } from "./api/client";
import { useAuth } from "./auth/AuthContext";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthenticatedShell from "./components/AuthenticatedShell";

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}

export default function App() {
  const { login } = useAuth();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let cancelled = false;
    restoreSession().then((token) => {
      if (cancelled) return;
      if (token) login(token);
      setIsRestoring(false);
    });
    return () => {
      cancelled = true;
    };
  }, [login]);

  if (isRestoring) return null;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
