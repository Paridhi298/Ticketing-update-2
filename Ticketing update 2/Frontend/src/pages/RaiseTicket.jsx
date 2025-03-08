import { useState } from "react";


const RaiseTicket = () => {
    const [ticketData, setTicketData] = useState({
        title: "",
        description: "",
        category: "",
        priority: "",
        companyId: ""
    });
    

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setTicketData({ ...ticketData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("User not authenticated. Please log in first");
            return;
        }
        try {
            const response = await fetch(`http://localhost:4000/api/tickets/${ticketData.companyId}/createTicket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: ticketData.title,
                    description: ticketData.description,
                    category: ticketData.category,
                    priority: ticketData.priority
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Ticket raised successfully");
                setTicketData({
                    title: "",
                    description: "",
                    category: "",
                    priority: "",
                    companyId: ""
                });
                
            } else {
                setMessage(data.message || "Failed to raise a ticket");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again");
            console.error("Raise ticket error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center max-h-screen bg-gradient-to-r from-blue-500 to bg-purple-500">
          <form
            onSubmit={handleSubmit}
            className=" shadow-lg rounded-2xl p-8 w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Raise a Ticket</h2>
    
            <input
              type="text"
              name="companyId"
              placeholder="Company ID"
              value={ticketData.companyId}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
    
            <input
              type="text"
              name="title"
              placeholder="Ticket Title"
              value={ticketData.title}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
    
            <textarea
              name="description"
              placeholder="Description"
              value={ticketData.description}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
    
            <select
              name="category"
              value={ticketData.category}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Category</option>
              <option value="Change Management">Change Management</option>
              <option value="Incident Management">Incident Management</option>
              <option value="Problem Management">Problem Management</option>
              <option value= "Request Management">Request Management</option>
            </select>
    
            <select
              name="priority"
              value={ticketData.priority}
              onChange={handleChange}
              className="w-full p-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Priority</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="L4">L4</option>
            </select>
    
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Raise Ticket
            </button>
    
            {message && (
              <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
            )}
            

            
          </form>
        </div>
      );
};

export default RaiseTicket;
    
