import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    companyId: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <input type="text" name="companyId" placeholder="Company ID" value={formData.companyId} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" required />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" required />

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" required />

        <button type="submit" className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition">Login</button>

        {message && <p className="text-center text-red-500 font-medium">{message}</p>}
      </form>
    </div>
  );
};

export default UserLogin;






