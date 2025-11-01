// components/ClickableSocial.jsx
import React from 'react';
import useClickTracker from '../hooks/useClickTracker';

const ClickableSocial = ({ 
  url, 
  type, 
  displayName, 
  propertyId, 
  className = '',
  children 
}) => {
  const { trackClick } = useClickTracker();

  const handleClick = async () => {
    // Track the click
    await trackClick({
      itemType: type,
      itemValue: url,
      displayName: displayName || type,
      propertyId: propertyId
    });

    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center space-x-2 transition-colors ${className}`}
    >
      {children}
    </a>
  );
};

export default ClickableSocial;