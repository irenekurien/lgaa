import React from 'react';

export type LawyerDetailsType = { 
    name: string,
    areaOfWork: string, 
    place: string, 
    contactInfo: string, 
    experience: string, 
    education: string, 
    reviews: Array<string>, 
    ratings: Array<number> 
}

const LawyerDetailsPage = ({ name, areaOfWork, place, contactInfo, experience, education, reviews, ratings }: LawyerDetailsType) => {

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">{name}</h2>
      <p className="text-lg text-gray-600 mb-4">{areaOfWork}</p>
      <p className="text-lg text-gray-600 mb-4">{place}</p>
      <p className="text-lg text-gray-600 mb-4">{contactInfo}</p>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Experience</h3>
        <p>{experience}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Education</h3>
        <p>{education}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews available</p>
        ) : (
          <ul>
            {reviews.map((review: string, index: React.Key) => (
              <li key={index} className="mb-2">
                {review}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Ratings</h3>
        {ratings.length === 0 ? (
          <p>No ratings available</p>
        ) : (
          <ul>
            {ratings.map((rating: number, index: React.Key) => (
              <li key={index} className="mb-2">
                {rating}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LawyerDetailsPage;
