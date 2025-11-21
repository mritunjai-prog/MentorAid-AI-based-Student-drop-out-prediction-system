import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Introduction from "./pages/Introduction";
// Temporarily using basic version to avoid ad blocker issues
// import Introduction from './pages/Introduction.basic';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentDetails from "./pages/StudentDetails";
import RiskPredictor from "./pages/RiskPredictor";
import { Toaster } from "./components/ui/Toaster";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading MentorAid...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/introduction" element={<Introduction />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/student/:id"
        element={user ? <StudentDetails /> : <Navigate to="/login" />}
      />
      <Route
        path="/risk-predictor"
        element={user ? <RiskPredictor /> : <Navigate to="/login" />}
      />
      <Route path="/" element={<Navigate to="/introduction" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <AppRoutes />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
