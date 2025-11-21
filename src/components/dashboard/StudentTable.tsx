import React from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Student } from '../../types/student';

interface StudentTableProps {
  students: Student[];
  onStudentClick: (studentId: string) => void;
}

export function StudentTable({ students, onStudentClick }: StudentTableProps) {
  const getRiskBadge = (level: Student['riskLevel']) => {
    const styles = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[level]}`}>
        <AlertCircle className="w-3 h-3 mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </span>
    );
  };

  const getFeeStatusIcon = (status: Student['feeStatus']) => {
    const icons = {
      paid: <CheckCircle className="w-4 h-4 text-green-600" />,
      pending: <Clock className="w-4 h-4 text-yellow-600" />,
      overdue: <XCircle className="w-4 h-4 text-red-600" />,
    };
    
    return icons[status];
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 80) return 'text-green-600 dark:text-green-400';
    if (attendance >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Overview</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Click on a student to view detailed information and AI-powered interventions</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Avg Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fee Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {students.map((student) => (
              <tr
                key={student.id}
                onClick={() => onStudentClick(student.id)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{student.studentId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{student.class}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{student.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
                    {student.attendance}%
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        student.attendance >= 80 ? 'bg-green-500' :
                        student.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${student.attendance}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {student.averageMarks}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getFeeStatusIcon(student.feeStatus)}
                    <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                      {student.feeStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRiskBadge(student.riskLevel)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {students.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">No students found</div>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}