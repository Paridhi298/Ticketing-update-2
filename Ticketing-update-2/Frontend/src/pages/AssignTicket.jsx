import { useState, useEffect } from "react";

const AssignTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
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
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
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

  const assignTicket = async () => {
    if (!selectedTicket || !selectedAgent) {
      alert("Please select a ticket and an agent.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/admin/${companyId}/assign-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticketId: selectedTicket, agentId: selectedAgent }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Ticket assigned successfully!");
      } else {
        alert(data.message || "Failed to assign ticket.");
      }
    } catch (error) {
      alert("Error assigning ticket.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Assign Ticket to Agent</h2>

      <select onChange={(e) => setSelectedTicket(e.target.value)} className="p-2 border rounded w-full mb-4">
        <option value="">Select a Ticket</option>
        {tickets.map(ticket => (
          <option key={ticket._id} value={ticket._id}>{ticket.title}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedAgent(e.target.value)} className="p-2 border rounded w-full mb-4">
        <option value="">Select an Agent</option>
        {agents.map(agent => (
          <option key={agent._id} value={agent._id}>{agent.username}</option>
        ))}
      </select>

      <button onClick={assignTicket} className="bg-blue-600 text-white px-4 py-2 rounded">
        Assign Ticket
      </button>
    </div>
  );
};

export default AssignTicket;
