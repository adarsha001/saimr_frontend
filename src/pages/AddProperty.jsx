import { useState } from "react";
import axios from "axios";
import API, { createProperty } from "../api/axios"; 
const categoryFields = {
  Flat: ["bedrooms", "bathrooms", "floors", "square", "garden", "balcony"],
  Villa: ["bedrooms", "bathrooms", "floors", "square", "garden", "balcony"],
  House: ["bedrooms", "bathrooms", "floors", "square", "garden", "balcony"],
  Lease: ["bedrooms", "bathrooms", "floors", "square", "leaseDuration", "garden", "balcony"],
  Outrade: ["square", "typeOfJV", "expectedROI"],
  Commercial: ["square", "floors"],
  Plots: ["square"],
  Farmland: ["square", "irrigationAvailable"],
  "JD/JV": ["square", "typeOfJV", "expectedROI"],
};

const allFeatures = [
  "Wifi", "Parking", "Swimming pool", "Balcony", "Garden", "Security", "Fitness center",
  "Children's Play Area", "Indore Games", "Laundry Room", "Pets Allow", "Spa & Massage",
  "Electricity", "Gated Community", "Street Lamp", "Drainage", "Tennis Court", "Lift(s)",
  "Golf Course", "Jogging Track", "Club House", "Senior Citizen Siteout", "Squash Court",
  "Yoga / Meditation Area", "Jacuzzi", "Mini Theatre"
];

const allNearby = ["Hospital", "SuperMarket", "School", "Airport", "BusStop", "Pharmacy", "Metro"];

export default function AddProperty() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    city: "",
    propertyLocation: "",
    coordinates: {
      latitude: "",
      longitude: ""
    },
    mapUrl: "",
    category: "Flat",
    price: "", // Can be number or "Price on Request"
    priceOnRequest: false, // New field to track price on request
    isFeatured: false,
    forSale: true,
    isVerified: false,
    attributes: {
      bedrooms: "",
      bathrooms: "",
      floors: "",
      square: "",
      propertyLabel: "",
      leaseDuration: "",
      typeOfJV: "",
      expectedROI: "",
      garden: false,
      irrigationAvailable: false,
      balcony: false,
    },
    distanceKey: [],
    features: [],
    nearby: allNearby.reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
    createdBy: "",
  });

  const [distanceInput, setDistanceInput] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes("attributes.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [key]: type === "checkbox" ? checked : value
        }
      }));
    } else if (name.includes("coordinates.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [key]: value
        }
      }));
    } else if (name.includes("nearby.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        nearby: {
          ...prev.nearby,
          [key]: value
        }
      }));
    } else if (name === "features") {
      const updatedFeatures = checked 
        ? [...formData.features, value] 
        : formData.features.filter(f => f !== value);
      setFormData(prev => ({ ...prev, features: updatedFeatures }));
    } else if (name === "priceOnRequest") {
      // When price on request is checked, clear the price field
      setFormData(prev => ({
        ...prev,
        priceOnRequest: checked,
        price: checked ? "Price on Request" : ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  const addDistanceKey = () => {
    if (distanceInput.trim()) {
      setFormData(prev => ({
        ...prev,
        distanceKey: [...prev.distanceKey, distanceInput.trim()]
      }));
      setDistanceInput("");
    }
  };

  const removeDistanceKey = (index) => {
    setFormData(prev => ({
      ...prev,
      distanceKey: prev.distanceKey.filter((_, i) => i !== index)
    }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      
      console.log('Starting property submission...');
      
      // Filter out empty nearby values
      const filteredNearby = Object.fromEntries(
        Object.entries(formData.nearby).filter(([_, value]) => value !== "")
      );

      // Prepare data for submission
      const submitData = {
        ...formData,
        // Handle price - if it's "Price on Request", send as string, otherwise as number
        price: formData.priceOnRequest ? "Price on Request" : (formData.price ? parseFloat(formData.price) : ""),
        nearby: filteredNearby,
        // Convert string numbers to actual numbers for attributes
        attributes: {
          ...formData.attributes,
          bedrooms: formData.attributes.bedrooms ? parseInt(formData.attributes.bedrooms) : "",
          bathrooms: formData.attributes.bathrooms ? parseInt(formData.attributes.bathrooms) : "",
          floors: formData.attributes.floors ? parseInt(formData.attributes.floors) : "",
          square: formData.attributes.square ? parseInt(formData.attributes.square) : "",
          expectedROI: formData.attributes.expectedROI ? parseFloat(formData.attributes.expectedROI) : "",
        }
      };

      // Remove priceOnRequest from final data as it's only for UI
      delete submitData.priceOnRequest;

      console.log('Prepared data:', submitData);

      // Append all data to FormData
      for (let key in submitData) {
        if (["attributes", "coordinates", "distanceKey", "features", "nearby"].includes(key)) {
          data.append(key, JSON.stringify(submitData[key]));
        } else {
          data.append(key, submitData[key]);
        }
      }

      // Append images
      images.forEach(img => {
        console.log('Appending image:', img.name);
        data.append("images", img);
      });

      console.log('Sending request to backend...');

      // Use the specific createProperty function
      const res = await createProperty(data);
      
      console.log('Property created successfully:', res.data);
      setSuccess("Property added successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        content: "",
        city: "",
        propertyLocation: "",
        coordinates: { latitude: "", longitude: "" },
        mapUrl: "",
        category: "Flat",
        price: "",
        priceOnRequest: false,
        isFeatured: false,
        forSale: true,
        isVerified: false,
        attributes: {
          bedrooms: "",
          bathrooms: "",
          floors: "",
          square: "",
          propertyLabel: "",
          leaseDuration: "",
          typeOfJV: "",
          expectedROI: "",
          garden: false,
          irrigationAvailable: false,
          balcony: false,
        },
        distanceKey: [],
        features: [],
        nearby: allNearby.reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
        createdBy: "",
      });
      setImages([]);
      setDistanceInput("");
      
    } catch (err) {
      console.error('Full error details:', err);
      console.error('Error response:', err.response);
      
      // More detailed error message
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error?.message || 
                          err.message || 
                          "Error adding property";
      
      setError(`Failed to add property: ${errorMessage}`);
      
      // Log additional details for debugging
      if (err.response?.data?.error) {
        console.error('Backend error details:', err.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const visibleAttributes = categoryFields[formData.category];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Title *</label>
              <input 
                type="text" 
                name="title" 
                placeholder="Property title" 
                value={formData.title} 
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.keys(categoryFields).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">City *</label>
              <input 
                type="text" 
                name="city" 
                placeholder="City" 
                value={formData.city} 
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>

            {/* Price Field with Price on Request Option */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="Enter price in ₹"
                    value={formData.priceOnRequest ? "" : formData.price}
                    onChange={handleChange}
                    disabled={formData.priceOnRequest}
                    className={`w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formData.priceOnRequest ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="priceOnRequest" 
                    checked={formData.priceOnRequest} 
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">Price on Request</span>
                </label>
              </div>
              {formData.priceOnRequest && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Property will be listed as "Price on Request"
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location *</label>
              <input 
                type="text" 
                name="propertyLocation" 
                placeholder="Property location" 
                value={formData.propertyLocation} 
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <textarea 
                name="description" 
                placeholder="Property description" 
                value={formData.description} 
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Property Attributes Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Property Details</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleAttributes.includes("bedrooms") && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bedrooms</label>
                <input 
                  type="number" 
                  name="attributes.bedrooms" 
                  placeholder="0" 
                  value={formData.attributes.bedrooms} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            )}
            
            {visibleAttributes.includes("bathrooms") && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bathrooms</label>
                <input 
                  type="number" 
                  name="attributes.bathrooms" 
                  placeholder="0" 
                  value={formData.attributes.bathrooms} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            )}
            
            {visibleAttributes.includes("floors") && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Floors</label>
                <input 
                  type="number" 
                  name="attributes.floors" 
                  placeholder="0" 
                  value={formData.attributes.floors} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            )}
            
            {visibleAttributes.includes("square") && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Square Feet</label>
                <input 
                  type="number" 
                  name="attributes.square" 
                  placeholder="0" 
                  value={formData.attributes.square} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            )}
            
            {visibleAttributes.includes("leaseDuration") && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Lease Duration</label>
                <input 
                  type="text" 
                  name="attributes.leaseDuration" 
                  placeholder="e.g., 12 months" 
                  value={formData.attributes.leaseDuration} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            )}
            
            {visibleAttributes.includes("typeOfJV") && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type of JV</label>
                <input 
                  type="text" 
                  name="attributes.typeOfJV" 
                  placeholder="Joint venture type" 
                  value={formData.attributes.typeOfJV} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            )}
            
            {visibleAttributes.includes("expectedROI") && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Expected ROI (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  name="attributes.expectedROI" 
                  placeholder="0.0" 
                  value={formData.attributes.expectedROI} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            )}
            
            {/* Checkbox attributes */}
            <div className="flex flex-col space-y-2">
              {visibleAttributes.includes("garden") && (
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="attributes.garden" 
                    checked={formData.attributes.garden} 
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">Garden</span>
                </label>
              )}
              
              {visibleAttributes.includes("balcony") && (
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="attributes.balcony" 
                    checked={formData.attributes.balcony} 
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">Balcony</span>
                </label>
              )}
              
              {visibleAttributes.includes("irrigationAvailable") && (
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="attributes.irrigationAvailable" 
                    checked={formData.attributes.irrigationAvailable} 
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">Irrigation Available</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Features & Amenities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allFeatures.map(feature => (
              <label key={feature} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                <input 
                  type="checkbox" 
                  value={feature} 
                  checked={formData.features.includes(feature)} 
                  onChange={handleChange}
                  name="features"
                  className="rounded border-gray-300"
                />
                <span className="text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nearby Locations Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nearby Locations (Distance in km)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {allNearby.map(place => (
              <div key={place} className="flex items-center space-x-3">
                <label className="w-32 text-sm font-medium text-gray-600">{place}</label>
                <input 
                  type="number" 
                  step="0.1"
                  name={`nearby.${place}`}
                  placeholder="Distance in km"
                  value={formData.nearby[place]} 
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 p-2 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Distance Highlights Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Distance Highlights</h2>
          <div className="flex space-x-2 mb-3">
            <input 
              type="text" 
              value={distanceInput}
              onChange={(e) => setDistanceInput(e.target.value)}
              placeholder="e.g., 2km from metro station"
              className="flex-1 border border-gray-300 p-2 rounded-lg"
            />
            <button 
              type="button"
              onClick={addDistanceKey}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.distanceKey.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                <span>{item}</span>
                <button 
                  type="button"
                  onClick={() => removeDistanceKey(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Images Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Location & Media</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Latitude</label>
              <input 
                type="number" 
                step="any" 
                name="coordinates.latitude" 
                placeholder="Latitude" 
                value={formData.coordinates.latitude} 
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Longitude</label>
              <input 
                type="number" 
                step="any" 
                name="coordinates.longitude" 
                placeholder="Longitude" 
                value={formData.coordinates.longitude} 
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Map URL</label>
            <input 
              type="url" 
              name="mapUrl" 
              placeholder="Google Maps URL" 
              value={formData.mapUrl} 
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Property Images</label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImages}
              className="w-full border border-gray-300 p-3 rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-1">Select multiple images for the property</p>
          </div>
        </div>

        {/* Status Options */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Property Status</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                name="forSale" 
                checked={formData.forSale} 
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">For Sale</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                name="isFeatured" 
                checked={formData.isFeatured} 
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">Featured Property</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                name="isVerified" 
                checked={formData.isVerified} 
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">Verified Property</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-200 font-semibold text-lg"
          >
            {loading ? "Adding Property..." : "Add Property"}
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}