import React, { useEffect, useState } from "react";
import { fetchPendingProperties } from "../api/adminApi";
import AdminPropertyTable from "../components/AdminPropertyTable";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProperties = async () => {
    setLoading(true);
    try {
      const { data } = await fetchPendingProperties();
      setProperties(data.properties);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProperties();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Property Review</h1>
        <AdminPropertyTable properties={properties} onUpdate={getProperties} />
      </div>
    </div>
  );
};

export default AdminDashboard;
