import { useEffect, useState } from "react";
import { getProperties } from "../api/axios"
import PropertyCard from "../components/PropertyCard";

export default function VerifiedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getProperties();
        // Filter only verified properties
        const verified = res.data.properties.filter((p) => p.isVerified);
        setProperties(verified);
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
        Loading verified properties...
      </div>
    );
  }

  if (properties.length === 0) {
    return null; // Don't show section if no verified properties
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Entire Verified Section with Green Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-green-400 p-8 shadow-xl">
        {/* Verified Section Header with Building Background */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-sm border border-green-200 p-6">
          {/* Building SVG Background */}
          <div className="absolute inset-0 opacity-5">
            <svg
              viewBox="0 0 800 200"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Building 1 */}
              <rect x="50" y="60" width="100" height="140" fill="currentColor" className="text-green-900" />
              <rect x="60" y="70" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="82" y="70" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="104" y="70" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="126" y="70" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="60" y="92" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="82" y="92" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="104" y="92" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="126" y="92" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="60" y="114" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="82" y="114" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="104" y="114" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="126" y="114" width="18" height="18" fill="white" opacity="0.3" />

              {/* Building 2 - Taller */}
              <rect x="180" y="40" width="120" height="160" fill="currentColor" className="text-green-900" />
              <rect x="192" y="50" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="216" y="50" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="240" y="50" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="264" y="50" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="192" y="74" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="216" y="74" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="240" y="74" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="264" y="74" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="192" y="98" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="216" y="98" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="240" y="98" width="20" height="20" fill="white" opacity="0.3" />
              <rect x="264" y="98" width="20" height="20" fill="white" opacity="0.3" />

              {/* Building 3 */}
              <rect x="330" y="80" width="90" height="120" fill="currentColor" className="text-green-900" />
              <rect x="340" y="90" width="16" height="16" fill="white" opacity="0.3" />
              <rect x="360" y="90" width="16" height="16" fill="white" opacity="0.3" />
              <rect x="380" y="90" width="16" height="16" fill="white" opacity="0.3" />
              <rect x="400" y="90" width="16" height="16" fill="white" opacity="0.3" />
              <rect x="340" y="110" width="16" height="16" fill="white" opacity="0.3" />
              <rect x="360" y="110" width="16" height="16" fill="white" opacity="0.3" />
              <rect x="380" y="110" width="16" height="16" fill="white" opacity="0.3" />
              <rect x="400" y="110" width="16" height="16" fill="white" opacity="0.3" />

              {/* Building 4 - Medium */}
              <rect x="450" y="70" width="100" height="130" fill="currentColor" className="text-green-900" />
              <rect x="460" y="80" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="482" y="80" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="504" y="80" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="526" y="80" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="460" y="102" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="482" y="102" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="504" y="102" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="526" y="102" width="18" height="18" fill="white" opacity="0.3" />

              {/* Building 5 */}
              <rect x="580" y="90" width="80" height="110" fill="currentColor" className="text-green-900" />
              <rect x="588" y="100" width="14" height="14" fill="white" opacity="0.3" />
              <rect x="606" y="100" width="14" height="14" fill="white" opacity="0.3" />
              <rect x="624" y="100" width="14" height="14" fill="white" opacity="0.3" />
              <rect x="642" y="100" width="14" height="14" fill="white" opacity="0.3" />
              <rect x="588" y="118" width="14" height="14" fill="white" opacity="0.3" />
              <rect x="606" y="118" width="14" height="14" fill="white" opacity="0.3" />
              <rect x="624" y="118" width="14" height="14" fill="white" opacity="0.3" />
              <rect x="642" y="118" width="14" height="14" fill="white" opacity="0.3" />

              {/* Building 6 - Tall */}
              <rect x="690" y="50" width="110" height="150" fill="currentColor" className="text-green-900" />
              <rect x="700" y="60" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="722" y="60" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="744" y="60" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="766" y="60" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="700" y="82" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="722" y="82" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="744" y="82" width="18" height="18" fill="white" opacity="0.3" />
              <rect x="766" y="82" width="18" height="18" fill="white" opacity="0.3" />
            </svg>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-5xl">✔️</span>
              <h2 className="text-4xl font-bold text-green-900">Verified Properties</h2>
              <span className="text-5xl">✔️</span>
            </div>
            <p className="text-green-800 text-lg">
              Trusted listings with authenticated details and documentation
            </p>
            <div className="mt-4 inline-block bg-white rounded-full px-5 py-2 shadow-md">
              <span className="text-green-900 font-semibold">
                {properties.length} Verified {properties.length === 1 ? "Property" : "Properties"} Available
              </span>
            </div>
          </div>
        </div>

        {/* Verified Properties Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} viewMode="grid" />
          ))}
        </div>
      </div>
    </div>
  );
}