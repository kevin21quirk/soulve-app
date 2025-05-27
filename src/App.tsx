
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { queryClient } from "@/services/api";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProfileRegistration from "./pages/ProfileRegistration";
import NotFound from "./pages/NotFound";
import StandardUserQuestionnaire from "./components/questionnaires/StandardUserQuestionnaire";
import CharityQuestionnaire from "./components/questionnaires/CharityQuestionnaire";
import CommunityGroupQuestionnaire from "./components/questionnaires/CommunityGroupQuestionnaire";
import ReligiousGroupQuestionnaire from "./components/questionnaires/ReligiousGroupQuestionnaire";
import BusinessQuestionnaire from "./components/questionnaires/BusinessQuestionnaire";
import SocialGroupQuestionnaire from "./components/questionnaires/SocialGroupQuestionnaire";
import AmbassadorQuestionnaire from "./components/questionnaires/AmbassadorQuestionnaire";
import PartnershipsQuestionnaire from "./components/questionnaires/PartnershipsQuestionnaire";
import ExpertiseQuestionnaire from "./components/questionnaires/ExpertiseQuestionnaire";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<ProfileRegistration />} />
            <Route path="/questionnaire/standard-user" element={<StandardUserQuestionnaire />} />
            <Route path="/questionnaire/charity" element={<CharityQuestionnaire />} />
            <Route path="/questionnaire/community-group" element={<CommunityGroupQuestionnaire />} />
            <Route path="/questionnaire/religious-group" element={<ReligiousGroupQuestionnaire />} />
            <Route path="/questionnaire/business" element={<BusinessQuestionnaire />} />
            <Route path="/questionnaire/social-group" element={<SocialGroupQuestionnaire />} />
            <Route path="/questionnaire/ambassador" element={<AmbassadorQuestionnaire />} />
            <Route path="/questionnaire/partnerships" element={<PartnershipsQuestionnaire />} />
            <Route path="/questionnaire/expertise" element={<ExpertiseQuestionnaire />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorProvider>
  </QueryClientProvider>
);

export default App;
