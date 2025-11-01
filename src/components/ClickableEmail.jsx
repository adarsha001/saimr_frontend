// components/ClickableEmail.jsx
import React from 'react';
import useClickTracker from '../hooks/useClickTracker';

const ClickableEmail = ({ email, displayName, propertyId, className = '' }) => {
  const { trackClick } = useClickTracker();

  const handleClick = async () => {
    // Track the click
    await trackClick({
      itemType: 'email',
      itemValue: email,
      displayName: displayName || 'Email',
      propertyId: propertyId
    });

    // Open email client
    window.location.href = `mailto:${email}`;
  };

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={`text-blue-600 hover:text-blue-800 transition-colors ${className}`}
    >
      {email}
    </a>
  );
};

export default ClickableEmail;