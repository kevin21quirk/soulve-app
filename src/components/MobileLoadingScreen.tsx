
import { useEffect, useState } from 'react';
import SouLVELogo from './SouLVELogo';

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
        <div className="mb-4">
          <SouLVELogo size="medium" />
        </div>
        <p className="text-gray-600">Loading{dots}</p>
      </div>
    </div>
  );
};

export default MobileLoadingScreen;
