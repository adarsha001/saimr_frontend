import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  MessageCircle, 
  Share2, 
  Star,
  CheckCircle,
  Building,
  Sprout,
  Handshake,
  LandPlot,
  Maximize,
  Navigation,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

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
        setProperty(res.data.property);
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
      <div className="min-h-screen bg-gradient-to-br  from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg font-light tracking-wide">Loading property details...</p>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-6 sm:p-8 md:p-12 text-center max-w-md w-full border border-gray-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Building className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-600" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Property Not Found</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 font-light tracking-wide leading-relaxed text-sm sm:text-base">
            The property you're looking for doesn't exist or failed to load.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gray-900 text-white rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-serif font-medium tracking-wide text-sm sm:text-base w-full sm:w-auto"
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

  // Category-specific configurations
  const categoryConfig = {
    Outright: { color: "bg-gray-800 text-white", icon: <LandPlot className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Outright" },
    Commercial: { color: "bg-gray-700 text-white", icon: <Building className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Commercial" },
    Farmland: { color: "bg-gray-600 text-white", icon: <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Farmland" },
    "JD/JV": { color: "bg-gray-800 text-white", icon: <Handshake className="w-4 h-4 sm:w-5 sm:h-5" />, label: "JD/JV" }
  };

  const categoryInfo = categoryConfig[category] || { color: "bg-gray-500 text-white", icon: <Building className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Property" };

  // Feature icons
  const featureIcons = {
    "Conference Room": "💼",
    "CCTV Surveillance": "📹",
    "Power Backup": "🔋",
    "Fire Safety": "🚒",
    "Cafeteria": "🍽️",
    "Reception Area": "🏢",
    "Parking": "🅿️",
    "Lift(s)": "🛗",
    "Borewell": "💧",
    "Fencing": "🚧",
    "Electricity Connection": "⚡",
    "Water Source": "🚰",
    "Drip Irrigation": "💦",
    "Storage Shed": "🏚️",
    "Highway Access": "🛣️",
    "Legal Assistance": "⚖️",
    "Joint Development Approved": "✅",
    "Investor Friendly": "💰",
    "Gated Boundary": "🚪"
  };

  // Nearby place icons
  const nearbyIcons = {
    Highway: "🛣️",
    Airport: "✈️",
    BusStop: "🚌",
    Metro: "🚇",
    CityCenter: "🏙️",
    IndustrialArea: "🏭"
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



  // Render category-specific attributes
  const renderCategoryAttributes = () => {
    switch (category) {
      case "Commercial":
        return (
          <>
            {attributes?.square && (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl text-white">📐</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-gray-900">{attributes.square.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">arce </p>
                </div>
              </div>
            )}
            {attributes?.expectedROI && (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl text-white">📈</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-gray-900">{attributes.expectedROI}%</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">Expected ROI</p>
                </div>
              </div>
            )}
          </>
        );
      
      case "Farmland":
        return (
          <>
            {attributes?.square && (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl text-white">🌾</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-gray-900">{attributes.square.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">Acres</p>
                </div>
              </div>
            )}
            {attributes?.waterSource && (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl text-white">💧</span>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-serif font-bold text-gray-900">{attributes.waterSource}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">Water Source</p>
                </div>
              </div>
            )}
          </>
        );
      
      case "Outright":
      case "JD/JV":
        return (
          <>
            {attributes?.square && (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl text-white">📐</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-gray-900">{attributes.square.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">acre </p>
                </div>
              </div>
            )}
            {attributes?.roadWidth && (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl text-white">🛣️</span>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-serif font-bold text-gray-900">{attributes.roadWidth} ft</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">Road Width</p>
                </div>
              </div>
            )}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-gray-900 transition-colors group mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif font-medium tracking-wide text-sm sm:text-base">Back to listings</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                {isFeatured && (
                  <span className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-serif font-semibold tracking-wide shadow-lg">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    Featured
                  </span>
                )}
                {isVerified && (
                  <span className="flex items-center gap-1 sm:gap-2 bg-gray-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-serif font-semibold tracking-wide shadow-lg">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    Verified
                  </span>
                )}
                <span className={`${categoryInfo.color} px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-serif font-semibold tracking-wide shadow-lg flex items-center gap-1 sm:gap-2`}>
                  {categoryInfo.icon}
                  {categoryInfo.label}
                </span>
                <span className="bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-serif font-semibold tracking-wide shadow-lg">
                  {forSale ? "For Sale" : "For Lease"}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight leading-tight">
                {title}
              </h1>
              
              <div className="flex items-center gap-2 sm:gap-3 text-gray-600 mb-4 sm:mb-6">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <span className="text-base sm:text-lg font-serif font-medium tracking-wide">{propertyLocation}, {city}</span>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                {renderCategoryAttributes()}
                
                {attributes?.propertyLabel && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg sm:text-xl text-white">🏷️</span>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-serif font-bold text-gray-900">{attributes.propertyLabel}</p>
                      <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">Property Label</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-0 lg:text-right">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                rs{price}
              </div>
              {attributes?.square && typeof price === "number" && (
                <p className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">
                  {category === "Farmland" 
                    ? `₹${(price / attributes.square).toFixed(0)}/acre`
                    : `₹${(price / attributes.square).toFixed(0)}/acre`
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl  mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Images Gallery */}
            {images?.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-200">
          {/* Main Image Container - Much Larger */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden" style={{ height: '500px', maxHeight: '600px' }}>
            <img
              src={images[selectedImage]?.url}
              alt={title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-xl border border-gray-200 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-xl border border-gray-200 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-serif font-medium tracking-wide">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
          
          {/* Thumbnail Grid */}
          {images.length > 1 && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-lg sm:rounded-xl overflow-hidden transition-all border-2 ${
                      selectedImage === i
                        ? 'border-gray-900 scale-110 shadow-lg'
                        : 'border-gray-200 hover:border-gray-400 hover:scale-105 opacity-80 hover:opacity-100'
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
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {(description || content) && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">Property Overview</h2>
                {description && <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed font-light tracking-wide text-base sm:text-lg">{description}</p>}
                {content && <p className="text-gray-700 leading-relaxed whitespace-pre-line font-light tracking-wide text-base sm:text-lg">{content}</p>}
              </div>
            )}

            {/* Features */}
            {features?.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">Features & Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
                    >
                      <span className="text-xl sm:text-2xl">{featureIcons[f] || "✨"}</span>
                      <span className="font-serif font-medium text-gray-800 tracking-wide text-sm sm:text-base">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Map */}
             {/* Location & Map */}
            {(mapUrl || coordinates || propertyLocation) && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Location</h2>
                
                {embedUrl ? (
                  <div className="rounded-xl overflow-hidden shadow-lg mb-6 border border-gray-200">
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
                  <div className="bg-gray-100 rounded-xl p-12 text-center mb-6 border border-gray-200">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-serif font-medium tracking-wide">Location map not available</p>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <div className="flex-1">
                    <p className="font-serif font-semibold text-gray-900 mb-1 sm:mb-2 tracking-wide text-sm sm:text-base">Property Address</p>
                    <p className="text-gray-700 font-light tracking-wide text-sm sm:text-base md:text-lg">
                      {propertyLocation}, {city}
                    </p>
                    {coordinates && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 font-light tracking-wide">
                        📍 Coordinates: {coordinates.latitude}, {coordinates.longitude}
                      </p>
                    )}
                  </div>
                  
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gray-900 text-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-serif font-medium tracking-wide text-sm sm:text-base w-full lg:w-auto"
                  >
                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                    Open in Maps
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-200 lg:top-6">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">Contact Information</h3>
              
              {/* Property Listing Date */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="font-serif font-medium text-gray-900 tracking-wide text-sm sm:text-base">Listed on</span>
                </div>
                <p className="text-gray-700 font-light tracking-wide text-sm sm:text-base pl-6 sm:pl-8">{formatDate(createdAt)}</p>
                {updatedAt && createdAt !== updatedAt && (
                  <>
                    <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 mb-2 sm:mb-3">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      <span className="font-serif font-medium text-gray-900 tracking-wide text-sm sm:text-base">Last updated</span>
                    </div>
                    <p className="text-gray-700 font-light tracking-wide text-sm sm:text-base pl-6 sm:pl-8">{formatDate(updatedAt)}</p>
                  </>
                )}
              </div>
              
              {user ? (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-gray-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-900 rounded-full flex items-center justify-center text-white font-serif font-bold text-xl sm:text-2xl">
                      {createdBy?.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-serif font-medium uppercase tracking-widest mb-1">Property Owner</p>
                      <p className="font-serif font-bold text-lg sm:text-xl text-gray-900 tracking-tight">{createdBy?.name || "Property Owner"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {createdBy?.gmail && (
                      <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 font-serif font-medium uppercase tracking-widest mb-1 sm:mb-2">EMAIL</p>
                        <a 
                          href={`mailto:${createdBy.gmail}`}
                          className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-gray-900 group transition-colors"
                        >
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span className="font-serif font-medium tracking-wide text-sm sm:text-base group-hover:underline break-all">{createdBy.gmail}</span>
                        </a>
                      </div>
                    )}
                    
                    {createdBy?.phoneNumber && (
                      <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 font-serif font-medium uppercase tracking-widest mb-1 sm:mb-2">PHONE</p>
                        <a 
                          href={`tel:${createdBy.phoneNumber}`}
                          className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-gray-900 group transition-colors"
                        >
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span className="font-serif font-medium tracking-wide text-sm sm:text-base group-hover:underline">{createdBy.phoneNumber}</span>
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <button className="w-full mt-4 sm:mt-6 bg-gray-900 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-serif font-semibold tracking-wide text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Send Message
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border-2 border-gray-300 text-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-serif font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Login Required</h4>
                  <p className="text-gray-600 mb-4 sm:mb-6 font-light tracking-wide leading-relaxed text-sm sm:text-base">
                    Sign in to access owner contact details and exclusive features
                  </p>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <button 
                      onClick={() => navigate('/login', { state: { from: `/property/${id}` } })}
                      className="w-full bg-gray-900 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-serif font-semibold tracking-wide text-sm sm:text-base"
                    >
                      Sign In to View Contact
                    </button>
                    <button 
                      onClick={() => navigate('/register', { state: { from: `/property/${id}` } })}
                      className="w-full bg-white text-gray-900 px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-300 font-serif font-semibold tracking-wide text-sm sm:text-base"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">Property Details</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  <span className="font-serif font-medium text-gray-700 tracking-wide text-sm sm:text-base">Property ID</span>
                  <span className="font-serif font-bold text-gray-900 text-sm sm:text-base">#{id?.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  <span className="font-serif font-medium text-gray-700 tracking-wide text-sm sm:text-base">Type</span>
                  <span className="font-serif font-bold text-gray-900 text-sm sm:text-base">{category}</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  <span className="font-serif font-medium text-gray-700 tracking-wide text-sm sm:text-base">Status</span>
                  <span className={`font-serif font-bold text-sm sm:text-base ${forSale ? 'text-green-600' : 'text-blue-600'}`}>
                    {forSale ? 'For Sale' : 'For Lease'}
                  </span>
                </div>
                {isVerified && (
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200">
                    <span className="font-serif font-medium text-green-700 tracking-wide text-sm sm:text-base">Verification</span>
                    <span className="flex items-center gap-1 sm:gap-2 font-serif font-bold text-green-700 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
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