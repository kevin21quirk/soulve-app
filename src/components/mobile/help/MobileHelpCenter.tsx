
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Search,
  MessageSquare,
  FileText,
  Video,
  Phone,
  Mail,
  ChevronRight
} from "lucide-react";

interface MobileHelpCenterProps {
  onBack: () => void;
}

const MobileHelpCenter = ({ onBack }: MobileHelpCenterProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const helpSections = [
    {
      title: "Quick Help",
      items: [
        {
          icon: MessageSquare,
          label: "Live Chat",
          description: "Chat with our support team",
          action: () => {}
        },
        {
          icon: Phone,
          label: "Phone Support",
          description: "Call us directly for urgent issues",
          action: () => {}
        },
        {
          icon: Mail,
          label: "Email Support",
          description: "Send us a detailed message",
          action: () => {}
        }
      ]
    },
    {
      title: "Help Articles",
      items: [
        {
          icon: FileText,
          label: "Getting Started",
          description: "Learn the basics of SouLVE",
          action: () => {}
        },
        {
          icon: FileText,
          label: "Trust Score Guide",
          description: "Understanding your trust score",
          action: () => {}
        },
        {
          icon: FileText,
          label: "Points & Rewards",
          description: "How to earn and redeem points",
          action: () => {}
        },
        {
          icon: FileText,
          label: "Safety Guidelines",
          description: "Staying safe on the platform",
          action: () => {}
        }
      ]
    },
    {
      title: "Video Tutorials",
      items: [
        {
          icon: Video,
          label: "Platform Overview",
          description: "5 min intro to SouLVE",
          action: () => {}
        },
        {
          icon: Video,
          label: "Creating Campaigns",
          description: "Step-by-step campaign creation",
          action: () => {}
        },
        {
          icon: Video,
          label: "Connecting with Others",
          description: "Building your network",
          action: () => {}
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Help Center</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Help Content */}
      <div className="p-4 space-y-6">
        {helpSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 hover:bg-gray-50"
                    onClick={item.action}
                  >
                    <item.icon className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MobileHelpCenter;
