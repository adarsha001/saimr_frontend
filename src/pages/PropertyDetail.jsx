import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../api";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading)
    return <div className="p-10 text-center text-gray-600">Loading...</div>;

  if (!property)
    return (
      <div className="p-10 text-center text-red-500">
        Property not found or failed to load.
      </div>
    );

  const {
    title,
    description,
    city,
    category,
    images,
    attributes,
    features,
    distanceKey,
    nearby,
    mapUrl,
    coordinates,
    isFeatured,
    isVerified,
    forSale,
  } = property;

  const nearbyIcons = {
    Hospital: "🏥",
    SuperMarket: "🛒",
    School: "🏫",
    Airport: "✈️",
    BusStop: "🚌",
    Pharmacy: "💊",
    Metro: "🚇",
  };

  const featureIcons = {
    Wifi: "📶",
    Parking: "🅿️",
    "Swimming pool": "🏊‍♂️",
    Balcony: "🌅",
    Garden: "🌳",
    Security: "🛡️",
    "Fitness center": "💪",
    "Children's Play Area": "🎠",
    "Laundry Room": "🧺",
    "Pets Allow": "🐶",
    "Spa & Massage": "💆",
    Electricity: "⚡",
    "Gated Community": "🚪",
    "Street Lamp": "💡",
    Drainage: "🚰",
    "Tennis Court": "🎾",
    "Lift(s)": "🛗",
    "Golf Course": "⛳",
    "Jogging Track": "🏃",
    "Club House": "🏠",
    "Senior Citizen Siteout": "🧓",
    "Squash Court": "🏸",
    "Yoga / Meditation Area": "🧘",
    Jacuzzi: "🛁",
    "Mini Theatre": "🎬",
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Title and Info */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-2">
          {isFeatured && <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">⭐ Featured</span>}
          {isVerified && <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">✔ Verified</span>}
          {!forSale && <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">For Lease</span>}
        </div>
      </div>

      <p className="text-gray-600 mb-4">{city} • {category}</p>

      {/* Images */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {images?.length ? (
          images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={title}
              className="rounded-xl shadow-md object-cover w-full h-64"
            />
          ))
        ) : (
          <p className="text-gray-500">No images available</p>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-6">{description}</p>

      {/* Price */}
      {attributes?.price && (
        <p className="text-2xl font-semibold text-green-700 mb-6">
          ₹{attributes.price.toLocaleString()}{" "}
          <span className="text-gray-600 text-base">({forSale ? "For Sale" : "For Lease"})</span>
        </p>
      )}

      {/* Attributes Section */}
      <div className="grid md:grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
        {attributes?.bedrooms && <p>🛏️ <strong>{attributes.bedrooms}</strong> Bedrooms</p>}
        {attributes?.bathrooms && <p>🚿 <strong>{attributes.bathrooms}</strong> Bathrooms</p>}
        {attributes?.floors && <p>🏢 <strong>{attributes.floors}</strong> Floors</p>}
        {attributes?.square && <p>📏 <strong>{attributes.square}</strong> sq.ft</p>}
        {attributes?.propertyLabel && <p>🏷️ Label: {attributes.propertyLabel}</p>}
        {attributes?.expectedROI && <p>📈 ROI: {attributes.expectedROI}%</p>}
        {attributes?.garden && <p>🌳 Private Garden</p>}
        {attributes?.balcony && <p>🌅 Balcony</p>}
        {attributes?.irrigationAvailable && <p>🚿 Irrigation Available</p>}
      </div>

      {/* Features */}
      {features?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">🏠 Features</h3>
          <div className="grid md:grid-cols-3 gap-2">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg p-2 flex items-center gap-2 text-gray-700"
              >
                <span>{featureIcons[f] || "✨"}</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby */}
      {nearby && Object.keys(nearby).length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">📍 Nearby</h3>
          <div className="grid md:grid-cols-3 gap-2">
            {Object.entries(nearby).map(([key, value]) =>
              value ? (
                <div
                  key={key}
                  className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 text-gray-700"
                >
                  <span>{nearbyIcons[key] || "📌"}</span>
                  <span>{key}: {value} km</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Distance Key */}
      {distanceKey?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">📏 Distance Highlights</h3>
          <ul className="list-disc list-inside text-gray-700">
            {distanceKey.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Map Location */}
      {mapUrl && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">🗺️ Location</h3>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Google Maps
          </a>
          {coordinates && (
            <p className="text-gray-600 mt-1">
              📍 Lat: {coordinates.latitude}, Lng: {coordinates.longitude}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
