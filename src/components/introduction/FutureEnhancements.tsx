import React from "react";
import {
  Brain,
  Gamepad2,
  Heart,
  Smartphone,
  Globe,
  Zap,
  Sparkles,
  Clock,
} from "lucide-react";

export function FutureEnhancements() {
  const enhancements = [
    {
      icon: Heart,
      title: "Student Sentiment AI",
      description: "Detect stress & burnout from notes",
      details:
        "Advanced NLP analysis of student communications, assignments, and feedback to identify emotional distress patterns and mental health concerns.",
      timeline: "Q2 2025",
      status: "In Development",
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: Smartphone,
      title: "Student Dashboard",
      description: "Progress tracking & insights for students",
      details:
        "Personalized student portal with progress visualization, goal setting, resource recommendations, and peer comparison features.",
      timeline: "Q3 2025",
      status: "Planned",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Gamepad2,
      title: "Gamified Mentor View",
      description: "Reward mentors based on student improvement",
      details:
        "Achievement system with badges, leaderboards, and recognition programs to motivate mentors and celebrate successful interventions.",
      timeline: "Q4 2025",
      status: "Concept",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Global accessibility with localization",
      details:
        "Complete internationalization with support for multiple languages, cultural contexts, and regional educational standards.",
      timeline: "Q1 2025",
      status: "Research",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Brain,
      title: "Predictive Analytics 2.0",
      description: "Advanced ML models for early intervention",
      details:
        "Next-generation machine learning with deep learning models, behavioral pattern recognition, and predictive intervention timing.",
      timeline: "Q2 2025",
      status: "Research",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Live team coordination and communication",
      details:
        "Real-time messaging, video conferencing integration, shared workspaces, and instant notification systems for immediate response.",
      timeline: "Q3 2025",
      status: "Concept",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Financial Counselling & Support",
      details:
        "Enables comprehensive financial guidance including engaging government schemes, providing actionable insights, and empowering users towards stable and sustainable financial conditions.",
      timeline: "Q3 2025",
      status: "Concept",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Development":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Planned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Concept":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "Research":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Timeline Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full">
          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            Development Roadmap
          </span>
        </div>
      </div>

      {/* Enhancement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {enhancements.map((enhancement, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${enhancement.bgColor} border border-gray-200 dark:border-gray-700`}
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  enhancement.status
                )}`}
              >
                {enhancement.status}
              </span>
            </div>

            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${enhancement.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <enhancement.icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {enhancement.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
              {enhancement.description}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              {enhancement.details}
            </p>

            {/* Timeline */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {enhancement.timeline}
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800">
        <Sparkles className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Shape the Future of Student Support
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Have ideas for new features? Want to influence our development
          roadmap? Join our community of educators and help us build the next
          generation of student support tools.
        </p>
        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Brain className="w-5 h-5 mr-2" />
          Join Our Student Beta Program
        </button>
      </div>
    </div>
  );
}
