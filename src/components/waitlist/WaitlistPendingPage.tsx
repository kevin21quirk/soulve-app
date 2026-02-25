import { Clock, Mail, CheckCircle, Users, Heart, Crown, Sparkles, Target, TrendingUp, ExternalLink, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SouLVELogo from "@/components/SouLVELogo";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const WaitlistPendingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [applicationDate, setApplicationDate] = useState<string>("");
  const [checklistItems, setChecklistItems] = useState(() => {
    const saved = localStorage.getItem('soulve-founder-checklist');
    return saved ? JSON.parse(saved) : {
      profile: false,
      handbook: false,
      vision: false,
      community: false
    };
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear(); // Clear all cached data
      toast({
        title: "Signed out successfully",
        description: "You've been signed out. See you soon!",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('questionnaire_responses')
          .select('user_type, motivation, response_data, created_at')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setUserProfile(data);
          setApplicationDate(new Date(data.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
    
    // Mark profile as complete when this page loads
    if (!checklistItems.profile) {
      updateChecklist('profile', true);
    }
  }, [user]);

  const updateChecklist = (key: string, value: boolean) => {
    const newChecklist = { ...checklistItems, [key]: value };
    setChecklistItems(newChecklist);
    localStorage.setItem('soulve-founder-checklist', JSON.stringify(newChecklist));
  };

  const checklistProgress = Object.values(checklistItems).filter(Boolean).length;
  const totalItems = Object.keys(checklistItems).length;

  const getUserTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'individual': 'Community Member',
      'business': 'Business / CSR',
      'charity': 'Charity / Organisation',
      'community_leader': 'Community Leader'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo and Sign Out */}
        <div className="flex justify-between items-center">
          <div className="flex-1 flex justify-center">
            <SouLVELogo size="large" clickable={false} />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Hero Message */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Crown className="h-4 w-4" />
            <span>Welcome to the Founding SouLVERs!</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
            You're On The Path to Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Your application to join our founding community is being carefully reviewed. You're one step closer to making history.
          </p>
          {applicationDate && (
            <p className="text-sm text-gray-500">
              Applied on {applicationDate}
            </p>
          )}
        </div>

        {/* Personalization Card */}
        {userProfile && (
          <Card className="border-2 border-[#4c3dfb]/20 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Sparkles className="h-6 w-6 text-[#4c3dfb]" />
                <span>Why We're Excited About You</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-[#0ce4af]/20">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your Role</p>
                  <p className="text-lg font-semibold text-gray-800">{getUserTypeLabel(userProfile.user_type)}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-[#18a5fe]/20">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your Motivation</p>
                  <p className="text-lg font-semibold text-gray-800">{userProfile.motivation || 'Making a difference'}</p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-[#0ce4af]/10 to-[#18a5fe]/10 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>We're particularly excited</strong> to have someone with your perspective joining our founding community. 
                  Your unique insights will be invaluable in shaping how SouLVE serves {getUserTypeLabel(userProfile.user_type).toLowerCase()}s.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Journey Timeline */}
        <Card className="border-2 border-[#0ce4af]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Target className="h-6 w-6 text-[#0ce4af]" />
              <span>Your Founding SouLVER Journey</span>
            </CardTitle>
            <CardDescription>
              Track your progress to becoming a Founding SouLVER
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Application Progress</span>
                <span className="font-semibold">Step 2 of 4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] h-full rounded-full transition-all duration-500" style={{width: '50%'}}></div>
              </div>
            </div>
            
            <div className="space-y-6 mt-6">
              <div className="flex space-x-4 opacity-50">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Application Submitted ✓</h4>
                  <p className="text-sm text-gray-600">You've completed your profile and joined the queue</p>
                </div>
              </div>
              
              <div className="flex space-x-4 relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#18a5fe] to-transparent -z-10"></div>
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0ce4af] to-[#18a5fe] rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Under Review (Current)</h4>
                  <p className="text-sm text-gray-600">Our team is reviewing your application • Est. 1-3 business days</p>
                </div>
              </div>
              
              <div className="flex space-x-4 opacity-30">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-600 mb-1">Approval Notification</h4>
                  <p className="text-sm text-gray-500">You'll receive an email with your access credentials</p>
                </div>
              </div>
              
              <div className="flex space-x-4 opacity-30">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-600 mb-1">Welcome to SouLVE!</h4>
                  <p className="text-sm text-gray-500">Start exploring, testing, and shaping the platform</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get Ready Section */}
        <Card className="border-2 border-[#18a5fe]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-[#18a5fe]" />
                <span>Get Ready for Day One</span>
              </div>
              <span className="text-sm font-normal text-gray-500">{checklistProgress} of {totalItems}</span>
            </CardTitle>
            <CardDescription>
              Make the most of your wait time by preparing for your Founding SouLVER journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1 mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] h-full rounded-full transition-all duration-500" 
                  style={{width: `${(checklistProgress / totalItems) * 100}%`}}
                ></div>
              </div>
            </div>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklistItems.profile}
                readOnly
                className="mt-1 h-5 w-5 text-[#0ce4af] rounded focus:ring-[#0ce4af] cursor-not-allowed"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Complete Your Profile ✓</p>
                <p className="text-sm text-gray-600">You've already done this! Your application is submitted.</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklistItems.handbook}
                onChange={(e) => updateChecklist('handbook', e.target.checked)}
                className="mt-1 h-5 w-5 text-[#0ce4af] rounded focus:ring-[#0ce4af]"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Read the Founding SouLVER Handbook</p>
                <p className="text-sm text-gray-600">Learn about your role and responsibilities as a Founding SouLVER</p>
                <a href="#" className="text-xs text-[#18a5fe] hover:underline inline-flex items-center gap-1 mt-1">
                  Open Handbook <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklistItems.vision}
                onChange={(e) => updateChecklist('vision', e.target.checked)}
                className="mt-1 h-5 w-5 text-[#0ce4af] rounded focus:ring-[#0ce4af]"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Watch the Vision Video</p>
                <p className="text-sm text-gray-600">See our 5-minute walkthrough of what we're building together</p>
                <a href="#" className="text-xs text-[#18a5fe] hover:underline inline-flex items-center gap-1 mt-1">
                  Watch Video <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklistItems.community}
                onChange={(e) => updateChecklist('community', e.target.checked)}
                className="mt-1 h-5 w-5 text-[#0ce4af] rounded focus:ring-[#0ce4af]"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Join Our Community</p>
                <p className="text-sm text-gray-600">Connect with other founders in our private Discord</p>
                <a href="#" className="text-xs text-[#18a5fe] hover:underline inline-flex items-center gap-1 mt-1">
                  Join Discord <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Stay Connected */}
        <Card className="bg-gradient-to-br from-[#0ce4af]/5 via-[#18a5fe]/5 to-[#4c3dfb]/5 border-2 border-[#4c3dfb]/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <div className="p-2 bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] rounded-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <span>Stay Connected</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Questions about your application? Want to learn more while you wait?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm">
                <Mail className="h-5 w-5 text-[#0ce4af]" />
                <a 
                  href="mailto:founders@join-soulve.com" 
                  className="text-[#18a5fe] hover:text-[#4c3dfb] font-semibold transition-colors text-sm"
                >
                  founders@join-soulve.com
                </a>
              </div>
              <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm">
                <Users className="h-5 w-5 text-[#18a5fe]" />
                <a 
                  href="#" 
                  className="text-[#18a5fe] hover:text-[#4c3dfb] font-semibold transition-colors text-sm"
                >
                  Join Discord Community
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-sm text-gray-500">
            Thank you for joining the Founding SouLVERs! 
          </p>
          <p className="text-xs text-gray-400">
            You're not just a user—you're a co-creator of something that will change lives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPendingPage;
