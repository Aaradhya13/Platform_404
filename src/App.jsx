// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SlidingThemeToggle, ThemeToggleButton } from "./components/ThemeButton";
import { useTheme } from "./context/ThemeProvider";
import AppLayout from "./context/AppLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./context/ProtectedRoute";

const Dashboard = () => <h1 className="text-2xl p-4">Welcome to Dashboard 🎉</h1>;
const LandingPage = () => <h1 className="text-2xl p-4">Welcome to Landing Page 🎉</h1>;

function App() {
  const { theme } = useTheme();
  console.log("Current theme:", theme);

  return (
    <Router>
      <Routes>
        <Route
        path="/"
        element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        }
      />
        {/* Public login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
                <div className="fixed bottom-4 right-4 flex gap-2">
                  <ThemeToggleButton />
                  <SlidingThemeToggle />
                </div>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
