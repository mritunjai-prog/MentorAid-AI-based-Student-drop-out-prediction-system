import React from 'react';
import { Calendar, BookOpen, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Student } from '../../types/student';

// Custom Rupee Icon Component
const RupeeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.66 7H16v2h-2.34c-.59 1.69-2.07 3-3.66 3s-3.07-1.31-3.66-3H4V7h2.34C6.93 5.31 8.41 4 10 4s3.07 1.31 3.66 3zM10 10c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-4h2v2h-2V8zm0 4h2v2h-2v-2z"/>
    <path d="M7 13l5 5-1.41 1.41L7 15.83l-3.59 3.58L2 18l5-5z"/>
  </svg>
);

interface StudentMetricsProps {
  student: Student;
}

export function StudentMetrics({ student }: StudentMetricsProps) {
  const getAttendanceStatus = () => {
    if (student.attendance >= 80) return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle };
    if (student.attendance >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: AlertTriangle };
    return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', icon: AlertTriangle };
  };

  const getMarksStatus = () => {
    if (student.averageMarks >= 80) return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle };
    if (student.averageMarks >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: AlertTriangle };
    return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', icon: AlertTriangle };
  };

  const getFeeStatus = () => {
    switch (student.feeStatus) {
      case 'paid': return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', text: 'Paid', icon: CheckCircle };
      case 'pending': return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'Pending', icon: AlertTriangle };
      case 'overdue': return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', text: 'Overdue', icon: AlertTriangle };
    }
  };

  const attendanceStatus = getAttendanceStatus();
  const marksStatus = getMarksStatus();
  const feeStatus = getFeeStatus();

  const recentGrades = [
    { subject: 'Mathematics', grade: 'B+', score: 87 },
    { subject: 'Science', grade: 'A-', score: 92 },
    { subject: 'English', grade: 'B', score: 78 },
    { subject: 'History', grade: 'C+', score: 72 },
    { subject: 'Physics', grade: 'B+', score: 85 },
  ];

  const attendanceHistory = [
    { month: 'January', percentage: 85 },
    { month: 'February', percentage: 78 },
    { month: 'March', percentage: 72 },
    { month: 'April', percentage: 68 },
    { month: 'May', percentage: student.attendance },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Key Metrics */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.attendance}%</p>
              </div>
              <div className={`p-3 rounded-lg ${attendanceStatus.bg}`}>
                <Calendar className={`w-6 h-6 ${attendanceStatus.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <attendanceStatus.icon className={`w-4 h-4 ${attendanceStatus.color} mr-2`} />
                <span className={`text-sm font-medium ${attendanceStatus.color}`}>
                  {student.attendance >= 80 ? 'Good Attendance' : 
                   student.attendance >= 60 ? 'Needs Improvement' : 'Poor Attendance'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Marks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.averageMarks}%</p>
              </div>
              <div className={`p-3 rounded-lg ${marksStatus.bg}`}>
                <BookOpen className={`w-6 h-6 ${marksStatus.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <marksStatus.icon className={`w-4 h-4 ${marksStatus.color} mr-2`} />
                <span className={`text-sm font-medium ${marksStatus.color}`}>
                  {student.averageMarks >= 80 ? 'Excellent Performance' : 
                   student.averageMarks >= 60 ? 'Satisfactory' : 'Needs Support'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fee Status</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{feeStatus.text}</p>
              </div>
              <div className={`p-3 rounded-lg ${feeStatus.bg}`}>
                <RupeeIcon className={`w-6 h-6 ${feeStatus.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <feeStatus.icon className={`w-4 h-4 ${feeStatus.color} mr-2`} />
                <span className={`text-sm font-medium ${feeStatus.color}`}>
                  {feeStatus.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Subject Performance</h3>
          <div className="space-y-4">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">{grade.subject}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{grade.score}%</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    grade.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    grade.score >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    grade.score >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {grade.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trend</h3>
          <div className="space-y-3">
            {attendanceHistory.map((record, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{record.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        record.percentage >= 80 ? 'bg-green-500' :
                        record.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${record.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                    {record.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Risk Summary */}
      <div className="space-y-6">
        {/* Risk Assessment */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Assessment</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{student.riskScore}</div>
            <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
              student.riskLevel === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
              student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)} Risk
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Attendance Factor</span>
              <span className="text-sm font-medium">{Math.round((100 - student.attendance) * 0.6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Academic Factor</span>
              <span className="text-sm font-medium">{Math.round((100 - student.averageMarks) * 0.4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fee Factor</span>
              <span className="text-sm font-medium">
                {student.feeStatus === 'paid' ? 0 : student.feeStatus === 'pending' ? 5 : 15}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Intervention
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Progress
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{student.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Guardian</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe (Father)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}