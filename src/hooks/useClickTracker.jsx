// hooks/useClickTracker.js
import { useCallback } from 'react';

const useClickTracker = () => {
  const trackClick = useCallback(async (clickData) => {
    try {
      const response = await fetch('/api/clicks/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...clickData,
          pageUrl: window.location.href,
          timestamp: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Click tracking failed:', error);
      return false;
    }
  }, []);

  return { trackClick };
};

export default useClickTracker;