import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, BookOpen, Mail, FileText, Lightbulb, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { Student } from '../types/student';
import { generateMockStudents } from '../data/mockData';
import { AIInsights } from '../components/student/AIInsights';
import { InterventionHistory } from '../components/student/InterventionHistory';
import { StudentMetrics } from '../components/student/StudentMetrics';
import { ProgressChart } from '../components/student/ProgressChart';

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockStudents = generateMockStudents(150);
      const foundStudent = mockStudents.find(s => s.id === id);
      setStudent(foundStudent || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Student Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The student you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'insights', name: 'AI Insights', icon: Brain },
    { id: 'interventions', name: 'Interventions', icon: Lightbulb },
    { id: 'progress', name: 'Progress', icon: Calendar },
  ];

  const getRiskColor = (level: Student['riskLevel']) => {
    const colors = {
      low: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
      high: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[level];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {student.studentId} • {student.class} • {student.department}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(student.riskLevel)}`}>
                {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)} Risk
              </span>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Risk Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{student.riskScore}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <StudentMetrics student={student} />}
        {activeTab === 'insights' && <AIInsights student={student} />}
        {activeTab === 'interventions' && <InterventionHistory student={student} />}
        {activeTab === 'progress' && <ProgressChart student={student} />}
      </div>
    </div>
  );
}