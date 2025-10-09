import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

/**
 * Component to track page views in Google Analytics 4
 * Place this inside your Router component
 */
export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
    
    if (GA4_MEASUREMENT_ID) {
      ReactGA.send({ 
        hitType: 'pageview', 
        page: location.pathname + location.search,
        title: document.title 
      });
    }
  }, [location]);

  return null;
};
