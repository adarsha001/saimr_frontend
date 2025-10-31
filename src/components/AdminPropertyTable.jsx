import React, { useState } from "react";
import {
  approveProperty, // Changed from verifyProperty
  rejectProperty,
  toggleFeatured,
} from "../api/adminApi";

const AdminPropertyTable = ({ properties, onUpdate }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleApprove = async (id) => { // Changed from handleVerify
    setLoadingId(id);
    try {
      await approveProperty(id); // Changed from verifyProperty
      onUpdate();
    } catch (error) {
      console.error("Error approving property:", error);
      alert("Error approving property");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return alert("Please enter a reason");
    
    try {
      await rejectProperty(selectedProperty, rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
      onUpdate();
    } catch (error) {
      console.error("Error rejecting property:", error);
      alert("Error rejecting property");
    }
  };

  const handleFeature = async (id) => {
    setLoadingId(id);
    try {
      await toggleFeatured(id);
      onUpdate();
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Error toggling featured status");
    } finally {
      setLoadingId(null);
    }
  };

  // Helper function to get status badge color
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Property Management</h2>

      {properties.length === 0 ? (
        <p className="text-gray-500 text-center">No properties found.</p>
      ) : (
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Posted By</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr
                key={p._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 font-medium">{p.title}</td>
                <td className="px-4 py-2">{p.city}</td>
                <td className="px-4 py-2">
                  {p.createdBy?.name} <br />
                  <span className="text-xs text-gray-400">{p.createdBy?.gmail}</span>
                </td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(p.approvalStatus)}`}>
                    {p.approvalStatus}
                  </span>
                </td>
                <td className="px-4 py-2 text-center flex gap-2 justify-center">
                  {p.approvalStatus === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(p._id)}
                        disabled={loadingId === p._id}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-green-400"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProperty(p._id);
                          setShowRejectModal(true);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleFeature(p._id)}
                    disabled={loadingId === p._id || p.approvalStatus !== "approved"}
                    className={`px-3 py-1 rounded transition ${
                      p.isFeatured
                        ? "bg-yellow-400 hover:bg-yellow-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    } ${p.approvalStatus !== "approved" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    ⭐ {p.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Reject Property</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border rounded p-2 mb-4"
              rows="4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyTable;