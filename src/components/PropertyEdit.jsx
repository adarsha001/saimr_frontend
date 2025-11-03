import React, { useState, useEffect } from 'react';
import { fetchAllProperties, updateProperty } from '../api/adminApi';

const PropertyEdit = ({ propertyId, onClose, onUpdate }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    city: '',
    propertyLocation: '',
    price: '',
    category: '',
    forSale: true,
    isFeatured: false,
    isVerified: false, // Add verified field
    approvalStatus: 'pending',
    displayOrder: 0,
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
      legalClearance: false
    },
    features: [],
    nearby: {
      Highway: '',
      Airport: '',
      BusStop: '',
      Metro: '',
      CityCenter: '',
      IndustrialArea: ''
    }
  });

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const response = await fetchAllProperties();
      const foundProperty = response.data.properties.find(p => p._id === propertyId);
      if (foundProperty) {
        setProperty(foundProperty);
        initializeFormData(foundProperty);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      alert('Error loading property details');
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = (propertyData) => {
    setFormData({
      title: propertyData.title || '',
      description: propertyData.description || '',
      content: propertyData.content || '',
      city: propertyData.city || '',
      propertyLocation: propertyData.propertyLocation || '',
      price: propertyData.price || '',
      category: propertyData.category || '',
      forSale: propertyData.forSale !== undefined ? propertyData.forSale : true,
      isFeatured: propertyData.isFeatured || false,
      isVerified: propertyData.isVerified || false, // Initialize verified field
      approvalStatus: propertyData.approvalStatus || 'pending',
      displayOrder: propertyData.displayOrder || 0,
      attributes: {
        acre: propertyData.attributes?.acre || '',
        propertyLabel: propertyData.attributes?.propertyLabel || '',
        leaseDuration: propertyData.attributes?.leaseDuration || '',
        typeOfJV: propertyData.attributes?.typeOfJV || '',
        expectedROI: propertyData.attributes?.expectedROI || '',
        irrigationAvailable: propertyData.attributes?.irrigationAvailable || false,
        facing: propertyData.attributes?.facing || '',
        roadWidth: propertyData.attributes?.roadWidth || '',
        waterSource: propertyData.attributes?.waterSource || '',
        soilType: propertyData.attributes?.soilType || '',
        legalClearance: propertyData.attributes?.legalClearance || false
      },
      features: propertyData.features || [],
      nearby: {
        Highway: propertyData.nearby?.Highway || '',
        Airport: propertyData.nearby?.Airport || '',
        BusStop: propertyData.nearby?.BusStop || '',
        Metro: propertyData.nearby?.Metro || '',
        CityCenter: propertyData.nearby?.CityCenter || '',
        IndustrialArea: propertyData.nearby?.IndustrialArea || ''
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAttributeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleNearbyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      nearby: {
        ...prev.nearby,
        [name]: value
      }
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const cleanedData = cleanFormData(formData);
      await updateProperty(propertyId, cleanedData);
      alert('Property updated successfully!');
      onUpdate?.();
      onClose?.();
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property');
    } finally {
      setSaving(false);
    }
  };

  const cleanFormData = (data) => {
    return {
      ...data,
      price: data.price === '' ? 0 : data.price,
      displayOrder: data.displayOrder === '' ? 0 : data.displayOrder,
      attributes: {
        ...data.attributes,
        acre: data.attributes.acre === '' ? undefined : data.attributes.acre,
        roadWidth: data.attributes.roadWidth === '' ? undefined : data.attributes.roadWidth,
        expectedROI: data.attributes.expectedROI === '' ? undefined : data.attributes.expectedROI
      },
      nearby: Object.fromEntries(
        Object.entries(data.nearby).map(([key, value]) => [key, value === '' ? undefined : value])
      )
    };
  };

  const featureOptions = {
    Commercial: [
      "Conference Room", "CCTV Surveillance", "Power Backup", "Fire Safety",
      "Cafeteria", "Reception Area", "Parking", "Lift(s)"
    ],
    Farmland: [
      "Borewell", "Fencing", "Electricity Connection", "Water Source",
      "Drip Irrigation", "Storage Shed"
    ],
    Outright: [
      "Highway Access", "Legal Assistance", "Joint Development Approved",
      "Investor Friendly", "Gated Boundary"
    ],
    "JD/JV": [
      "Highway Access", "Legal Assistance", "Joint Development Approved",
      "Investor Friendly", "Gated Boundary"
    ]
  };

  const getCurrentFeatures = () => {
    return featureOptions[formData.category] || [];
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Property</h2>
            <p className="text-sm text-gray-600 mt-1">
              {property?.title} - {property?.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Property Title *"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Category *"
                  name="category"
                  type="select"
                  value={formData.category}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select Category' },
                    { value: 'Commercial', label: 'Commercial' },
                    { value: 'Farmland', label: 'Farmland' },
                    { value: 'Outright', label: 'Outright' },
                    { value: 'JD/JV', label: 'JD/JV' }
                  ]}
                  required
                />

                <FormField
                  label="City *"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />

                <FormField
                  label="Price *"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />

                <div className="md:col-span-2">
                  <FormField
                    label="Description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    label="Full Address"
                    name="propertyLocation"
                    type="text"
                    value={formData.propertyLocation}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </Section>

            {/* Property Attributes Section */}
            <Section title="Property Attributes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="acre"
                  name="acre"
                  type="number"
                  value={formData.attributes.acre}
                  onChange={handleAttributeChange}
                />

                <FormField
                  label="Property Label"
                  name="propertyLabel"
                  type="text"
                  value={formData.attributes.propertyLabel}
                  onChange={handleAttributeChange}
                />

                {formData.category === 'JD/JV' && (
                  <div className="md:col-span-2">
                    <FormField
                      label="Type of JV"
                      name="typeOfJV"
                      type="text"
                      value={formData.attributes.typeOfJV}
                      onChange={handleAttributeChange}
                    />
                  </div>
                )}

                {(formData.category === 'Commercial' || formData.category === 'JD/JV') && (
                  <FormField
                    label="Expected ROI (%)"
                    name="expectedROI"
                    type="number"
                    step="0.1"
                    value={formData.attributes.expectedROI}
                    onChange={handleAttributeChange}
                  />
                )}

                {formData.category === 'Farmland' && (
                  <>
                    <FormField
                      label="Soil Type"
                      name="soilType"
                      type="text"
                      value={formData.attributes.soilType}
                      onChange={handleAttributeChange}
                    />
                    <CheckboxField
                      label="Irrigation Available"
                      name="irrigationAvailable"
                      checked={formData.attributes.irrigationAvailable}
                      onChange={handleAttributeChange}
                    />
                  </>
                )}

                {(formData.category === 'Outright' || formData.category === 'JD/JV') && (
                  <CheckboxField
                    label="Legal Clearance"
                    name="legalClearance"
                    checked={formData.attributes.legalClearance}
                    onChange={handleAttributeChange}
                  />
                )}
              </div>
            </Section>

            {/* Features Section */}
            <Section title="Features">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getCurrentFeatures().map(feature => (
                  <CheckboxField
                    key={feature}
                    label={feature}
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                  />
                ))}
              </div>
            </Section>

            {/* Nearby Locations Section */}
            <Section title="Nearby Locations (km)">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.nearby).map(([key, value]) => (
                  <FormField
                    key={key}
                    label={key}
                    name={key}
                    type="number"
                    step="0.1"
                    value={value}
                    onChange={handleNearbyChange}
                  />
                ))}
              </div>
            </Section>

            {/* Admin Controls Section */}
            <Section title="Admin Controls">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Approval Status"
                  name="approvalStatus"
                  type="select"
                  value={formData.approvalStatus}
                  onChange={handleInputChange}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' }
                  ]}
                />

                <FormField
                  label="Display Order"
                  name="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                />

                <div className="flex flex-col space-y-3">
                  <CheckboxField
                    label="Featured Property"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <CheckboxField
                    label="Verified Property"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                  />
                  <CheckboxField
                    label="For Sale"
                    name="forSale"
                    checked={formData.forSale}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </Section>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center space-x-2"
              >
                {saving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{saving ? 'Saving...' : 'Update Property'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, children }) => (
  <div className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

// Reusable Form Field Component
const FormField = ({ label, name, type = 'text', value, onChange, options = [], required = false, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {type === 'select' ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required={required}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={props.rows || 3}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required={required}
        {...props}
      />
    )}
  </div>
);

// Reusable Checkbox Component
const CheckboxField = ({ label, name, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label className="ml-2 block text-sm text-gray-700">
      {label}
    </label>
  </div>
);

export default PropertyEdit;