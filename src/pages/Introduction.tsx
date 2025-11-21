import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Play,
  Heart,
  Shield,
  Zap,
} from "lucide-react";
import { AnimatedLoader } from "../components/ui/AnimatedLoader";
// import { LightRays } from "../components/ui/LightRays";
import { LightRaysFallback as LightRays } from "../components/ui/LightRaysFallback";
import { DashboardShowcase } from "../components/introduction/DashboardShowcase";
import { FeatureCards } from "../components/introduction/FeatureCards";
import { FutureEnhancements } from "../components/introduction/FutureEnhancements";

export default function Introduction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const heroFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Risk Prediction",
      description:
        "Advanced algorithms identify at-risk students before it's too late",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Users,
      title: "Unified Student Support",
      description:
        "Consolidate attendance, grades, and interventions in one platform",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Insights",
      description: "Transform raw data into actionable intervention strategies",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  const userRoles = [
    {
      role: "Mentor/Counselor",
      access: "Dashboard & AI Tools",
      goal: "Support at-risk students with personalized interventions",
      icon: Heart,
      color:
        "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800",
    },
    {
      role: "Administrator",
      access: "Full System Overview",
      goal: "Monitor institutional risk patterns and resource allocation",
      icon: Shield,
      color:
        "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    },
    {
      role: "Teacher",
      access: "Student Progress Tracking",
      goal: "Early identification and classroom-level interventions",
      icon: Zap,
      color:
        "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <AnimatedLoader />
          <p className="text-white text-xl mt-8 animate-pulse">
            Initializing MentorAid Platform...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section with Light Rays */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="absolute inset-0 opacity-30">
          <LightRays
            raysOrigin="top-center"
            raysColor="#3B82F6"
            raysSpeed={0.8}
            lightSpread={2}
            rayLength={1.5}
            pulsating={true}
            fadeDistance={0.8}
            followMouse={true}
            mouseInfluence={0.15}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl mb-6">
              <span className="text-3xl font-bold text-white">M</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              MentorAid
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-light">
              Unified Student Risk & Mentorship Platform
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              Harness the power of AI and data analytics to identify, support,
              and guide at-risk students towards academic success. Transform
              fragmented data into actionable insights.
            </p>
          </div>

          {/* Hero Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {heroFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    feature.color.includes("purple")
                      ? "bg-purple-100 dark:bg-purple-900/20"
                      : feature.color.includes("blue")
                      ? "bg-blue-100 dark:bg-blue-900/20"
                      : "bg-green-100 dark:bg-green-900/20"
                  }`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Explore Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700"
            >
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Experience the Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Interactive dashboard previews showcasing real-time student
              analytics, AI-powered interventions, and comprehensive risk
              management tools.
            </p>
          </div>
          <DashboardShowcase />
        </div>
      </section>

      {/* Target Users */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Education Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Tailored experiences for every role in student support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userRoles.map((user, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${user.color}`}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <user.icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.role}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.access}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{user.goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section
        id="features"
        className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Comprehensive tools designed to transform student support
            </p>
          </div>
          <FeatureCards />
        </div>
      </section>

      {/* Future Enhancements */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                Coming Soon
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Future Enhancements
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Exciting features in development to further enhance student
              support
            </p>
          </div>
          <FutureEnhancements />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <LightRays
            raysOrigin="bottom-center"
            raysColor="#ffffff"
            raysSpeed={0.5}
            lightSpread={3}
            rayLength={1}
            pulsating={false}
            fadeDistance={1.2}
            followMouse={false}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Student Support?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of educators already using MentorAid to identify,
            support, and guide students towards success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
