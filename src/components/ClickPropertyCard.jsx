// Example usage in PropertyCard.jsx
import React from 'react';
import ClickablePhone from './ClickablePhone';
import ClickableEmail from './ClickableEmail';
import ClickableSocial from './ClickableSocial';

const ClickPropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">{property.title}</h3>
      
      {/* Contact Information */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <PhoneIcon className="w-5 h-5 text-gray-500" />
          <ClickablePhone 
            phoneNumber={property.phone}
            displayName="Property Phone"
            propertyId={property._id}
            className="font-medium"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <MailIcon className="w-5 h-5 text-gray-500" />
          <ClickableEmail 
            email={property.email}
            displayName="Owner Email"
            propertyId={property._id}
            className="font-medium"
          />
        </div>
        
        {/* Social Links */}
        <div className="flex space-x-4 pt-2">
          {property.instagram && (
            <ClickableSocial
              url={property.instagram}
              type="instagram"
              displayName="Instagram"
              propertyId={property._id}
              className="text-pink-600 hover:text-pink-700"
            >
              <InstagramIcon className="w-5 h-5" />
              <span>Instagram</span>
            </ClickableSocial>
          )}
          
          {property.facebook && (
            <ClickableSocial
              url={property.facebook}
              type="facebook"
              displayName="Facebook"
              propertyId={property._id}
              className="text-blue-600 hover:text-blue-700"
            >
              <FacebookIcon className="w-5 h-5" />
              <span>Facebook</span>
            </ClickableSocial>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClickPropertyCard;