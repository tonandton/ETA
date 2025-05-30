import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AccountPage from "./pages/AccountPage";
import Transactions from "./pages/Transactions";
import useStore from "./store";
import { setAuthToken } from "./libs/apiCall";
import { Toaster } from "sonner";
import Navbar from "./components/navbar";
// import "./App.css";

const RootLayout = () => {
  const { user } = useStore((state) => state);
  setAuthToken(user?.token || "");

  return !user ? (
    <Navigate to="sign-in" replace={true} />
  ) : (
    <>
      <Navbar />
      <div className="min-h[cal(h-screen-10px)]">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  const { theme } = useStore((state) => state);
  const { setCredentials } = useStore((state) => state);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      // document.body.classList.add("light");
    }
  }, [theme]);

  useEffect(() => {
    const storeUser = localStorage.getItem("user");
    if (storeUser) {
      const parsed = JSON.parse(storeUser);
      if (parsed && parsed.firstname) {
        console.log("✅ Loaded user from localStorage:", parsed);
        setCredentials(parsed);
        setAuthToken(parsed.token);
      } else {
        console.warn("⚠️ localStorage user is invalid:", parsed);
      }
    } else {
      console.log("❌ No user found in local storage");
    }
  }, []);

  return (
    <main>
      <div className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900">
        <div>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Navigate to="/overview" />} />
              <Route path="/overview" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/accounts" element={<AccountPage />} />
            </Route>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </div>
      </div>

      <Toaster richColors position="top-center" />
    </main>
  );
}

export default App;
