import { useState } from "react";

const RaiseTicket = () => {
  const [ticketData, setTicketData] = useState({ title: "", description: "", category: "", priority: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setTicketData({ ...ticketData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const response = await fetch("http://localhost:4000/api/tickets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        setMessage("✅ Ticket submitted successfully!");
        setTicketData({ title: "", description: "", category: "", priority: "" });
      } else {
        setMessage("❌ Submission failed!");
      }
    } catch {
      setMessage("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Raise a Ticket</h2>

        <input name="title" placeholder="Ticket Title" value={ticketData.title} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <textarea name="description" placeholder="Description" value={ticketData.description} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">Submit</button>

        {message && <p className="text-center text-gray-700 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default RaiseTicket;
