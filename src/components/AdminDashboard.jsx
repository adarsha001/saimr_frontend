import React, { useEffect, useState } from "react";
import { fetchPendingProperties } from "../api/adminApi";
import AdminPropertyTable from "../components/AdminPropertyTable";
import AdminUsers from "./AdminUsers";
import AdminProperties from "./AdminProperties";
import PropertyEdit from "./PropertyEdit";
import AdminClickAnalytics from "./AdminClickAnalytics";
import ClickAnalyticsDetails from "./ClickAnalyticsDetails";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("properties");
  const [editingProperty, setEditingProperty] = useState(null);
  const [analyticsView, setAnalyticsView] = useState("overview"); // "overview" or "details"

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
    if (activeSection === "dashboard") {
      getProperties();
    }
  }, [activeSection]);

  const handleEditProperty = (propertyId) => {
    setEditingProperty(propertyId);
  };

  const handlePropertyUpdated = () => {
    setEditingProperty(null);
    if (activeSection === "dashboard") {
      getProperties();
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "properties":
        return <AdminProperties onEditProperty={handleEditProperty} />;
      case "users":
        return <AdminUsers />;
      case "analytics":
        return (
          <div className="p-6">
            {/* Analytics View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {analyticsView === "overview" ? "Click Analytics Overview" : "Detailed Click Analytics"}
                </h2>
                <p className="text-gray-600">
                  {analyticsView === "overview" 
                    ? "High-level overview of user interactions" 
                    : "Complete tracking and analysis of all user interactions"
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAnalyticsView("overview")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    analyticsView === "overview"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setAnalyticsView("details")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    analyticsView === "details"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Detailed View</span>
                </button>
              </div>
            </div>
            
            {/* Render the appropriate analytics component */}
            {analyticsView === "overview" ? <AdminClickAnalytics /> : <ClickAnalyticsDetails />}
          </div>
        );
      case "edit":
        return <PropertyEdit />;
      default:
        return null;
    }
  };

  if (loading && activeSection === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your real estate platform</p>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveSection("properties");
                setAnalyticsView("overview");
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                activeSection === "properties"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Properties</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("users");
                setAnalyticsView("overview");
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                activeSection === "users"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Users</span>
            </button>

            {/* Analytics Button */}
            <button
              onClick={() => setActiveSection("analytics")}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                activeSection === "analytics"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Click Analytics</span>
            </button>

            {/* Optional: Quick Stats Overview */}
            <div className="ml-auto flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Properties</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Indicator */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Admin</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-gray-900 capitalize">
              {activeSection === "analytics" 
                ? `Analytics ${analyticsView === "details" ? "- Detailed View" : "- Overview"}` 
                : activeSection
              }
            </span>
          </div>
        </div>

        {/* Active Section Content */}
        <div className="bg-white rounded-lg shadow-md min-h-[600px]">
          {renderActiveSection()}
        </div>

        {/* Property Edit Modal */}
        {editingProperty && (
          <PropertyEdit
            propertyId={editingProperty}
            onClose={() => setEditingProperty(null)}
            onUpdate={handlePropertyUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;