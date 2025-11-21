import React, { useState } from 'react';
import { 
  Brain, 
  Mail, 
  FileText, 
  AlertTriangle, 
  BookOpen, 
  TrendingUp,
  Users,
  Bell,
  Target,
  BarChart3
} from 'lucide-react';

export function FeatureCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: AlertTriangle,
      title: "Risk Summary Panel",
      description: "Real-time risk assessment with intelligent scoring algorithms",
      details: "Advanced analytics identify at-risk students using attendance patterns, academic performance, and behavioral indicators.",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      icon: Brain,
      title: "AI-Powered Tools",
      description: "Smart interventions powered by machine learning",
      details: "Generate personalized resources, draft empathetic communications, and create structured intervention plans automatically.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Target,
      title: "Action Center",
      description: "Centralized hub for all intervention activities",
      details: "Track interventions, schedule meetings, monitor progress, and collaborate with team members in one unified interface.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Proactive alerts for critical student situations",
      details: "Automated notifications for risk escalation, missed interventions, and progress milestones keep you informed.",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and trend analysis",
      details: "Visual dashboards show risk patterns, intervention effectiveness, and institutional performance metrics.",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description: "Team-based approach to student support",
      details: "Enable seamless collaboration between mentors, teachers, counselors, and administrators for holistic student care.",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`relative group cursor-pointer transition-all duration-500 ${
            hoveredCard === index ? 'scale-105 z-10' : ''
          }`}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className={`h-full p-8 rounded-2xl border-2 border-transparent transition-all duration-500 ${
            hoveredCard === index 
              ? 'bg-white dark:bg-gray-800 shadow-2xl border-gray-200 dark:border-gray-700' 
              : `${feature.bgColor} hover:shadow-xl`
          }`}>
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${feature.color} shadow-lg`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {feature.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {feature.description}
            </p>

            {/* Expanded Details */}
            <div className={`transition-all duration-500 overflow-hidden ${
              hoveredCard === index 
                ? 'max-h-40 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.details}
                </p>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className={`absolute bottom-4 right-4 transition-all duration-300 ${
              hoveredCard === index 
                ? 'opacity-100 transform translate-x-0' 
                : 'opacity-0 transform translate-x-2'
            }`}>
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${feature.color}`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}