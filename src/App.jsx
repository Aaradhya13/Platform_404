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
import Cleaning from "./components/cleaning/Cleaning"
import Inspection from "./components/inspection/Inspection";
import Maintenance from "./components/mainnatence/Mainnantence";
import Operations from "./components/operations/Operations";

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

const Dashboard = () => <h1 className="text-2xl p-4">Welcome to Dashboard 🎉</h1>;

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
                <Cleaning />
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
                <AppLayout>
                <Dashboard />
                <div className="fixed bottom-4 right-4 flex gap-2">
                  <ThemeToggleButton />
                  <SlidingThemeToggle />
                </div>
                </AppLayout>
              </TranslationProvider>
            </ProtectedRoute>
          }
        />
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
           </Routes>
    </Router>
  );
}

export default App;
