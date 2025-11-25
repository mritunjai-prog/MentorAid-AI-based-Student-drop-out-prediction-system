import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  LogOut,
  Bell,
  Settings,
  Calculator,
} from "lucide-react";
import { AnimatedThemeToggle } from "../components/ui/AnimatedThemeToggle";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { StudentTable } from "../components/dashboard/StudentTable";
import { ChartsSection } from "../components/dashboard/ChartsSection";
import { FileUpload } from "../components/dashboard/FileUpload";
import { Student } from "../types/student";
import { studentAPI } from "../utils/api";
import { toast } from "../components/ui/Toaster";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    riskLevel: "all",
    class: "all",
    department: "all",
  });
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load students from API
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await studentAPI.getAll();
        const studentsData = (response.students || []).map((s: any) => ({
          id: s._id,
          name: s.name || "Unknown",
          studentId: s.student_id || "N/A",
          email: s.email || "N/A",
          attendance: s.attendance || 0,
          averageMarks: s.averageMarks || 0,
          feeStatus: s.feeStatus || "paid",
          riskLevel: (s.risk_level || "low").toLowerCase() as
            | "low"
            | "medium"
            | "high",
          department: s.department || "General",
          class: s.class || "N/A",
          riskScore: s.confidence ? Math.round(s.confidence * 100) : 0,
        }));
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast.error("Failed to load students");
        // Fallback to empty array
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.riskLevel !== "all") {
      filtered = filtered.filter(
        (student) => student.riskLevel === filters.riskLevel
      );
    }
    if (filters.class !== "all") {
      filtered = filtered.filter((student) => student.class === filters.class);
    }
    if (filters.department !== "all") {
      filtered = filtered.filter(
        (student) => student.department === filters.department
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filters]);

  const handleStudentClick = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  const handleFileUpload = (predictions: any[], summary: any) => {
    // Convert predictions to Student format with real MongoDB IDs
    const newStudents: Student[] = predictions.map((pred) => ({
      id: pred._id || pred.student_id, // Use MongoDB _id
      name: pred.name || pred.student_id || "Unknown Student",
      studentId: pred.student_id || "N/A",
      email: pred.email || "N/A",
      attendance: 0, // Will be updated with real data later
      averageMarks: 0,
      feeStatus: "paid" as const,
      riskLevel: pred.risk_level.toLowerCase() as "low" | "medium" | "high",
      department: "General",
      class: `Year ${Math.floor(Math.random() * 4) + 1}`,
      prediction: pred.prediction,
      confidence: pred.confidence,
      probabilities: pred.probabilities,
    }));

    setStudents(newStudents);
    setFilteredStudents(newStudents);
    setShowUpload(false);

    toast.success(
      `Successfully processed ${summary.total} students! ` +
        `${summary.dropout} at high risk, ${summary.graduate} likely to graduate.`
    );
  };

  const exportData = () => {
    const csv = [
      [
        "Name",
        "Student ID",
        "Attendance",
        "Average Marks",
        "Fee Status",
        "Risk Level",
      ].join(","),
      ...filteredStudents.map((student) =>
        [
          student.name,
          student.studentId,
          `${student.attendance}%`,
          student.averageMarks,
          student.feeStatus,
          student.riskLevel,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Data exported successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const stats = {
    totalStudents: students.length,
    atRiskStudents: students.filter((s) => s.riskLevel !== "low").length,
    averageAttendance: Math.round(
      students.reduce((acc, s) => acc + s.attendance, 0) / students.length
    ),
    pendingFees: students.filter(
      (s) => s.feeStatus === "pending" || s.feeStatus === "overdue"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-base md:text-lg font-bold text-white">M</span>
              </div>
              <div className="ml-2 md:ml-4">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  MentorAid
                </h1>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Student Support Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden md:block">
                <Bell className="w-5 h-5" />
              </button>

              <AnimatedThemeToggle />

              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats Overview */}
        <DashboardStats stats={stats} />

        {/* Controls */}
        <div className="mb-6 md:mb-8 bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Filters - Mobile: Stacked, Desktop: Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filters.riskLevel}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, riskLevel: e.target.value }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>

              <select
                value={filters.class}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, class: e.target.value }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="all">All Classes</option>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
                <option value="11A">11A</option>
                <option value="11B">11B</option>
                <option value="12A">12A</option>
                <option value="12B">12B</option>
              </select>
            </div>

            {/* Action Buttons - Mobile: Full Width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => navigate("/risk-predictor")}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Risk Predictor
              </button>

              <button
                onClick={exportData}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>

              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:col-span-2 lg:col-span-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Data
              </button>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <ChartsSection students={filteredStudents} />

        {/* Students Table */}
        <StudentTable
          students={filteredStudents}
          onStudentClick={handleStudentClick}
        />
      </main>

      {/* File Upload Modal */}
      {showUpload && (
        <FileUpload
          onClose={() => setShowUpload(false)}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
}
