import { useEffect, useState } from "react";
import { Building2, Home, Star, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { getProperties } from "../api/axios"
import PropertyCard from "../components/PropertyCard";

// Main Component
export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getProperties();
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 tracking-wide uppercase text-sm font-semibold">
            Loading Premium Properties
          </p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className=" bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 mb-6">
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              Exclusive Collection
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tight">
            Featured Properties
          </h1>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-px bg-black" />
            <Star className="w-5 h-5 fill-black" />
            <div className="w-24 h-px bg-black" />
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium properties, each offering 
            unparalleled luxury and sophistication in the world's most desirable locations.
          </p>

          {/* Property Count */}
          <div className="mt-8 inline-flex items-center gap-3 border-2 border-black px-8 py-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {properties.length} Premium {properties.length === 1 ? "Property" : "Properties"} Available
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center border-t-2 border-black pt-12">
 
        </div>
      </div>
    </div>
  );
}

