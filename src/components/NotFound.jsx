import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Premium Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-2 h-12 bg-black"></div>
            <h1 className="text-4xl font-light tracking-widest text-gray-900 uppercase">
              404
            </h1>
            <div className="w-2 h-12 bg-black"></div>
          </div>
          <h2 className="text-2xl font-light text-gray-700 mb-4 tracking-wide">
            Property Not Found
          </h2>
          <div className="w-24 h-0.5 bg-gray-400 mx-auto"></div>
        </div>

        {/* Luxury Illustration */}
        <div className="mb-12">
          <div className="relative mx-auto w-80 h-80">
            {/* Main Building Structure */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-white rounded-lg shadow-2xl border border-gray-300 flex items-center justify-center relative overflow-hidden">
                {/* Modern Building */}
                <div className="relative">
                  {/* Building Base */}
                  <div className="w-48 h-32 bg-gray-100 rounded-sm border border-gray-300">
                    {/* Windows Grid */}
                    <div className="grid grid-cols-4 gap-2 p-3">
                      <div className="h-4 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded-sm"></div>
                    </div>
                    {/* Entrance */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-gray-800 rounded-t-sm"></div>
                  </div>
                  
                  {/* Building Top */}
                  <div className="w-52 h-4 bg-gray-800 -mt-1 -mx-2 rounded-t-sm"></div>
                  
                  {/* Search Magnifier */}
                  <div className="absolute -top-6 -right-6">
                    <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-800 shadow-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Lines */}
                <div className="absolute top-4 left-4 w-1 h-20 bg-gray-300"></div>
                <div className="absolute top-4 right-4 w-1 h-20 bg-gray-300"></div>
                <div className="absolute bottom-4 left-4 w-20 h-1 bg-gray-300"></div>
                <div className="absolute bottom-4 right-4 w-20 h-1 bg-gray-300"></div>
              </div>
            </div>
            
            {/* Floating Geometric Elements */}
            <div className="absolute top-8 left-8 w-6 h-6 border-2 border-gray-400 rotate-45 animate-pulse"></div>
            <div className="absolute bottom-12 right-10 w-4 h-4 border border-gray-500 rounded-full animate-bounce"></div>
            <div className="absolute top-12 right-12 w-3 h-3 bg-gray-600 rotate-45 animate-pulse delay-75"></div>
            <div className="absolute bottom-8 left-10 w-5 h-5 border border-gray-400 rounded-sm animate-bounce delay-150"></div>
          </div>
        </div>

        {/* Premium Content */}
        <div className="bg-white rounded-none shadow-sm border border-gray-200 p-12 relative">
          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-gray-400"></div>
          <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-gray-400"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-gray-400"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-gray-400"></div>
          
          <div className="mb-10">
            <p className="text-gray-600 text-lg leading-relaxed font-light tracking-wide max-w-md mx-auto">
              The property you seek appears to be unavailable. Perhaps it has found its perfect match, 
              or awaits discovery in our curated collection of exceptional real estate opportunities.
            </p>
          </div>

          {/* Luxury Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-black text-white font-light tracking-widest uppercase text-sm hover:bg-gray-900 transition-all duration-300 border border-black overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-4 h-4 mr-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
            
            <Link
              to="/properties"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-light tracking-widest uppercase text-sm hover:bg-gray-50 transition-all duration-300 border border-gray-400 hover:border-gray-600"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-4 h-4 mr-3 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Explore Collection
              </span>
            </Link>
          </div>

          {/* Premium Quick Links */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-500 text-xs font-light tracking-widest uppercase mb-6">
              Continue Your Journey
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/featured" 
                className="text-gray-700 hover:text-black text-sm font-light tracking-wide transition-colors duration-300 relative group"
              >
                Featured Estates
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="w-px h-4 bg-gray-300"></div>
              <Link 
                to="/add-property" 
                className="text-gray-700 hover:text-black text-sm font-light tracking-wide transition-colors duration-300 relative group"
              >
                List Property
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="w-px h-4 bg-gray-300"></div>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-black text-sm font-light tracking-wide transition-colors duration-300 relative group"
              >
                Client Portal
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </div>

        {/* Luxury Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-xs font-light tracking-widest uppercase">
            Require Personal Assistance?{" "}
            <Link to="/contact" className="text-gray-700 hover:text-black transition-colors duration-300 border-b border-transparent hover:border-gray-700">
              Connect With Our Concierge
            </Link>
          </p>
        </div>

        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;