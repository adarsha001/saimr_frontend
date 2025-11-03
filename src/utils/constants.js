// Property Categories
export const PROPERTY_CATEGORIES = {
  OUTRIGHT: 'Outright',
  COMMERCIAL: 'Commercial',
  FARMLAND: 'Farmland',
  JD_JV: 'JD/JV'
};

// Approval Status
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Approval Status Labels and Colors for UI
export const APPROVAL_STATUS_LABELS = {
  pending: { 
    label: 'Pending Review', 
    color: 'bg-yellow-100 text-yellow-800',
    badgeColor: 'bg-yellow-500'
  },
  approved: { 
    label: 'Approved', 
    color: 'bg-green-100 text-green-800',
    badgeColor: 'bg-green-500'
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-800',
    badgeColor: 'bg-red-500'
  }
};

// Property Features categorized by property type
export const PROPERTY_FEATURES = {
  Commercial: [
    "Conference Room",
    "CCTV Surveillance", 
    "Power Backup",
    "Fire Safety",
    "Cafeteria",
    "Reception Area",
    "Parking",
    "Lift(s)"
  ],
  Farmland: [
    "Borewell",
    "Fencing",
    "Electricity Connection",
    "Water Source",
    "Drip Irrigation",
    "Storage Shed"
  ],
  Outright: [
    "Highway Access",
    "Legal Assistance",
    "Joint Development Approved",
    "Investor Friendly",
    "Gated Boundary"
  ],
  "JD/JV": [
    "Highway Access",
    "Legal Assistance",
    "Joint Development Approved",
    "Investor Friendly",
    "Gated Boundary"
  ]
};

// Category-specific form fields
export const CATEGORY_FIELDS = {
  Outright: [
    "acre", 
    "propertyLabel", 
    "facing", 
    "roadWidth", 
    "legalClearance"
  ],
  Commercial: [
    "acre", 
    "propertyLabel", 
    "expectedROI", 
    "facing", 
    "roadWidth", 
    "legalClearance"
  ],
  Farmland: [
    "acre", 
    "propertyLabel", 
    "irrigationAvailable", 
    "waterSource", 
    "soilType", 
    "legalClearance"
  ],
  "JD/JV": [
    "acre", 
    "propertyLabel", 
    "typeOfJV", 
    "expectedROI", 
    "legalClearance"
  ]
};

// Nearby locations for distance tracking
export const NEARBY_LOCATIONS = [
  "Highway",
  "Airport", 
  "BusStop",
  "Metro",
  "CityCenter",
  "IndustrialArea"
];

// Indian cities for dropdown
export const CITIES = [
  "Mumbai",
  "Delhi", 
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivli",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad",
  "Ranchi",
  "Howrah",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Chandigarh"
];

// Facing directions
export const FACING_DIRECTIONS = [
  "North",
  "South", 
  "East",
  "West",
  "North-East",
  "North-West",
  "South-East",
  "South-West"
];

// Soil types for farmland
export const SOIL_TYPES = [
  "Black Soil",
  "Red Soil",
  "Alluvial Soil",
  "Laterite Soil",
  "Mountain Soil",
  "Desert Soil",
  "Saline Soil",
  "Peaty Soil"
];

// Water sources
export const WATER_SOURCES = [
  "Borewell",
  "Municipal Supply",
  "Well",
  "Canal",
  "River",
  "Lake",
  "Rainwater Harvesting"
];

// Property labels
export const PROPERTY_LABELS = [
  "Premium",
  "Budget",
  "Luxury",
  "Economy",
  "Standard",
  "Executive"
];

// JV Types
export const JV_TYPES = [
  "Joint Development",
  "Joint Venture",
  "Revenue Sharing",
  "Profit Sharing",
  "Equity Partnership"
];

// Sort options for properties
export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'acre_desc', label: 'Area: Large to Small' },
  { value: 'acre_asc', label: 'Area: Small to Large' }
];

// Price ranges for filters
export const PRICE_RANGES = [
  { label: 'Under ₹50L', min: 0, max: 5000000 },
  { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
  { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
  { label: 'Over ₹5Cr', min: 50000000, max: null }
];

// Area ranges for filters (in acre)
export const AREA_RANGES = [
  { label: 'Under 1000 sq.ft', min: 0, max: 1000 },
  { label: '1000 - 5000 sq.ft', min: 1000, max: 5000 },
  { label: '5000 - 10000 sq.ft', min: 5000, max: 10000 },
  { label: '10000 - 50000 sq.ft', min: 10000, max: 50000 },
  { label: 'Over 50000 sq.ft', min: 50000, max: null }
];

// Validation constants
export const VALIDATION = {
  TITLE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200
  },
  DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1000
  },
  PRICE: {
    MIN: 0,
    MAX: 1000000000 // 100Cr
  },
  acre_FEET: {
    MIN: 1,
    MAX: 10000000
  },
  ROI: {
    MIN: 0,
    MAX: 100
  },
  ROAD_WIDTH: {
    MIN: 0,
    MAX: 200
  }
};

// Image upload constants
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_IMAGES: 10
};

// API endpoints
export const API_ENDPOINTS = {
  PROPERTIES: '/properties',
  PROPERTIES_APPROVED: '/properties/approved',
  PROPERTIES_USER: '/properties/user/my-properties',
  PROPERTIES_ADMIN: '/admin/properties',
  PROPERTY_STATUS: '/admin/properties/:id/status'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user',
  FILTER_PREFERENCES: 'property_filters'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to access this feature.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Property not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  IMAGE_UPLOAD_ERROR: 'Error uploading images. Please try again.',
  PROPERTY_CREATE_ERROR: 'Error creating property. Please try again.',
  PROPERTY_UPDATE_ERROR: 'Error updating property. Please try again.',
  PROPERTY_DELETE_ERROR: 'Error deleting property. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  PROPERTY_CREATED: 'Property created successfully and submitted for approval!',
  PROPERTY_UPDATED: 'Property updated successfully!',
  PROPERTY_DELETED: 'Property deleted successfully!',
  PROPERTY_APPROVED: 'Property approved successfully!',
  PROPERTY_REJECTED: 'Property rejected successfully!',
  IMAGES_UPLOADED: 'Images uploaded successfully!'
};

// Default form values
export const DEFAULT_FORM_VALUES = {
  title: '',
  description: '',
  content: '',
  city: '',
  propertyLocation: '',
  coordinates: {
    latitude: '',
    longitude: ''
  },
  mapUrl: '',
  category: 'Outright',
  price: '',
  priceOnRequest: false,
  isFeatured: false,
  forSale: true,
  isVerified: false,
  attributes: {
    acre: '',
    propertyLabel: '',
    leaseDuration: '',
    typeOfJV: '',
    expectedROI: '',
    irrigationAvailable: false,
    facing: '',
    roadWidth: '',
    waterSource: '',
    soilType: '',
    legalClearance: false,
  },
  distanceKey: [],
  features: [],
  nearby: NEARBY_LOCATIONS.reduce((acc, key) => ({ ...acc, [key]: '' }), {})
};

// Export all constants as default object
const constants = {
  PROPERTY_CATEGORIES,
  APPROVAL_STATUS,
  APPROVAL_STATUS_LABELS,
  PROPERTY_FEATURES,
  CATEGORY_FIELDS,
  NEARBY_LOCATIONS,
  CITIES,
  FACING_DIRECTIONS,
  SOIL_TYPES,
  WATER_SOURCES,
  PROPERTY_LABELS,
  JV_TYPES,
  SORT_OPTIONS,
  PRICE_RANGES,
  AREA_RANGES,
  VALIDATION,
  IMAGE_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_FORM_VALUES
};

export default constants;