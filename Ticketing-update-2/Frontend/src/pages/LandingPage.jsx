import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-white">
        <h1 className="text-4xl font-extrabold mb-4">ResolvNow: Your One Stop Solution</h1>
        <p className="text-lg max-w-2xl mb-6">Effortlessly manage and resolve tickets in a streamlined way.</p>
        <button onClick={() => navigate('/register')} className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition">Get Started</button>
      </div>
      <footer className="bg-gray-900 text-white text-center p-4">
        <p>©️ 2025 ResolvNow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
