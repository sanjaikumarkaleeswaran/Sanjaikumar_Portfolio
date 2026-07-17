import React, { useState, useEffect } from 'react';
import { RecruiterHubDesktop } from './RecruiterHubDesktop';
import { RecruiterHubMobile } from './RecruiterHubMobile';

interface ResponsiveRecruiterHubProps {
  setIsAICopilotOpen: (open: boolean) => void;
}

export const ResponsiveRecruiterHub: React.FC<ResponsiveRecruiterHubProps> = ({ setIsAICopilotOpen }) => {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (width >= 1024) {
    return <RecruiterHubDesktop />;
  }
  return <RecruiterHubMobile setIsAICopilotOpen={setIsAICopilotOpen} />;
};
