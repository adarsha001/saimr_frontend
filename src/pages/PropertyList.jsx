import { useEffect, useState } from "react";
import { getProperties } from "../api/axios";
import { Search, SlidersHorizontal, Grid3x3, List, MapPin, Home, DollarSign, Maximize, Bed, Bath } from "lucide-react";

import PropertyCard from "../components/PropertyCard";
import FeaturedProperties from "./FeaturedProperties";
import VerifiedProperties from "./VerifiedProperties";
export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("");
  const [areaRange, setAreaRange] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getProperties().then((res) => setProperties(res.data));
  }, []);

  const cities = [...new Set(properties.map((p) => p.city))];

  const filtered = properties
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter
        ? p.category === categoryFilter
        : true;

      const matchesCity = cityFilter ? p.city === cityFilter : true;

      const matchesPriceRange = priceRange
        ? (() => {
            const price = p.attributes?.price || 0;
            if (priceRange === "0-50") return price <= 5000000;
            if (priceRange === "50-100") return price > 5000000 && price <= 10000000;
            if (priceRange === "100-200") return price > 10000000 && price <= 20000000;
            if (priceRange === "200+") return price > 20000000;
            return true;
          })()
        : true;

      const matchesBedrooms = bedroomFilter
        ? (() => {
            const beds = p.attributes?.bedrooms || 0;
            if (bedroomFilter === "1") return beds === 1;
            if (bedroomFilter === "2") return beds === 2;
            if (bedroomFilter === "3") return beds === 3;
            if (bedroomFilter === "4+") return beds >= 4;
            return true;
          })()
        : true;

      const matchesArea = areaRange
        ? (() => {
            const area = p.attributes?.area || 0;
            if (areaRange === "0-1000") return area <= 1000;
            if (areaRange === "1000-2000") return area > 1000 && area <= 2000;
            if (areaRange === "2000-5000") return area > 2000 && area <= 5000;
            if (areaRange === "5000+") return area > 5000;
            return true;
          })()
        : true;

      return matchesSearch && matchesCategory && matchesCity && matchesPriceRange && matchesBedrooms && matchesArea;
    })
    .sort((a, b) => {
      if (sort === "price-low")
        return (a.attributes?.price || 0) - (b.attributes?.price || 0);
      if (sort === "price-high")
        return (b.attributes?.price || 0) - (a.attributes?.price || 0);
      if (sort === "name") return a.title.localeCompare(b.title);
      if (sort === "area-low")
        return (a.attributes?.area || 0) - (b.attributes?.area || 0);
      if (sort === "area-high")
        return (b.attributes?.area || 0) - (a.attributes?.area || 0);
      return 0;
    });

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setCategoryFilter("");
    setCityFilter("");
    setPriceRange("");
    setBedroomFilter("");
    setAreaRange("");
  };

  const activeFiltersCount = [categoryFilter, cityFilter, priceRange, bedroomFilter, areaRange].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Dream Property</h1>
          <p className="text-gray-600">Browse through {properties.length} properties available</p>
        </div>

        {/* Search Bar - Highlighted */}
        <div className="mb-6 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, city, or category..."
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-300 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Toggle and Sort */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <button
            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex gap-3 items-center">
            <select
              className="border-2 border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm font-medium"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="area-low">Area (Small to Large)</option>
              <option value="area-high">Area (Large to Small)</option>
            </select>

            <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border-2 border-gray-300">
              <button
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  viewMode === "grid" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  viewMode === "list" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Refine Your Search</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4 inline mr-1" />
                  Property Type
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  {["Flat", "Villa", "House", "Lease", "Outrade", "Commercial", "Plots", "Farmland", "JD/JV"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  City
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Range (Lakhs)
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">Any Price</option>
                  <option value="0-50">Under ₹50L</option>
                  <option value="50-100">₹50L - ₹1Cr</option>
                  <option value="100-200">₹1Cr - ₹2Cr</option>
                  <option value="200+">Above ₹2Cr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bed className="w-4 h-4 inline mr-1" />
                  Bedrooms
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  value={bedroomFilter}
                  onChange={(e) => setBedroomFilter(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Maximize className="w-4 h-4 inline mr-1" />
                  Area (sqft)
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  value={areaRange}
                  onChange={(e) => setAreaRange(e.target.value)}
                >
                  <option value="">Any Size</option>
                  <option value="0-1000">Under 1,000 sqft</option>
                  <option value="1000-2000">1,000 - 2,000 sqft</option>
                  <option value="2000-5000">2,000 - 5,000 sqft</option>
                  <option value="5000+">Above 5,000 sqft</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700 font-medium">
            Showing {filtered.length} {filtered.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Property Cards */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {filtered.map((p) => (
            <PropertyCard key={p._id} property={p} viewMode={viewMode} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}