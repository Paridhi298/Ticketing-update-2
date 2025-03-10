import { useState, useEffect } from "react";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState({ priority: "", status: "", assignedTo: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const companyId = user?.companyId;

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/${companyId}/tickets`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setTickets(data);
      } else {
        setError(data.message || "Failed to fetch tickets");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Error fetching tickets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/${companyId}/agents`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setAgents(data);
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  const updatePriority = async (ticketId, priority) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/tickets/${ticketId}/update-priority`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ priority }),
      });

      if (response.ok) {
        fetchTickets(); // Refresh tickets after update
      }
    } catch (err) {
      console.error("Error updating priority:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Tickets</h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select onChange={(e) => setFilter({ ...filter, priority: e.target.value })} className="p-2 border rounded">
          <option value="">All Priorities</option>
          <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="L3">L3</option>
          <option value="L4">L4</option>
        </select>

        <select onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="p-2 border rounded">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select onChange={(e) => setFilter({ ...filter, assignedTo: e.target.value })} className="p-2 border rounded">
          <option value="">All Agents</option>
          {agents.map(agent => (
            <option key={agent._id} value={agent._id}>{agent.username}</option>
          ))}
        </select>
      </div>

      {loading ? <p>Loading tickets...</p> : error ? <p className="text-red-500">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets
          .filter(ticket => (filter.priority ? ticket.priority === filter.priority : true))
          .filter(ticket => (filter.status ? ticket.status === filter.status : true))
          .filter(ticket => (filter.assignedTo ? ticket.assignedTo === filter.assignedTo : true))
          .map(ticket => (
            <div key={ticket._id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{ticket.title}</h3>
              <p>{ticket.description}</p>
              <p className="text-sm">Priority: {ticket.priority}</p>
              <p className="text-sm">Status: {ticket.status}</p>
              <p className="text-sm">Assigned to: {ticket.assignedTo || "Unassigned"}</p>

              <select onChange={(e) => updatePriority(ticket._id, e.target.value)} className="mt-2 p-2 border rounded">
                <option value="">Change Priority</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="L4">L4</option>
              </select>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminTickets;
