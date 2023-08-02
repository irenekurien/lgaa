import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Legal Bot</h1>
      <p className="text-xl text-gray-600 text-center mb-8">
        A context-driven AI chat system that helps you understand law and find the right lawyer.
      </p>
      <div className="mb-8">
        <Link to="/chat" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded">
          Start Chat
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
