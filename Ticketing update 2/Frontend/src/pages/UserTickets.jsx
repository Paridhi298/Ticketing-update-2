import { useState, useEffect } from "react";

const UserTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ensure user is retrieved correctly
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const companyId = user?.companyId || null;

    useEffect(() => {
        console.log("User from localStorage:", user);
        console.log("Company ID:", companyId);

        if (!companyId) {
            setError("Company ID is missing. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/tickets/${companyId}/displayUserTicket`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setTickets(data.tickets);
                } else {
                    setError(data.message || "Failed to fetch tickets");
                }
            } catch (err) {
                setError("Error fetching tickets. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [user,companyId, token]);

    return (
        <div className="min-h-screen bg-white p-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Tickets</h2>

            {loading && <p className="text-gray-700 text-lg">Loading tickets...</p>}
            {error && <p className="text-red-500 text-lg">{error}</p>}

            {!loading && !error && tickets.length === 0 && (
                <p className="text-gray-600 text-lg">No tickets found.</p>
            )}

            {!loading && !error && tickets.length > 0 && (
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                        <div key={ticket._id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{ticket.title}</h3>
                            <p className="text-gray-600">{ticket.description}</p>
                            <p className="text-sm font-medium text-blue-600 mt-2">Status: {ticket.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserTickets;