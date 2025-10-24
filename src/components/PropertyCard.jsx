import { Link } from "react-router-dom";

export default function PropertyCard({ property, viewMode }) {
  const { _id, title, city, category, attributes, images, price } = property;

  return (
    <div
      className={`bg-white rounded-xl shadow hover:shadow-lg transition p-4 border
        ${viewMode === "grid" ? "w-full" : "flex items-center gap-4"}`}
    >
      <img
        src={images?.[0]?.url || "https://via.placeholder.com/300"}
        alt={title}
        className={`rounded-lg object-cover ${
          viewMode === "grid" ? "h-48 w-full" : "h-32 w-48"
        }`}
      />

      <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
        <h2 className="text-xl font-semibold mt-2">{title}</h2>
        <p className="text-gray-500">{city} • {category}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">
          ₹{attributes?.price?.toLocaleString() || price}
        </p>
        <Link
          to={`/property/${_id}`}
          className="inline-block mt-3 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
