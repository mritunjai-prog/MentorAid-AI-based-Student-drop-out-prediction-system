import React, { useState } from 'react';
import { Brain, BookOpen, Mail, FileText, Lightbulb, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { Student } from '../../types/student';
import { toast } from '../ui/Toaster';

interface AIInsightsProps {
  student: Student;
}

export function AIInsights({ student }: AIInsightsProps) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [results, setResults] = useState<{ [key: string]: string }>({});
  const [emailDraft, setEmailDraft] = useState('');
  const [syllabusText, setSyllabusText] = useState('');

  const simulateAICall = async (feature: string, delay = 2000) => {
    setLoading(prev => ({ ...prev, [feature]: true }));
    await new Promise(resolve => setTimeout(resolve, delay));
    setLoading(prev => ({ ...prev, [feature]: false }));
  };

  const generateRiskStory = async () => {
    await simulateAICall('riskStory');
    const story = `Based on ${student.name}'s data patterns, several concerning trends have emerged. Their attendance has declined from 85% in January to ${student.attendance}% currently, showing a consistent downward trajectory that correlates with decreased academic performance.

The student's average marks of ${student.averageMarks}% indicate struggles particularly in STEM subjects, where complex concepts may be building upon missed foundational knowledge due to irregular attendance. This creates a compounding effect where absence leads to knowledge gaps, which in turn leads to lower confidence and further disengagement.

${student.feeStatus === 'overdue' ? 'Additionally, overdue fees may indicate financial stress at home, which often correlates with increased responsibility outside school hours, potentially explaining some attendance issues.' : ''}

The risk score of ${student.riskScore} suggests immediate intervention is needed. However, early action focusing on re-engagement through personalized support and addressing root causes could effectively reverse this trend.`;
    
    setResults(prev => ({ ...prev, riskStory: story }));
    toast.success('Risk story generated successfully!');
  };

  const generateResources = async () => {
    await simulateAICall('resources');
    const resources = `Based on ${student.name}'s specific challenges, here are three targeted recommendations:

**1. Khan Academy Personalized Learning Path**
- Focus on Mathematics fundamentals with adaptive exercises
- Self-paced learning modules that accommodate irregular attendance
- Visual learning approach for better concept retention
- Estimated time: 30 minutes daily

**2. Study Buddy Program**
- Pair with high-performing peer mentor from same class
- Weekly check-ins and shared study sessions
- Accountability partner for attendance improvement
- Social support to increase school engagement

**3. "Catch-Up" Weekend Sessions**
- Small group tutoring for missed concepts
- Interactive problem-solving workshops
- Focus on ${student.department} subject areas
- Bridge knowledge gaps systematically`;
    
    setResults(prev => ({ ...prev, resources }));
    toast.success('Curated resources generated!');
  };

  const generateEmailDraft = async () => {
    await simulateAICall('emailDraft');
    const draft = `Subject: Partnership Opportunity - Supporting ${student.name}'s Academic Journey

Dear Mr./Mrs. ${student.name.split(' ').pop()},

I hope this message finds you well. I'm writing to discuss ${student.name}'s recent academic progress and explore how we can work together to ensure their continued success.

${student.name} is a valued member of our ${student.class} class, and I've noticed some areas where additional support could make a significant positive impact. Their current attendance of ${student.attendance}% and academic performance indicate they would benefit from some focused attention and encouragement.

Rather than viewing this as a problem, I see this as an opportunity for us to collaborate and help ${student.name} reach their full potential. Many students face similar challenges, and with the right support system, they often exceed expectations.

I would love to schedule a brief conversation to discuss:
- Strategies we can implement both at school and at home
- Resources available to support ${student.name}'s learning
- Ways to maintain consistent communication about their progress

Please let me know your availability for a 15-minute call this week. Together, we can ensure ${student.name} has every opportunity to succeed.

Warm regards,
[Your Name]
[Your Title]
[Contact Information]

**Tone Analysis: Supportive, Solution-focused, Collaborative**`;
    
    setResults(prev => ({ ...prev, emailDraft: draft }));
    setEmailDraft(draft);
    toast.success('Email draft generated with positive tone!');
  };

  const generateInterventionPlan = async () => {
    await simulateAICall('interventionPlan');
    const plan = `## Comprehensive Intervention Plan for ${student.name}

### Risk Summary
Current risk level: **${student.riskLevel.toUpperCase()}** (Score: ${student.riskScore})
Primary concerns: Attendance decline, academic performance gap, ${student.feeStatus === 'overdue' ? 'financial barriers' : 'engagement issues'}

### Immediate Actions (Week 1-2)
1. **Personal Check-in Meeting**
   - One-on-one conversation with student
   - Identify barriers and challenges
   - Set realistic short-term goals

2. **Parent/Guardian Contact**
   - Share positive aspects of student's potential
   - Discuss collaboration strategies
   - Address any external factors

### Short-term Interventions (Month 1-2)
1. **Academic Support**
   - Enroll in peer tutoring program
   - Provide simplified study materials
   - Weekly progress check-ins

2. **Attendance Improvement**
   - Daily check-in system
   - Identify and address attendance barriers
   - Reward consistent attendance

3. **Engagement Activities**
   - Connect to student interests
   - Extra-curricular participation
   - Leadership opportunities

### Long-term Strategy (3-6 months)
1. **Skill Building**
   - Study skills workshops
   - Time management training
   - Self-advocacy development

2. **Family Engagement**
   - Regular communication schedule
   - Home study environment assessment
   - Resource connection (if needed)

### Success Metrics
- Attendance target: 80%+ within 6 weeks
- Academic improvement: 10-point increase in average marks
- Engagement: Active participation in class discussions
- Self-efficacy: Student reports increased confidence

### Follow-up Schedule
- Weekly: Academic mentor check-in
- Bi-weekly: Attendance review
- Monthly: Family communication
- Quarterly: Comprehensive progress review`;
    
    setResults(prev => ({ ...prev, interventionPlan: plan }));
    toast.success('Comprehensive intervention plan generated!');
  };

  const simplifySyllabus = async () => {
    if (!syllabusText.trim()) {
      toast.error('Please enter some syllabus text to simplify.');
      return;
    }
    
    await simulateAICall('syllabus');
    const simplified = `## Simplified Version for ${student.name}

**Original concept made easy:**

The text you provided has been transformed into student-friendly language:

• **Big Ideas**: Breaking down complex concepts into bite-sized pieces
• **Real-world examples**: Connecting abstract ideas to everyday life
• **Step-by-step approach**: Clear sequence of learning
• **Visual aids suggested**: Diagrams and charts to support understanding

**Key takeaways:**
1. Start with the basics and build up gradually
2. Use familiar examples to explain new concepts  
3. Practice with simple exercises first
4. Ask questions when something isn't clear

**Study tip**: Read this simplified version first, then try the original text. It will make much more sense!`;
    
    setResults(prev => ({ ...prev, syllabus: simplified }));
    toast.success('Syllabus simplified for student understanding!');
  };

  return (
    <div className="space-y-8">
      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Story */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Brain className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Story</h3>
            </div>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            AI-generated narrative explaining the student's risk factors and patterns.
          </p>
          <button
            onClick={generateRiskStory}
            disabled={loading.riskStory}
            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading.riskStory ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            Generate Risk Story
          </button>
          {results.riskStory && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {results.riskStory}
              </div>
            </div>
          )}
        </div>

        {/* Curated Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Curated Resources</h3>
            </div>
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Personalized study resources and recommendations based on student needs.
          </p>
          <button
            onClick={generateResources}
            disabled={loading.resources}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading.resources ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Lightbulb className="w-4 h-4 mr-2" />
            )}
            Generate Resources
          </button>
          {results.resources && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {results.resources}
              </div>
            </div>
          )}
        </div>

        {/* Draft Email */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Draft Email</h3>
            </div>
            <Sparkles className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Empathetic email draft to parent/guardian with tone analysis.
          </p>
          <button
            onClick={generateEmailDraft}
            disabled={loading.emailDraft}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading.emailDraft ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            Generate Email Draft
          </button>
          {results.emailDraft && (
            <div className="mt-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <textarea
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  className="w-full h-64 text-sm text-gray-700 dark:text-gray-300 bg-transparent resize-none focus:outline-none"
                  placeholder="Email draft will appear here..."
                />
              </div>
              <button className="mt-3 flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </button>
            </div>
          )}
        </div>

        {/* Intervention Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Intervention Plan</h3>
            </div>
            <Sparkles className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Structured intervention plan with risk summary and follow-up strategy.
          </p>
          <button
            onClick={generateInterventionPlan}
            disabled={loading.interventionPlan}
            className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading.interventionPlan ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2" />
            )}
            Generate Intervention Plan
          </button>
          {results.interventionPlan && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg max-h-96 overflow-y-auto">
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {results.interventionPlan}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Syllabus Simplifier */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Syllabus Simplifier</h3>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Paste difficult syllabus text and get a student-friendly summary.
        </p>
        
        <div className="space-y-4">
          <textarea
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
            placeholder="Paste difficult syllabus or course content here..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          />
          
          <button
            onClick={simplifySyllabus}
            disabled={loading.syllabus}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading.syllabus ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Simplify for Student
          </button>
          
          {results.syllabus && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {results.syllabus}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}