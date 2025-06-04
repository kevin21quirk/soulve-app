
import { useEffect, useState } from 'react';

const MobileLoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">SouLVE</h1>
        <p className="text-gray-600">Loading{dots}</p>
      </div>
    </div>
  );
};

export default MobileLoadingScreen;
