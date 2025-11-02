import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios.js';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [userEnquiries, setUserEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites', 'posted', 'enquiries'
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'enquiries') {
      fetchUserEnquiries();
    }
  }, [activeTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await API.get('/users/profile');
      console.log("Full user profile response:", response.data);
      setUserData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnquiries = async () => {
    setEnquiriesLoading(true);
    try {
      const response = await API.get('/users/my-enquiries');
      setUserEnquiries(response.data.enquiries || []);
    } catch (error) {
      console.error('Error fetching user enquiries:', error);
      setUserEnquiries([]);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleUnlike = async (propertyId, e) => {
    e.stopPropagation();
    try {
      await API.delete(`/users/like/${propertyId}`);
      // Update local state to remove the property
      setUserData(prev => ({
        ...prev,
        likedProperties: prev.likedProperties.filter(p => p.property?._id !== propertyId)
      }));
    } catch (error) {
      console.error('Error unliking property:', error);
    }
  };

  const handleDeleteProperty = async (propertyId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      await API.delete(`/properties/${propertyId}`);
      // Update local state to remove the property
      setUserData(prev => ({
        ...prev,
        postedProperties: prev.postedProperties.filter(p => p.property?._id !== propertyId)
      }));
      alert('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">Loading profile...</div>
      </div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center text-red-600">Error loading profile</div>
      </div>
    </div>
  );

  // Filter out any null or invalid properties and transform the data structure
  const validLikedProperties = (userData.likedProperties || [])
    .filter(item => item?.property && item.property._id)
    .map(item => ({
      property: item.property,
      likedAt: item.likedAt
    }));

  const validPostedProperties = (userData.postedProperties || [])
    .filter(item => item?.property && item.property._id)
    .map(item => ({
      property: item.property,
      postedAt: item.postedAt,
      status: item.status
    }));

  // Filter approved properties
  const approvedProperties = validPostedProperties.filter(item => item.status === 'approved');
  const pendingProperties = validPostedProperties.filter(item => item.status === 'pending');
  const rejectedProperties = validPostedProperties.filter(item => item.status === 'rejected');

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      approved: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      'in-progress': 'bg-blue-100 text-blue-800 border border-blue-200',
      resolved: 'bg-green-100 text-green-800 border border-green-200',
      closed: 'bg-gray-100 text-gray-800 border border-gray-200',
      new: 'bg-purple-100 text-purple-800 border border-purple-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const PropertyCard = ({ property, likedAt, postedAt, status, showDelete = false, onDelete, onUnlike }) => {
    return (
      <div
        onClick={() => handlePropertyClick(property._id)}
        className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white cursor-pointer relative group"
      >
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {showDelete && (
            <button
              onClick={(e) => onDelete(property._id, e)}
              className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              title="Delete property"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          {!showDelete && onUnlike && (
            <button
              onClick={(e) => onUnlike(property._id, e)}
              className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              title="Remove from favorites"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Status Badge for Posted Properties */}
        {showDelete && status && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(status)}`}>
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
          </div>
        )}

        {/* Property Image */}
        <div className="relative">
          <img
            src={property.images?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={property.title || "Property"}
            className="w-full h-48 object-cover rounded-t-xl"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl"></div>
          
          {/* Date Badge */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {likedAt ? `Liked ${new Date(likedAt).toLocaleDateString()}` : 
             postedAt ? `Posted ${new Date(postedAt).toLocaleDateString()}` : ''}
          </div>
        </div>

        {/* Property Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
              {property.title || "Untitled Property"}
            </h3>
            {property.isVerified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                Verified
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-2">
            {property.city || "Unknown City"} • {property.category || "Unknown Category"}
          </p>

          <p className="text-blue-700 font-bold text-lg mb-3">
            {property.price && property.price !== "Price on Request" 
              ? `₹${typeof property.price === 'number' ? property.price.toLocaleString() : property.price}`
              : 'Price on Request'
            }
          </p>

          {property.attributes && (
            <div className="flex items-center gap-4 text-gray-700 text-sm mb-3">
              {property.attributes.bedrooms && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {property.attributes.bedrooms}
                </span>
              )}
              {property.attributes.bathrooms && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {property.attributes.bathrooms}
                </span>
              )}
              {property.attributes.square && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                  {property.attributes.square} sqft
                </span>
              )}
            </div>
          )}

          <p className="text-gray-500 text-sm line-clamp-2">
            {property.propertyLocation || "Location not specified"}
          </p>

          {/* Additional info for posted properties */}
          {showDelete && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Created: {new Date(property.createdAt).toLocaleDateString()}</span>
                {property.isFeatured && (
                  <span className="flex items-center gap-1 text-purple-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Featured
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const EnquiryCard = ({ enquiry }) => {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Enquiry #{enquiry._id.slice(-6)}</h3>
            <p className="text-gray-600 text-sm">
              Submitted on {new Date(enquiry.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(enquiry.status)}`}>
            {enquiry.status?.charAt(0).toUpperCase() + enquiry.status?.slice(1)}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Message:</label>
            <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
              {enquiry.message}
            </p>
          </div>

          {enquiry.adminNotes && (
            <div>
              <label className="text-sm font-medium text-gray-700">Admin Response:</label>
              <p className="text-gray-900 mt-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                {enquiry.adminNotes}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Last updated: {new Date(enquiry.updatedAt).toLocaleDateString()}
            </span>
            {enquiry.status === 'new' && (
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Awaiting response
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {userData.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.name} {userData.lastName}
              </h1>
              <p className="text-gray-600 mt-1">@{userData.username}</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {userData.userType}
                </span>
                {userData.isAdmin && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {userData.gmail}
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {userData.phoneNumber}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {validLikedProperties.length}
                  </div>
                  <div className="text-sm text-blue-800">Favorites</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {validPostedProperties.length}
                  </div>
                  <div className="text-sm text-green-800">Listed</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {approvedProperties.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                    {pendingProperties.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rejected:</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    {rejectedProperties.length}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enquiries</h3>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userEnquiries.length}
                </div>
                <div className="text-sm text-purple-800">Total Enquiries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Favorite Properties ({validLikedProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('posted')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'posted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Listed Properties ({validPostedProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'enquiries'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Enquiries ({userEnquiries.length})
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'favorites' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Favorite Properties</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {validLikedProperties.length} properties
                </span>
              </div>

              {validLikedProperties.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No favorites yet</h3>
                  <p className="mt-2 text-gray-500">Start exploring properties and add them to your favorites!</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Properties
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {validLikedProperties.map((item, index) => (
                    <PropertyCard
                      key={item.property._id || index}
                      property={item.property}
                      likedAt={item.likedAt}
                      onUnlike={handleUnlike}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'posted' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Listed Properties</h2>
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      Approved: {approvedProperties.length}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                      Pending: {pendingProperties.length}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      Rejected: {rejectedProperties.length}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/add-property')}
                    className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    + Add Property
                  </button>
                </div>
              </div>

              {validPostedProperties.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No properties listed yet</h3>
                  <p className="mt-2 text-gray-500">Start by listing your first property!</p>
                  <button
                    onClick={() => navigate('/add-property')}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    List a Property
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {validPostedProperties.map((item, index) => (
                    <PropertyCard
                      key={item.property._id || index}
                      property={item.property}
                      postedAt={item.postedAt}
                      status={item.status}
                      showDelete={true}
                      onDelete={handleDeleteProperty}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'enquiries' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Enquiries</h2>
                <div className="flex gap-2">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {userEnquiries.length} enquiries
                  </span>
                </div>
              </div>

              {enquiriesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your enquiries...</p>
                </div>
              ) : userEnquiries.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No enquiries yet</h3>
                  <p className="mt-2 text-gray-500">You haven't submitted any enquiries yet.</p>
                  <p className="text-sm text-gray-500 mb-4">Use the enquiry form on any page to contact us!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userEnquiries.map((enquiry) => (
                    <EnquiryCard key={enquiry._id} enquiry={enquiry} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}