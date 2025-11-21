export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  class: string;
  department: string;
  attendance: number;
  averageMarks: number;
  feeStatus: 'paid' | 'pending' | 'overdue';
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  lastActivity: string;
}