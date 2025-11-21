import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';
import { Student } from '../../types/student';

interface ProgressChartProps {
  student: Student;
}

export function ProgressChart({ student }: ProgressChartProps) {
  // Mock progress data over time
  const attendanceProgress = [
    { month: 'Aug', attendance: 92, target: 80 },
    { month: 'Sep', attendance: 89, target: 80 },
    { month: 'Oct', attendance: 85, target: 80 },
    { month: 'Nov', attendance: 78, target: 80 },
    { month: 'Dec', attendance: 72, target: 80 },
    { month: 'Jan', attendance: student.attendance, target: 80 },
  ];

  const academicProgress = [
    { month: 'Aug', marks: 82, average: 78 },
    { month: 'Sep', marks: 79, average: 78 },
    { month: 'Oct', marks: 76, average: 78 },
    { month: 'Nov', marks: 73, average: 78 },
    { month: 'Dec', marks: 70, average: 78 },
    { month: 'Jan', marks: student.averageMarks, average: 78 },
  ];

  const subjectProgress = [
    { subject: 'Math', current: 72, previous: 68, improvement: 4 },
    { subject: 'Science', current: 85, previous: 82, improvement: 3 },
    { subject: 'English', current: 78, previous: 75, improvement: 3 },
    { subject: 'History', current: 69, previous: 71, improvement: -2 },
    { subject: 'Physics', current: 74, previous: 70, improvement: 4 },
  ];

  const interventionImpact = [
    { date: '2024-01-01', riskScore: 78 },
    { date: '2024-01-05', riskScore: 75 },
    { date: '2024-01-10', riskScore: 72 }, // Tutoring started
    { date: '2024-01-15', riskScore: 68 }, // Parent meeting
    { date: '2024-01-20', riskScore: student.riskScore },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Trend</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">-20%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Since August</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Academic Trend</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">-12%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Since August</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interventions</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">4</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This semester</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Reduction</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">-10</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Since interventions</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#EF4444" strokeWidth={3} name="Attendance" />
                <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Academic Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={academicProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Legend />
                <Area type="monotone" dataKey="marks" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Student Marks" />
                <Line type="monotone" dataKey="average" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Class Average" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-wise Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Legend />
                <Bar dataKey="previous" fill="#94A3B8" name="Previous" />
                <Bar dataKey="current" fill="#3B82F6" name="Current" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {subjectProgress.map((subject, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{subject.subject}</span>
                <div className="flex items-center">
                  <span className={`font-medium ${subject.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {subject.improvement >= 0 ? '+' : ''}{subject.improvement}%
                  </span>
                  {subject.improvement >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 ml-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intervention Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interventionImpact}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis domain={[0, 100]} />
                <Tooltip labelFormatter={formatDate} formatter={(value) => [`${value}`, 'Risk Score']} />
                <Line type="monotone" dataKey="riskScore" stroke="#F59E0B" strokeWidth={3} name="Risk Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span>Lower scores indicate reduced dropout risk</span>
            </div>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>10-point improvement since interventions began</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals and Targets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Progress Goals & Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">80%</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Attendance Target</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">By End of Semester</div>
            <div className="mt-3 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(student.attendance / 80) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">75%</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Academic Target</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Average Marks Goal</div>
            <div className="mt-3 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(student.averageMarks / 75) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Risk Score Target</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Low Risk Threshold</div>
            <div className="mt-3 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((100 - student.riskScore) / 50) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}