import { useState } from "react";
import { Link } from "react-router-dom";

const AdminInterface = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-blue-600 text-white w-64 p-5 space-y-6 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="space-y-4">
          <Link to="/admin/dashboard" className="block hover:bg-blue-700 p-3 rounded-md">Dashboard</Link>
          <Link to="/admin/tickets" className="block hover:bg-blue-700 p-3 rounded-md">View Tickets</Link>
          <Link to="/admin/assign-ticket" className="block hover:bg-blue-700 p-3 rounded-md">Assign Tickets</Link>
          <Link to="/admin/manage-agents" className="block hover:bg-blue-700 p-3 rounded-md">Manage Agents</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <button 
          className="md:hidden bg-blue-600 text-white p-2 rounded-md mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin!</h1>
        <p className="text-gray-700 mt-2">Manage agents and tickets from here.</p>
      </div>
    </div>
  );
};

export default AdminInterface;
