// components/ClickablePhone.jsx
import React from 'react';
import useClickTracker from '../hooks/useClickTracker';

const ClickablePhone = ({ phoneNumber, displayName, propertyId, className = '' }) => {
  const { trackClick } = useClickTracker();

  const handleClick = async () => {
    // Track the click
    await trackClick({
      itemType: 'phone',
      itemValue: phoneNumber,
      displayName: displayName || 'Phone Number',
      propertyId: propertyId
    });

    // Open phone app
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <a
      href={`tel:${phoneNumber}`}
      onClick={handleClick}
      className={`text-blue-600 hover:text-blue-800 transition-colors ${className}`}
    >
      {phoneNumber}
    </a>
  );
};

export default ClickablePhone;