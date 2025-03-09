import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "", companyId: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("🔄 Registering...");

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage("❌ " + (data.message || "Registration failed"));
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-10 w-full max-w-lg space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>

        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" />

        <select name="role" value={formData.role} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black">
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input type="text" name="companyId" placeholder="Company ID" value={formData.companyId} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" />

        <button type="submit" className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">Register</button>

        {message && <p className="text-center text-red-500 font-medium">{message}</p>}
      </form>
    </div>
  );
};

export default UserRegister;




