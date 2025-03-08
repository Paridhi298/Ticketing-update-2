
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="flex items-center space-x-8">
          <img src="/path-to-your-image.jpeg" alt="ResolvNow" className="w-1/2 h-auto" />
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">ResolvNow: Your One Stop Solution to All Needs</h1>
            <button
              onClick={handleSignIn}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>©️ 2025 ResolvNow. All rights reserved.</p>
        <p>Please visit <a href="www.resolvnow.com" className="text-blue-400">www.resolvnow.com</a></p>
      </footer>
    </div>
  );
};

export default LandingPage;