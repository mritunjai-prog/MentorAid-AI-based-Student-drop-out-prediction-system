import React, { useState } from 'react';
import { Plus, Calendar, User, MessageSquare, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Student } from '../../types/student';
import { toast } from '../ui/Toaster';

interface InterventionHistoryProps {
  student: Student;
}

interface Intervention {
  id: string;
  date: string;
  type: 'meeting' | 'call' | 'email' | 'resource' | 'plan';
  title: string;
  description: string;
  outcome: 'completed' | 'pending' | 'scheduled';
  mentor: string;
}

export function InterventionHistory({ student }: InterventionHistoryProps) {
  const [showForm, setShowForm] = useState(false);
  const [newIntervention, setNewIntervention] = useState({
    type: 'meeting',
    title: '',
    description: '',
    outcome: 'scheduled'
  });

  // Mock intervention data
  const [interventions, setInterventions] = useState<Intervention[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'meeting',
      title: 'Parent-Teacher Conference',
      description: 'Discussed attendance concerns and academic progress. Parent committed to morning routine improvements.',
      outcome: 'completed',
      mentor: 'Ms. Johnson'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'resource',
      title: 'Math Tutoring Program Enrollment',
      description: 'Enrolled student in peer tutoring program for mathematics. Sessions scheduled for Tuesdays and Thursdays.',
      outcome: 'completed',
      mentor: 'Mr. Davis'
    },
    {
      id: '3',
      date: '2024-01-08',
      type: 'plan',
      title: 'Attendance Improvement Plan',
      description: 'Created structured plan with daily check-ins and weekly goals. Target: 80% attendance within 6 weeks.',
      outcome: 'pending',
      mentor: 'Ms. Johnson'
    },
    {
      id: '4',
      date: '2024-01-22',
      type: 'call',
      title: 'Weekly Progress Check',
      description: 'Scheduled weekly call to discuss progress on attendance goals and academic improvements.',
      outcome: 'scheduled',
      mentor: 'Ms. Johnson'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIntervention.title.trim() || !newIntervention.description.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const intervention: Intervention = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newIntervention.type as Intervention['type'],
      title: newIntervention.title,
      description: newIntervention.description,
      outcome: newIntervention.outcome as Intervention['outcome'],
      mentor: 'Current User' // In real app, would come from auth context
    };

    setInterventions(prev => [intervention, ...prev]);
    setNewIntervention({
      type: 'meeting',
      title: '',
      description: '',
      outcome: 'scheduled'
    });
    setShowForm(false);
    toast.success('Intervention logged successfully!');
  };

  const getTypeIcon = (type: Intervention['type']) => {
    switch (type) {
      case 'meeting':
        return <User className="w-4 h-4" />;
      case 'call':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <MessageSquare className="w-4 h-4" />;
      case 'resource':
        return <CheckCircle className="w-4 h-4" />;
      case 'plan':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Intervention['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'call':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'email':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'resource':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'plan':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getOutcomeIcon = (outcome: Intervention['outcome']) => {
    switch (outcome) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Intervention History</h2>
          <p className="text-gray-600 dark:text-gray-400">Track all mentoring activities and support interventions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Intervention
        </button>
      </div>

      {/* Add Intervention Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Log New Intervention</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Intervention Type
                </label>
                <select
                  value={newIntervention.type}
                  onChange={(e) => setNewIntervention(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="meeting">In-Person Meeting</option>
                  <option value="call">Phone Call</option>
                  <option value="email">Email Communication</option>
                  <option value="resource">Resource Provided</option>
                  <option value="plan">Action Plan Created</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={newIntervention.outcome}
                  onChange={(e) => setNewIntervention(prev => ({ ...prev, outcome: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newIntervention.title}
                onChange={(e) => setNewIntervention(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief title for the intervention"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={newIntervention.description}
                onChange={(e) => setNewIntervention(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the intervention, outcomes, and next steps"
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log Intervention
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interventions List */}
      <div className="space-y-4">
        {interventions.map((intervention) => (
          <div key={intervention.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${getTypeColor(intervention.type)}`}>
                    {getTypeIcon(intervention.type)}
                    <span className="ml-1 capitalize">{intervention.type}</span>
                  </span>
                  {getOutcomeIcon(intervention.outcome)}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">{intervention.outcome}</span>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{intervention.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{intervention.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-4">{formatDate(intervention.date)}</span>
                  <User className="w-4 h-4 mr-1" />
                  <span>{intervention.mentor}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {interventions.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No interventions logged yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start tracking your mentoring activities and support interventions.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log First Intervention
          </button>
        </div>
      )}
    </div>
  );
}