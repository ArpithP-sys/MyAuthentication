import React, { useContext } from "react";
import { Bot, ArrowRight } from "lucide-react";
import { AppContent } from "../context/AppContext";

const Header = () => {
  const { userData, loading, isLoggedin } = useContext(AppContent);

  const displayName = isLoggedin && userData?.name ? userData.name : "what's up!";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 ">
      <Bot size={64} className="text-blue-700 drop-shadow-lg mb-4 animate-bounce" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
        {loading ? "Loading..." : `Hey,${displayName}`}!
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mt-2">
        Let’s explore the Auth website
      </p>
      <button className="mt-6 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg transition duration-300">
        Get Started
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default Header;
