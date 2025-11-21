import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Student } from '../../types/student';

interface ChartsSectionProps {
  students: Student[];
}

export function ChartsSection({ students }: ChartsSectionProps) {
  // Risk distribution data
  const riskData = [
    {
      name: 'Low Risk',
      value: students.filter(s => s.riskLevel === 'low').length,
      color: '#10B981',
    },
    {
      name: 'Medium Risk',
      value: students.filter(s => s.riskLevel === 'medium').length,
      color: '#F59E0B',
    },
    {
      name: 'High Risk',
      value: students.filter(s => s.riskLevel === 'high').length,
      color: '#EF4444',
    },
  ];

  // Department risk data
  const departments = Array.from(new Set(students.map(s => s.department)));
  const departmentData = departments.map(dept => ({
    name: dept,
    high: students.filter(s => s.department === dept && s.riskLevel === 'high').length,
    medium: students.filter(s => s.department === dept && s.riskLevel === 'medium').length,
    low: students.filter(s => s.department === dept && s.riskLevel === 'low').length,
  }));

  // Attendance trend (mock data)
  const attendanceTrend = [
    { month: 'Jan', attendance: 85 },
    { month: 'Feb', attendance: 82 },
    { month: 'Mar', attendance: 78 },
    { month: 'Apr', attendance: 75 },
    { month: 'May', attendance: 73 },
    { month: 'Jun', attendance: 76 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Risk Distribution Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Risk Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Risk Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="high" fill="#EF4444" name="High Risk" />
              <Bar dataKey="medium" fill="#F59E0B" name="Medium Risk" />
              <Bar dataKey="low" fill="#10B981" name="Low Risk" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}