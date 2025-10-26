import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading property details...</p>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or failed to load.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  const {
    title,
    description,
    content,
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
    price,
    propertyLocation,
    createdBy,
    createdAt,
    updatedAt
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGoogleMapsEmbedUrl = () => {
    if (coordinates?.latitude && coordinates?.longitude) {
      return `https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&z=15&output=embed`;
    }
    if (mapUrl) {
      const coordMatch = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`;
      }
      if (mapUrl.includes('maps.google.com') || mapUrl.includes('goo.gl/maps')) {
        return mapUrl.replace('/?', '/embed?');
      }
    }
    if (propertyLocation && city) {
      const query = encodeURIComponent(`${propertyLocation}, ${city}`);
      return `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
    }
    if (city) {
      const query = encodeURIComponent(city);
      return `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
    }
    return null;
  };

  const getGoogleMapsViewUrl = () => {
    if (mapUrl) return mapUrl;
    if (coordinates?.latitude && coordinates?.longitude) {
      return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
    }
    if (propertyLocation && city) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyLocation + ', ' + city)}`;
    }
    if (city) {
      return `https://www.google.com/maps/place/${encodeURIComponent(city)}`;
    }
    return "#";
  };

  const embedUrl = getGoogleMapsEmbedUrl();
  const viewUrl = getGoogleMapsViewUrl();

  const displayPrice = price 
    ? (typeof price === "number" ? `₹${(price / 100000).toFixed(2)}L` : price)
    : "Price on Request";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to listings</span>
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {isFeatured && (
                    <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  )}
                  {isVerified && (
                    <span className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                  <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                    {forSale ? "For Sale" : "For Lease"}
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                    {category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-lg font-medium">{propertyLocation || city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {displayPrice}
                </div>
                {attributes?.square && typeof price === "number" && (
                  <p className="text-sm text-gray-500">₹{(price / attributes.square).toFixed(0)}/sqft</p>
                )}
              </div>
            </div>

            {/* Property Meta Info */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200">
              {attributes?.bedrooms && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{attributes.bedrooms}</p>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                  </div>
                </div>
              )}
              {attributes?.bathrooms && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{attributes.bathrooms}</p>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                  </div>
                </div>
              )}
              {attributes?.square && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{attributes.square.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">sqft</p>
                  </div>
                </div>
              )}
              {attributes?.floors && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{attributes.floors}</p>
                    <p className="text-sm text-gray-500">Floors</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        {images?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Gallery</h2>
            <div className="grid gap-4">
              {/* Main Image */}
              <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ height: '500px' }}>
                <img
                  src={images[selectedImage]?.url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>
              
              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                        selectedImage === i
                          ? 'ring-4 ring-blue-600 scale-105'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${title} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {(description || content) && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
                {description && <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>}
                {content && <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>}
              </div>
            )}

            {/* Additional Attributes */}
            {(attributes?.propertyLabel || attributes?.expectedROI || attributes?.garden || attributes?.balcony || attributes?.irrigationAvailable) && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {attributes.propertyLabel && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">🏷️</span>
                      <div>
                        <p className="text-sm text-gray-500">Label</p>
                        <p className="font-semibold text-gray-900">{attributes.propertyLabel}</p>
                      </div>
                    </div>
                  )}
                  {attributes.expectedROI && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="text-sm text-gray-500">Expected ROI</p>
                        <p className="font-semibold text-gray-900">{attributes.expectedROI}%</p>
                      </div>
                    </div>
                  )}
                  {attributes.garden && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-2xl">🌳</span>
                      <p className="font-semibold text-gray-900">Private Garden</p>
                    </div>
                  )}
                  {attributes.balcony && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-2xl">🌅</span>
                      <p className="font-semibold text-gray-900">Balcony</p>
                    </div>
                  )}
                  {attributes.irrigationAvailable && (
                    <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                      <span className="text-2xl">🚿</span>
                      <p className="font-semibold text-gray-900">Irrigation Available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features */}
            {features?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <span className="text-2xl">{featureIcons[f] || "✨"}</span>
                      <span className="font-medium text-gray-800">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby */}
            {nearby && Object.keys(nearby).length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Places</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(nearby).map(([key, value]) =>
                    value ? (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-2xl">{nearbyIcons[key] || "📌"}</span>
                        <div>
                          <p className="font-medium text-gray-900">{key}</p>
                          <p className="text-sm text-gray-500">{value} km away</p>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Distance Key */}
            {distanceKey?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Distance Highlights</h2>
                <ul className="space-y-2">
                  {distanceKey.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map Location */}
            {(mapUrl || coordinates || propertyLocation) && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                
                {embedUrl ? (
                  <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                    <iframe
                      width="100%"
                      height="400"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={embedUrl}
                      allowFullScreen
                      title="Property Location"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-xl p-12 text-center mb-4">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-gray-600 font-medium">Location map not available</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Property Address</p>
                    <p className="text-gray-700">
                      {propertyLocation || "Location information available"}
                      {city && `, ${city}`}
                    </p>
                    {coordinates && (
                      <p className="text-sm text-gray-500 mt-2">
                        📍 Coordinates: {coordinates.latitude}, {coordinates.longitude}
                      </p>
                    )}
                  </div>
                  
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              
              {/* Property Listing Date */}
              <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Listed on:</span>
                </p>
                <p className="text-gray-900 font-semibold pl-6">{formatDate(createdAt)}</p>
                {updatedAt && createdAt !== updatedAt && (
                  <>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-3 mb-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Updated:</span>
                    </p>
                    <p className="text-gray-700 font-semibold pl-6">{formatDate(updatedAt)}</p>
                  </>
                )}
              </div>
              
              {user ? (
                // Show contact details if user is logged in
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {createdBy?.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Property Owner</p>
                      <p className="font-bold text-lg text-gray-900">{createdBy?.name || "Property Owner"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {createdBy?.gmail && (
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 font-medium mb-1">EMAIL</p>
                        <a 
                          href={`mailto:${createdBy.gmail}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 group"
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span className="text-sm font-medium break-all group-hover:underline">{createdBy.gmail}</span>
                        </a>
                      </div>
                    )}
                    
                    {createdBy?.phoneNumber && (
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 font-medium mb-1">PHONE</p>
                        <a 
                          href={`tel:${createdBy.phoneNumber}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 group"
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-sm font-medium group-hover:underline">{createdBy.phoneNumber}</span>
                        </a>
                        <p className="text-xs text-gray-500 mt-2">📞 Tap to call</p>
                      </div>
                    )}
                  </div>
                  
                  <button className="w-full mt-4 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    Send Message
                  </button>
                </div>
              ) : (
                // Show login prompt if user is not logged in
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-300">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Login Required</h4>
                    <p className="text-sm text-gray-700 mb-1">Get instant access to:</p>
                    <ul className="text-sm text-gray-600 space-y-1 text-left mb-4">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Owner's contact details
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Direct call & email options
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Save to favorites
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => navigate('/login', { state: { from: `/property/${id}` } })}
                      className="w-full bg-yellow-500 text-white px-4 py-3 rounded-xl hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                      Login to View Contact
                    </button>
                    <button 
                      onClick={() => navigate('/register', { state: { from: `/property/${id}` } })}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                      Create New Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Share Property */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share This Property</h3>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-medium text-sm">Facebook</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="font-medium text-sm">WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border-2 border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Property ID</span>
                  <span className="text-gray-900 font-bold">#{id?.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Type</span>
                  <span className="text-gray-900 font-bold">{category}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Status</span>
                  <span className={`font-bold ${forSale ? 'text-green-600' : 'text-blue-600'}`}>
                    {forSale ? 'For Sale' : 'For Lease'}
                  </span>
                </div>
                {isVerified && (
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border border-green-200">
                    <span className="text-green-700 font-medium">Verification</span>
                    <span className="flex items-center gap-1 text-green-700 font-bold">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}