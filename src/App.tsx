
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ProfileRegistration from '@/pages/ProfileRegistration';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import CampaignBuilder from '@/pages/CampaignBuilder';
import CampaignAnalyticsPage from '@/pages/CampaignAnalyticsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile-registration" element={<ProfileRegistration />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/campaign-builder" element={
        <ProtectedRoute>
          <CampaignBuilder />
        </ProtectedRoute>
      } />
      <Route path="/campaign-analytics/:campaignId" element={
        <ProtectedRoute>
          <CampaignAnalyticsPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
