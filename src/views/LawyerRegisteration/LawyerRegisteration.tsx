import { Input } from 'components';
import React, { useState } from 'react';

const LawyerRegistrationPage = () => {
  const [name, setName] = useState('');
  const [areaOfWork, setAreaOfWork] = useState('');
  const [place, setPlace] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Perform lawyer registration logic here
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Lawyer Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Area of Work:</label>
            <input
              type="text"
              value={areaOfWork}
              onChange={(e) => setAreaOfWork(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Place:</label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Contact Info:</label>
            <textarea
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Experience:</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              rows={5}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Education:</label>
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              rows={5}
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default LawyerRegistrationPage;
