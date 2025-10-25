import React from "react";
import { useNavigate } from "react-router-dom";

export default function PropertyCard({ property, viewMode }) {
  const navigate = useNavigate(); // ✅ use the hook
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
    ? `₹${attributes.price.toLocaleString()}`
    : "Price on Request";

  return (
    <div
      onClick={() => navigate(`/property/${_id}`)} // ✅ Correct navigation
      className={`border rounded-xl shadow-sm hover:shadow-md transition bg-white cursor-pointer ${
        viewMode === "list" ? "flex gap-4" : ""
      }`}
    >
      {/* Image */}
      <img
        src={images?.[0]?.url || "https://via.placeholder.com/400x300"}
        alt={title}
        className={`${
          viewMode === "grid"
            ? "w-full h-56 object-cover rounded-t-xl"
            : "w-1/3 h-48 object-cover rounded-l-xl"
        }`}
      />

      {/* Info */}
      <div className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          {isVerified && (
            <span className="text-green-600 text-sm font-medium">Verified</span>
          )}
        </div>

        <p className="text-gray-600 text-sm mt-1">
          {city} • {category}
        </p>

        <p className="text-blue-700 font-bold mt-2">{price}</p>

        {attributes?.bedrooms && (
          <p className="text-gray-700 text-sm mt-1">
            🛏 {attributes.bedrooms} Beds • 🛁 {attributes.bathrooms || 0} Baths •{" "}
            📏 {attributes.square || 0} sqft
          </p>
        )}

        <p className="text-gray-500 text-sm mt-2">{propertyLocation}</p>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm underline mt-2 inline-block"
            onClick={(e) => e.stopPropagation()} // ✅ prevent navigation when map link clicked
          >
            View on Map
          </a>
        )}
      </div>
    </div>
  );
}
