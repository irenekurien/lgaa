import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to LegalBot</h1>
      <p className="text-xl text-gray-600 text-center mb-8">
        A context-driven AI chat system that helps you understand law and find the right lawyer.
      </p>
      <div className="mb-8">
        <Link to="/chat" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded">
          Start Chat
        </Link>
      </div>
      <div className="flex justify-center mb-8">
        <Link to="/lawyer-profile" className="mr-4 text-blue-500 hover:text-blue-600">
          Create Lawyer Profile
        </Link>
        <Link to="/faq" className="text-blue-500 hover:text-blue-600">
          FAQ
        </Link>
      </div>
      <div className="mb-8">
        <Link to="/appointment-booking" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded">
          Book an Appointment
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
