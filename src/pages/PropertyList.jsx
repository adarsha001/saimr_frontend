import { useEffect, useState } from "react";
import { getProperties } from "../api";
import PropertyCard from "../components/PropertyCard";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    getProperties().then((res) => setProperties(res.data));
  }, []);

  // get unique cities for city filter dropdown
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

      return matchesSearch && matchesCategory && matchesCity;
    })
    .sort((a, b) => {
      if (sort === "price") return a.attributes.price - b.attributes.price;
      if (sort === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title, city or category..."
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Sort */}
        <select
          className="border rounded-lg px-4 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>

        {/* Category Filter */}
        <select
          className="border rounded-lg px-4 py-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {[
            "Flat",
            "Villa",
            "House",
            "Lease",
            "Outrade",
            "Commercial",
            "Plots",
            "Farmland",
            "JD/JV",
          ].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* City Filter */}
        <select
          className="border rounded-lg px-4 py-2"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* View Mode */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded-lg border ${
              viewMode === "grid" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={`px-3 py-2 rounded-lg border ${
              viewMode === "list" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Property List */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid" ? "sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {filtered.map((p) => (
          <PropertyCard key={p._id} property={p} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
