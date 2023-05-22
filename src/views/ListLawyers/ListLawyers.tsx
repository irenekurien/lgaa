import React, { useState } from 'react';
import { LawyerDetailsType } from 'views/LawyerDetails/LawyerDetails';

const lawyersData = [
  {
    id: 1,
    name: 'John Doe',
    areaOfWork: 'Criminal Law',
    place: 'New York',
  },
  {
    id: 2,
    name: 'Jane Smith',
    areaOfWork: 'Family Law',
    place: 'Los Angeles',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    areaOfWork: 'Corporate Law',
    place: 'Chicago',
  },
];

const LawyerCard = ({ name, areaOfWork, place }: LawyerDetailsType) => {

  return (
    <div className="border border-gray-300 rounded p-4 mb-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{areaOfWork}</p>
      <p className="text-gray-600">{place}</p>
    </div>
  );
};

const LawyerList = () => {
  const [filter, setFilter] = useState({ areaOfWork: '', place: '' });

  const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const filteredLawyers = lawyersData.filter((lawyer) => {
    const { areaOfWork, place } = filter;
    return (
      (areaOfWork === '' || lawyer.areaOfWork.toLowerCase().includes(areaOfWork.toLowerCase())) &&
      (place === '' || lawyer.place.toLowerCase().includes(place.toLowerCase()))
    );
  });

  return (
    <div>
      <div className="mb-4">
        <label className="mr-2">Area of Work:</label>
        <input
          type="text"
          name="areaOfWork"
          value={filter.areaOfWork}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Place:</label>
        <input
          type="text"
          name="place"
          value={filter.place}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded p-2"
        />
      </div>
      <div>
        {filteredLawyers.map((lawyer) => (
          <LawyerCard key={lawyer.id} areaOfWork={filter.areaOfWork} place={filter.place} name={filter.name} />
        ))}
      </div>
    </div>
  );
};

export default LawyerList;
