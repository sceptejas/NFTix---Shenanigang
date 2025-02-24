import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="text-center space-y-8 px-4">
        <img 
          src="https://i.imgur.com/TgdLja5.png" 
          alt="NFTix Logo" 
          className="w-32 h-32 mx-auto animate-float"
        />
        <h1 className="text-6xl font-bold text-white font-montserrat">
          Welcome to <span className="text-blue-400">SFTix</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-montserrat">
          The future of event ticketing is here. Secure, transparent, and seamless experiences powered by blockchain technology.
        </p>
        <button
          onClick={() => navigate('/events')}
          className="group inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105"
        >
          <span>Let's Go</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default Landing;
