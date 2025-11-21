import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export function DashboardShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const dashboardImages = [
    {
      title: "Mentor Dashboard Overview",
      description: "Comprehensive view of all students with risk indicators and quick actions",
      image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
      features: ["Risk Assessment", "Student Analytics", "Quick Actions"]
    },
    {
      title: "Student Risk Analysis",
      description: "Detailed risk breakdown with attendance, academic performance, and intervention history",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
      features: ["Risk Scoring", "Trend Analysis", "Predictive Insights"]
    },
    {
      title: "AI-Powered Interventions",
      description: "Smart recommendations and automated support tools for personalized student assistance",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
      features: ["AI Recommendations", "Resource Curation", "Email Drafting"]
    },
    {
      title: "Progress Tracking",
      description: "Visual progress monitoring with charts and intervention impact analysis",
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
      features: ["Progress Charts", "Impact Analysis", "Goal Tracking"]
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dashboardImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, dashboardImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dashboardImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + dashboardImages.length) % dashboardImages.length);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Showcase */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative h-96 md:h-[500px]">
          {dashboardImages.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 transform translate-x-0' 
                  : index < currentSlide 
                    ? 'opacity-0 transform -translate-x-full'
                    : 'opacity-0 transform translate-x-full'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {slide.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {slide.description}
                  </p>
                  <div className="space-y-3">
                    {slide.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <button
            onClick={nextSlide}
            className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Play className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {dashboardImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-blue-600' 
                  : 'bg-white/50 dark:bg-gray-600/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {dashboardImages.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${
              index === currentSlide 
                ? 'ring-4 ring-blue-500 scale-105' 
                : 'hover:scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-sm font-medium truncate">
                {slide.title}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}