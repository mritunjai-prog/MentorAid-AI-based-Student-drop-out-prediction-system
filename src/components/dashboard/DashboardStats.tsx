import React from 'react';
import { Users, AlertTriangle, Calendar } from 'lucide-react';

// Custom Rupee Icon Component
const RupeeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.66 7H16v2h-2.34c-.59 1.69-2.07 3-3.66 3s-3.07-1.31-3.66-3H4V7h2.34C6.93 5.31 8.41 4 10 4s3.07 1.31 3.66 3zM10 10c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-4h2v2h-2V8zm0 4h2v2h-2v-2z"/>
    <path d="M7 13l5 5-1.41 1.41L7 15.83l-3.59 3.58L2 18l5-5z"/>
  </svg>
);

interface DashboardStatsProps {
  stats: {
    totalStudents: number;
    atRiskStudents: number;
    averageAttendance: number;
    pendingFees: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+5.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'At Risk Students',
      value: stats.atRiskStudents.toString(),
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      change: '-2.1%',
      changeType: 'positive' as const,
    },
    {
      title: 'Average Attendance',
      value: `${stats.averageAttendance}%`,
      icon: Calendar,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      change: '+3.8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Fees',
      value: stats.pendingFees.toString(),
      icon: RupeeIcon,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      change: '-1.5%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">from last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}