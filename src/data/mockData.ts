import { Student } from '../types/student';

const names = [
  'Emma Thompson', 'Liam Johnson', 'Olivia Davis', 'Noah Wilson', 'Ava Garcia',
  'William Martinez', 'Sophia Rodriguez', 'James Anderson', 'Isabella Lopez', 'Benjamin Lee',
  'Mia Gonzalez', 'Lucas Perez', 'Charlotte Turner', 'Henry White', 'Amelia Hall',
  'Alexander Young', 'Harper King', 'Michael Scott', 'Evelyn Adams', 'Daniel Baker',
  'Abigail Nelson', 'Matthew Carter', 'Emily Mitchell', 'Joseph Roberts', 'Elizabeth Phillips',
  'David Evans', 'Sofia Collins', 'Samuel Stewart', 'Avery Morris', 'Christopher Rogers',
  'Ella Reed', 'Andrew Cook', 'Grace Bell', 'Joshua Bailey', 'Chloe Cooper', 'Ryan Howard',
  'Victoria Ward', 'Nathan Torres', 'Lily Peterson', 'Caleb Gray', 'Zoe Ramirez',
  'Gabriel James', 'Penelope Watson', 'Christian Brooks', 'Layla Kelly', 'Hunter Sanders',
  'Nora Price', 'Isaiah Bennett', 'Riley Wood', 'Thomas Barnes', 'Leah Ross',
];

const departments = ['Science', 'Arts', 'Commerce', 'Technology'];
const classes = ['10A', '10B', '11A', '11B', '12A', '12B'];

export function generateMockStudents(count: number): Student[] {
  const students: Student[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length] || `Student ${i + 1}`;
    const attendance = Math.floor(Math.random() * 40) + 60; // 60-100%
    const averageMarks = Math.floor(Math.random() * 40) + 50; // 50-90%
    const feeStatuses: Student['feeStatus'][] = ['paid', 'pending', 'overdue'];
    const feeStatus = feeStatuses[Math.floor(Math.random() * feeStatuses.length)];
    
    // Calculate risk score based on factors
    let riskScore = 0;
    riskScore += (100 - attendance) * 0.6; // Attendance factor (60% weight)
    riskScore += (100 - averageMarks) * 0.4; // Academic factor (40% weight)
    riskScore += feeStatus === 'overdue' ? 15 : feeStatus === 'pending' ? 5 : 0; // Fee factor
    
    // Add some randomness
    riskScore += Math.random() * 10 - 5;
    riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));
    
    // Determine risk level
    let riskLevel: Student['riskLevel'] = 'low';
    if (riskScore >= 70) riskLevel = 'high';
    else if (riskScore >= 50) riskLevel = 'medium';
    
    const student: Student = {
      id: (i + 1).toString(),
      name,
      email: name.toLowerCase().replace(' ', '.') + '@school.edu',
      studentId: `STU${(i + 1).toString().padStart(4, '0')}`,
      class: classes[Math.floor(Math.random() * classes.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      attendance,
      averageMarks,
      feeStatus,
      riskLevel,
      riskScore,
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    students.push(student);
  }
  
  return students.sort((a, b) => b.riskScore - a.riskScore); // Sort by risk score descending
}