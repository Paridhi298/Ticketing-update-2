import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import RaiseTicket from "./pages/RaiseTicket";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminInterface";
import LandingPage from "./pages/LandingPage";
import UserTickets from "./pages/UserTickets";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />

        {/* Role-based Redirection */}
        <Route path="/dashboard" element={user?.role === "user" ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />

        <Route path="/createTicket" element={<RaiseTicket />} />
        <Route path="/displayUserTickets" element={<UserTickets />} />
      </Routes>
    </Router>
  );
};

export default App;








