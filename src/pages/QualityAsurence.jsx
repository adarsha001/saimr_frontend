import React, { useState, useEffect, useRef } from 'react';

export default function QualityAssurance() {
  const [counters, setCounters] = useState({
    years: 0,
    acres: 0,
    clients: 0,
    projects: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      years: 15,
      acres: 500,
      clients: 200,
      projects: 75
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounters({
        years: Math.floor(targets.years * progress),
        acres: Math.floor(targets.acres * progress),
        clients: Math.floor(targets.clients * progress),
        projects: Math.floor(targets.projects * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
  };

  const stats = [
    {
      number: `${counters.years}+`,
      label: 'YEARS OF',
      sublabel: 'EXCELLENCE'
    },
    {
      number: `${counters.acres}+`,
      label: 'ACRES OF LAND',
      sublabel: 'DEVELOPED'
    },
    {
      number: `${counters.clients}+`,
      label: 'SATISFIED',
      sublabel: 'CLIENTS'
    },
    {
      number: `${counters.projects}+`,
      label: 'SUCCESSFUL',
      sublabel: 'DEALS'
    }
  ];

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Content Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20">
        {/* Header */}
        <div className="max-w-5xl mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight">
            WHY CHOOSE SAIMR GROUPS
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
            As Bangalore's leading real estate consultants, we specialize in connecting investors and developers 
            with prime land opportunities. Our expertise spans Joint Developments, Joint Ventures, and Outright 
            Land Sales, focusing exclusively on clear-title properties in strategic locations across Karnataka.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mb-12 sm:mb-0">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="group relative"
              style={{
                animationDelay: `${idx * 150}ms`
              }}
            >
              <div className="relative p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-l-4 border-gray-900 hover:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="space-y-2">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
                    {stat.number}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 tracking-wider">
                      {stat.label}
                    </div>
                    <div className="text-xs sm:text-sm font-light text-gray-600 tracking-widest">
                      {stat.sublabel}
                    </div>
                  </div>
                </div>
                {/* Decorative line */}
                <div className="absolute top-0 left-0 w-0 h-full bg-gray-900/5 group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl">
          <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8">Our Core Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 border-l-4 border-blue-600 hover:shadow-lg transition-all duration-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Joint Development</h4>
              <p className="text-gray-700">Strategic partnerships for land development with transparent agreements</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 border-l-4 border-green-600 hover:shadow-lg transition-all duration-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Joint Ventures</h4>
              <p className="text-gray-700">Collaborative projects with shared expertise and resources</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 border-l-4 border-orange-600 hover:shadow-lg transition-all duration-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Outright Sales</h4>
              <p className="text-gray-700">Premium land parcels with clear titles in prime locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Image Section */}
      <div className="relative lg:absolute lg:bottom-0 lg:right-0 lg:w-3/5 h-64 sm:h-80 lg:h-3/5 mt-8 lg:mt-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 z-0" />
        
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 z-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-sm font-medium">Land Development Experts</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/917788999022" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contact us on WhatsApp"
      >
        <svg 
          className="w-7 h-7 sm:w-8 sm:h-8 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      </a>
    </div>
  );
}