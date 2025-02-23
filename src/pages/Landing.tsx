import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigRight } from "lucide-react";
import PromptingIsAllYouNeed from "../components/promptings";

function Landing() {
  const navigate = useNavigate();

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
    //   <div className="text-center space-y-8 px-4">
    //     <img
    //       src="https://i.imgur.com/C2cutQL.png"
    //       alt="NFTix Logo"
    //       className="w-32 h-32 mx-auto animate-float"
    //     />
    //     <h1 className="text-6xl font-bold text-white font-montserrat">
    //       Welcome to <span className="text-blue-400">NFTix</span>
    //     </h1>
    //     <p className="text-xl text-gray-300 max-w-2xl mx-auto font-montserrat">
    //       The future of event ticketing is here. Secure, transparent, and seamless experiences powered by blockchain technology.
    //     </p>
    //     <button
    //       onClick={() => navigate('/events')}
    //       className="group inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105"
    //     >
    //       <span>Let's Go</span>
    //       <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    //     </button>
    //   </div>
    // </div>
    <div className="relative h-screen w-full">
      <PromptingIsAllYouNeed />
      <button
        type="button"
        className="text-white flex flex-row gap-3 absolute top-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 z-50 bg-black px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-white hover:text-black hover:scale-110"
        onClick={() => {
          navigate("/events");
        }}
      >
        Lets Get Started <ArrowBigRight />
      </button>
    </div>
  );
}

export default Landing;
