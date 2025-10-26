import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLikes } from "../context/LikesContext";
import { toast } from "react-hot-toast";

export default function PropertyCard({ property, viewMode }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    toggleLike, 
    isPropertyLiked, 
    loading: likesLoading,
    error 
  } = useLikes();

  const [showLoginTooltip, setShowLoginTooltip] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    _id,
    title,
    city,
    category,
    images,
    attributes,
    propertyLocation,
    mapUrl,
    isVerified,
  } = property;

  const price = attributes?.price
    ? `₹${(attributes.price / 100000).toFixed(2)}L`
    : "Price on Request";

  // Check if property is liked using global state
  const isLiked = isPropertyLiked(_id);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      setShowLoginTooltip(true);
      setTimeout(() => setShowLoginTooltip(false), 3000);
      toast.error("Please login to save properties to your favorites");
      return;
    }

    const success = await toggleLike(_id);
    
    if (success) {
      if (isLiked) {
        toast.success("Removed from favorites");
      } else {
        toast.success("Added to favorites");
      }
    } else if (error) {
      toast.error(error);
    }
  };

  const handleLikeHover = () => {
    if (!user) {
      setShowLoginTooltip(true);
    }
  };

  const handleLikeLeave = () => {
    setShowLoginTooltip(false);
  };

  // List View Layout
  if (viewMode === "list") {
    return (
      <div
        onClick={() => navigate(`/property/${_id}`)}
        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-200"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="relative w-full sm:w-80 h-64 sm:h-auto overflow-hidden">
            <img
              src={images?.[0]?.url || "https://via.placeholder.com/600x400"}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isVerified && (
                <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              )}
              <div className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                {category}
              </div>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLikeToggle}
              onMouseEnter={handleLikeHover}
              onMouseLeave={handleLikeLeave}
              disabled={likesLoading && user}
              className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm z-10 ${
                user 
                  ? (isLiked 
                      ? "bg-red-500 text-white scale-110" 
                      : "bg-white/90 text-gray-600 hover:bg-white hover:scale-110")
                  : "bg-white/90 text-gray-400 hover:bg-white hover:scale-110"
              } ${(likesLoading && user) ? "opacity-50 cursor-not-allowed" : ""}`}
              title={user 
                ? (isLiked ? "Remove from favorites" : "Add to favorites") 
                : "Login to save properties"
              }
            >
              <svg
                className="w-5 h-5"
                fill={user && isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Login Tooltip */}
            {!user && showLoginTooltip && (
              <div className="absolute top-16 right-4 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-xl">
                Login to save properties
                <div className="absolute -top-1 right-4 w-3 h-3 bg-gray-900 transform rotate-45"></div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {title}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">{city}</span>
              </div>

              {propertyLocation && (
                <p className="text-gray-500 text-sm mb-4 pl-6">{propertyLocation}</p>
              )}

              {/* Property Details */}
              {(attributes?.bedrooms || attributes?.bathrooms || attributes?.square) && (
                <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-100">
                  {attributes.bedrooms > 0 && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-semibold">{attributes.bedrooms}</span>
                      <span className="text-sm text-gray-500">Beds</span>
                    </div>
                  )}
                  {attributes.bathrooms > 0 && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">{attributes.bathrooms}</span>
                      <span className="text-sm text-gray-500">Baths</span>
                    </div>
                  )}
                  {attributes.square > 0 && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      <span className="font-semibold">{attributes.square.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">sqft</span>
                    </div>
                  )}
                </div>
              )}

              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline mb-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Map
                </a>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <div className="text-3xl font-bold text-blue-600">{price}</div>
                {attributes?.price && attributes?.square && (
                  <div className="text-xs text-gray-500 mt-1">
                    ₹{(attributes.price / attributes.square).toFixed(0)}/sqft
                  </div>
                )}
              </div>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                <span className="font-medium">View Details</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout
  return (
    <div
      onClick={() => navigate(`/property/${_id}`)}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={images?.[0]?.url || "https://via.placeholder.com/600x400"}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isVerified && (
            <div className="flex items-center gap-1 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          {category}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          onMouseEnter={handleLikeHover}
          onMouseLeave={handleLikeLeave}
          disabled={likesLoading && user}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm z-10 ${
            user 
              ? (isLiked 
                  ? "bg-red-500 text-white scale-110" 
                  : "bg-white/90 text-gray-600 hover:bg-white hover:scale-110")
              : "bg-white/90 text-gray-400 hover:bg-white hover:scale-110"
          } ${(likesLoading && user) ? "opacity-50 cursor-not-allowed" : ""}`}
          title={user 
            ? (isLiked ? "Remove from favorites" : "Add to favorites") 
            : "Login to save properties"
          }
        >
          <svg
            className="w-5 h-5"
            fill={user && isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Login Tooltip */}
        {!user && showLoginTooltip && (
          <div className="absolute bottom-14 right-3 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-xl">
            Login to save properties
            <div className="absolute -bottom-1 right-4 w-3 h-3 bg-gray-900 transform rotate-45"></div>
          </div>
        )}

        {/* View Count Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-lg">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>124</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-gray-600 mb-1">
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium line-clamp-1">{city}</span>
        </div>

        {propertyLocation && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-1 pl-5.5">{propertyLocation}</p>
        )}

        {/* Property Details */}
        {(attributes?.bedrooms || attributes?.bathrooms || attributes?.square) && (
          <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-gray-100">
            {attributes.bedrooms > 0 && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm font-semibold">{attributes.bedrooms}</span>
              </div>
            )}
            {attributes.bathrooms > 0 && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold">{attributes.bathrooms}</span>
              </div>
            )}
            {attributes.square > 0 && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span className="text-sm font-semibold">{attributes.square.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-blue-600">{price}</div>
            {attributes?.price && attributes?.square && (
              <div className="text-xs text-gray-500 mt-0.5">
                ₹{(attributes.price / attributes.square).toFixed(0)}/sqft
              </div>
            )}
          </div>
          
          <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-medium">
            <span>View</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Map
          </a>
        )}
      </div>
    </div>
  );
}