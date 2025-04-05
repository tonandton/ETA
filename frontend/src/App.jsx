import { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AccountPage from "./pages/AccountPage";
import Transactions from "./pages/Transactions";
import useStore from "./store";
// import "./App.css";

const RootLayout = () => {
  const user = useStore((state) => state);
  console.log(user);

  return !user ? (
    <Navigate to="sign-in" replace={true} />
  ) : (
    <>
      <div>
        <Outlet></Outlet>
      </div>
    </>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <div>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/overview" />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="/sign-in" element={<SignUp />} />
          <Route path="/sign-up" element={<SignIn />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
