
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0ce4af] to-[#18a5fe] flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-6">SouLVE</h1>
        <p className="text-xl mb-8">Connect. Help. Transform.</p>
        <Button 
          onClick={() => navigate('/mobile')}
          className="bg-white text-[#18a5fe] hover:bg-gray-100"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
