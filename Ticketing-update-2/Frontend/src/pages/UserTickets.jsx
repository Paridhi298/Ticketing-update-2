import { useState, useEffect } from "react";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.companyId) {
      setError("❌ Company ID is missing. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/tickets/${user.companyId}/displayUserTicket`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        response.ok ? setTickets(data.tickets) : setError("❌ " + (data.message || "Failed to fetch tickets"));
      } catch {
        setError("⚠️ Error fetching tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.companyId, token]);

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Tickets</h2>
      {loading ? <p>Loading tickets...</p> : error ? <p className="text-red-500">{error}</p> : tickets.length === 0 ? <p>No tickets found.</p> : tickets.map(ticket => (
        <div key={ticket._id} className="bg-white p-6 rounded-xl shadow-lg mb-4">
          <h3 className="text-lg font-bold">{ticket.title}</h3>
          <p>{ticket.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UserTickets;
