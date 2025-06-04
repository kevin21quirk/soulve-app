
import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Profile: {userId}</h1>
        <p className="text-gray-600">Profile page content coming soon...</p>
      </div>
    </div>
  );
};

export default ProfilePage;
