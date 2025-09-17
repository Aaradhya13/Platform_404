import OperationsDashboard from "./Operationdashboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SlidingThemeToggle, ThemeToggleButton } from "./components/ThemeButton";
import { useTheme } from "./context/ThemeProvider";
import AppLayout, { TranslationProvider } from "./context/AppLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./context/ProtectedRoute";
import BrandingBar from './components/BrandingBar';
import HeroSection from './components/HeroSection';
import VideoSection from './components/VideoSection';
import TravelGuide from './components/TravelGuide';
import MetroAttractions from './components/MetroAttractions';
import Footer from './components/Footer';
import Map from "./pages/Map";
import CleaningDashboard from "./components/cleaning/CleaningDashboard"
import Inspection from "./components/inspection/Inspection";
import Maintenance from "./components/mainnatence/Mainnantence";
import Operations from "./components/operations/Operations";
import {Dashboard} from "./pages/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import InspectionDashboard from "./components/Inspectiondashboard";
import MaintenanceDashboard from "./components/mainnatence/Mainanetence";
import JobCard from "./components/inspection/JobCard"
import InspectionLanes from "./components/inspection/InspectionLanes"
import InspectionSchedules from "./components/inspection/InspectionSchedules"
const LandingPage = () => {
  return (
    <div>
      <BrandingBar />
      <HeroSection />
      <VideoSection />
      <TravelGuide />
      <MetroAttractions />
      <Footer />
    </div>
  );
};



function App() {
  const { theme } = useTheme();
  console.log("Current theme:", theme);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="/cleaning" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <CleaningDashboard />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />


        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TranslationProvider>
                <Dashboard />
              </TranslationProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/usesr-management" element={
          <ProtectedRoute>
            <TranslationProvider>
                <AdminDashboard />
            </TranslationProvider>
          </ProtectedRoute>
        } />
      <Route path="/inspection" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <Inspection />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        <Route path="/maintenance" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <Maintenance />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        <Route path="/operations" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <Operations />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        <Route path="/operationdashboard" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <OperationsDashboard />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        <Route path="/inspectiondashboard" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <InspectionDashboard />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        <Route path="/maintenance/dashboard" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <MaintenanceDashboard />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        <Route path="/inspection/jobcard" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <JobCard />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        <Route path="/inspection/lanes" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <InspectionLanes />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        <Route path="/inspection/schedules" element={
          <ProtectedRoute>
            <TranslationProvider>
              <AppLayout>
                <InspectionSchedules />
              </AppLayout>
            </TranslationProvider>
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
           </Routes>

    </Router>
  );
}

export default App;
