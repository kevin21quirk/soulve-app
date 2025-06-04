
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Heart, 
  Users, 
  MessageCircle, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      icon: Heart,
      title: "Be Kind and Respectful",
      description: "Treat all community members with respect and kindness. Personal attacks, harassment, or bullying will not be tolerated.",
      examples: {
        allowed: ["Constructive feedback", "Polite disagreements", "Encouraging others"],
        notAllowed: ["Personal insults", "Harassment", "Hate speech"]
      }
    },
    {
      icon: Users,
      title: "Help Others Genuinely",
      description: "Our platform is built on mutual aid. Offer help sincerely and follow through on commitments.",
      examples: {
        allowed: ["Offering specific help", "Following through on commitments", "Being honest about availability"],
        notAllowed: ["False promises", "Taking advantage of others", "Spam offers"]
      }
    },
    {
      icon: MessageCircle,
      title: "Keep Content Relevant",
      description: "Share content that's relevant to community support and mutual aid. Avoid spam or promotional content.",
      examples: {
        allowed: ["Help requests", "Success stories", "Community events"],
        notAllowed: ["Commercial advertisements", "Unrelated content", "Spam"]
      }
    },
    {
      icon: Shield,
      title: "Protect Privacy and Safety",
      description: "Respect others' privacy and don't share personal information without consent. Report safety concerns immediately.",
      examples: {
        allowed: ["Reporting safety issues", "Respecting anonymity requests", "Meeting in public places"],
        notAllowed: ["Sharing personal info without consent", "Stalking or doxxing", "Unsafe meeting arrangements"]
      }
    }
  ];

  const consequences = [
    {
      level: "Warning",
      description: "First-time minor violations result in a warning and guidance",
      color: "text-yellow-600"
    },
    {
      level: "Content Removal",
      description: "Violating content is removed and user is notified",
      color: "text-orange-600"
    },
    {
      level: "Temporary Suspension",
      description: "Repeated violations may result in temporary account suspension",
      color: "text-red-600"
    },
    {
      level: "Permanent Ban",
      description: "Severe or repeated violations may result in permanent account termination",
      color: "text-red-800"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our community thrives on mutual respect, genuine help, and shared support. 
          These guidelines help us maintain a safe and welcoming environment for everyone.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guidelines.map((guideline, index) => {
          const IconComponent = guideline.icon;
          return (
            <Card key={index} className="border-l-4 border-l-teal-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-teal-600" />
                  {guideline.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{guideline.description}</p>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-green-700 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Encouraged
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {guideline.examples.allowed.map((example, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-green-600 mt-0.5">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-red-700 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Not Allowed
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {guideline.examples.notAllowed.map((example, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-red-600 mt-0.5">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Enforcement and Consequences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            We believe in fair and transparent enforcement. Here's how we handle guideline violations:
          </p>
          
          <div className="space-y-3">
            {consequences.map((consequence, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`font-semibold ${consequence.color}`}>
                  {index + 1}.
                </div>
                <div>
                  <h4 className={`font-semibold ${consequence.color}`}>
                    {consequence.level}
                  </h4>
                  <p className="text-gray-600 text-sm">{consequence.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Appeal Process</h4>
            <p className="text-blue-700 text-sm">
              If you believe a moderation decision was made in error, you can submit an appeal. 
              All appeals are reviewed by human moderators within 48 hours. You'll receive a response 
              explaining the final decision.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityGuidelines;
