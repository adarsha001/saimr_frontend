import React, { useState, useEffect } from 'react';
import { 
  fetchAllEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry,
  fetchEnquiryStats,
  exportEnquiries 
} from '../api/adminApi'; // Adjust import path
import { useAuth } from '../context/AuthContext';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchEnquiries();
    fetchStats();
  }, [filters]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetchAllEnquiries(
        filters.page, 
        filters.limit, 
        filters.status, 
        filters.search
      );
      if (response.data.success) {
        setEnquiries(response.data.enquiries);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setError('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetchEnquiryStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching enquiry stats:', error);
    }
  };

  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      const response = await updateEnquiryStatus(enquiryId, newStatus);
      if (response.data.success) {
        setEnquiries(prev => 
          prev.map(enquiry => 
            enquiry._id === enquiryId 
              ? { ...enquiry, status: newStatus }
              : enquiry
          )
        );
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      setError('Failed to update enquiry status');
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }

    try {
      const response = await deleteEnquiry(enquiryId);
      if (response.data.success) {
        setEnquiries(prev => prev.filter(enquiry => enquiry._id !== enquiryId));
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      setError('Failed to delete enquiry');
    }
  };

  const handleExport = async (format) => {
    try {
      await exportEnquiries(format, '30d', filters.status);
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export enquiries');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading enquiries...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Enquiry Management</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Export JSON
              </button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total || 0}</div>
              <div className="text-blue-800">Total Enquiries</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.new || 0}</div>
              <div className="text-yellow-800">New</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.resolved || 0}</div>
              <div className="text-green-800">Resolved</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.closed || 0}</div>
              <div className="text-gray-800">Closed</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="flex space-x-4 mb-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <input
              type="text"
              placeholder="Search enquiries..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 flex-1"
            />
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No enquiries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enquiry.name}
                        </div>
                        {enquiry.user && (
                          <div className="text-sm text-gray-500">
                            User ID: {enquiry.user._id}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enquiry.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {enquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enquiry.status)}`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleStatusUpdate(enquiry._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry._id)}
                          className="text-red-600 hover:text-red-900 ml-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;