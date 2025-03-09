import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">

        {/* Create Ticket Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center transition hover:scale-105">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create <span className="text-blue-600">Ticket</span></h2>
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" alt="Create Ticket" className="mx-auto w-24 h-24 mb-4"/>
          <p className="text-gray-600 mb-6">Raise your queries and report issues easily.</p>
          <button onClick={() => navigate("/createTicket")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Create</button>
        </div>

        {/* Display Ticket Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center transition hover:scale-105">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Display <span className="text-blue-600">Tickets</span></h2>
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" alt="Display Ticket" className="mx-auto w-24 h-24 mb-4"/>
          <p className="text-gray-600 mb-6">Track your ticket progress easily.</p>
          <button onClick={() => navigate("/displayUserTickets")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">View Tickets</button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
