import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../api";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    getPropertyById(id).then((res) => setProperty(res.data));
  }, [id]);

  if (!property) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <p className="text-gray-600 mb-2">
        {property.city} • {property.category}
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {property.images?.map((img, i) => (
          <img
            key={i}
            src={img.url}
            alt=""
            className="rounded-lg shadow-md object-cover w-full h-64"
          />
        ))}
      </div>

      <p className="text-gray-700 mb-4">{property.description}</p>
      <p className="text-gray-800 font-semibold mb-4">
        ₹{property.attributes?.price?.toLocaleString()}
      </p>

      <h3 className="text-xl font-semibold mb-2">Features:</h3>
      <ul className="grid grid-cols-2 gap-2 mb-4">
        {property.features?.map((f, i) => (
          <li key={i} className="text-gray-600">
            ✅ {f}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Distance Key:</h3>
      <ul className="list-disc list-inside text-gray-600">
        {property.distanceKey?.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  );
}
