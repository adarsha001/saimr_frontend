import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { fetchAllUsers } from '../api/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate(); // Add navigate hook

  const getUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const { data } = await fetchAllUsers(page, 10, search);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    getUsers(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getUsers(newPage, searchTerm);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Add this function to handle property click
  const handlePropertyClick = (propertyId, e) => {
    e.stopPropagation(); // Prevent modal from opening
    navigate(`/property/${propertyId}`);
  };

  const formatPrice = (price) => {
    if (!price || price === "Price on Request") return "Price on Request";
    if (typeof price === 'number') return `₹${price.toLocaleString()}`;
    return price;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage users and view their liked properties
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name, username, email, or type..."
              className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2 sm:gap-4">
              <button
                type="submit"
                className="flex-1 sm:flex-none bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  getUsers(1, '');
                }}
                className="flex-1 sm:flex-none bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {user.name} {user.lastName}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                <div className="flex items-center truncate">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{user.gmail}</span>
                </div>
                <div className="flex items-center truncate">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="truncate">{user.phoneNumber}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  user.userType === 'admin' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.userType}
                </span>
                {user.isAdmin && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                  <div className="text-lg sm:text-xl font-bold text-blue-600">{user.likedPropertiesCount}</div>
                  <div className="text-xs text-blue-800">Favorites</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                  <div className="text-lg sm:text-xl font-bold text-green-600">{user.postedPropertiesCount}</div>
                  <div className="text-xs text-green-800">Listed</div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base"
            >
              Previous
            </button>
            <span className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-center text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base"
            >
              Next
            </button>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedUser.name} {selectedUser.lastName}
                  </h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Profile Information</h3>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Username</label>
                        <p className="text-gray-900">@{selectedUser.username}</p>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900 break-words">{selectedUser.gmail}</p>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{selectedUser.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">User Type</label>
                        <p className="text-gray-900 capitalize">{selectedUser.userType}</p>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Admin</label>
                        <p className="text-gray-900">{selectedUser.isAdmin ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Activity Summary</h3>
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                      <div className="flex justify-between items-center">
                        <span>Favorite Properties</span>
                        <span className="font-bold text-blue-600">{selectedUser.likedPropertiesCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Listed Properties</span>
                        <span className="font-bold text-green-600">{selectedUser.postedPropertiesCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Member Since</span>
                        <span className="font-medium text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liked Properties */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    Liked Properties ({selectedUser.likedProperties.length})
                  </h3>
                  {selectedUser.likedProperties.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No liked properties</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {selectedUser.likedProperties.map((property) => (
                        <div 
                          key={property._id} 
                          className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={(e) => handlePropertyClick(property._id, e)}
                        >
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <img
                              src={property.image || "https://via.placeholder.com/80x60?text=No+Image"}
                              alt={property.title}
                              className="w-16 h-12 sm:w-20 sm:h-16 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1 hover:text-blue-600">
                                {property.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {property.city} • {property.category}
                              </p>
                              <p className="text-blue-700 font-bold text-sm sm:text-base mt-1">
                                {formatPrice(property.price)}
                              </p>
                              <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  property.approvalStatus === 'approved' 
                                    ? 'bg-green-100 text-green-800'
                                    : property.approvalStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {property.approvalStatus}
                                </span>
                                {property.isVerified && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Liked {new Date(property.likedAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-blue-600 mt-1 font-medium">
                                Click to view property details →
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;