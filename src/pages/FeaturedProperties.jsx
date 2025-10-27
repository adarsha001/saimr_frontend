import { useEffect, useState } from "react";
import { getProperties } from "../api/axios"
import PropertyCard from "../components/PropertyCard";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getProperties();
        // Filter only featured properties
        console.log(res)
        const featured = res.data.properties.filter((p) => p.isFeatured);
        setProperties(featured);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600">
        Loading featured properties...
      </div>
    );
  }

  if (properties.length === 0) {
    return null; // Don't show section if no featured properties
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Entire Featured Section with Unique Pattern Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-yellow-400 p-8 shadow-xl">
        
        {/* Unique Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geometric-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="currentColor" className="text-yellow-900"/>
                <rect x="25" y="25" width="10" height="10" fill="currentColor" className="text-yellow-900" opacity="0.5"/>
                <polygon points="50,10 60,30 40,30" fill="currentColor" className="text-yellow-900" opacity="0.3"/>
                <circle cx="75" cy="25" r="4" fill="currentColor" className="text-yellow-900" opacity="0.7"/>
                <rect x="65" y="65" width="8" height="8" fill="currentColor" className="text-yellow-900" opacity="0.6"/>
                <polygon points="25,75 35,85 15,85" fill="currentColor" className="text-yellow-900" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
          </svg>
        </div>

        {/* Featured Section Header */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-sm border border-yellow-200 p-6">
          
          {/* Subtle Building Pattern for Header Only */}
          <div className="absolute inset-0 opacity-5">
            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              {/* Simplified building shapes */}
              <rect x="50" y="80" width="80" height="120" fill="currentColor" className="text-yellow-900"/>
              <rect x="180" y="60" width="100" height="140" fill="currentColor" className="text-yellow-900"/>
              <rect x="330" y="70" width="70" height="130" fill="currentColor" className="text-yellow-900"/>
              <rect x="450" y="90" width="90" height="110" fill="currentColor" className="text-yellow-900"/>
              <rect x="580" y="50" width="120" height="150" fill="currentColor" className="text-yellow-900"/>
            </svg>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-5xl">⭐</span>
              <h2 className="text-4xl font-bold text-yellow-900">Featured Properties</h2>
              <span className="text-5xl">⭐</span>
            </div>
            <p className="text-yellow-800 text-lg">
              Discover our handpicked premium listings with verified details
            </p>
            <div className="mt-4 inline-block bg-white rounded-full px-5 py-2 shadow-md">
              <span className="text-yellow-900 font-semibold">
                {properties.length} Premium {properties.length === 1 ? "Property" : "Properties"} Available
              </span>
            </div>
          </div>
        </div>

        {/* Featured Properties Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} viewMode="grid" />
          ))}
        </div>
      </div>
    </div>
  );
}