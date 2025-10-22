import { Heart, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ImpactStoriesSection = () => {
  const navigate = useNavigate();
  
  const stories = [
    {
      problem: "78-year-old widow, 3 days without human contact, considering residential care",
      solution: "Matched with local volunteers for weekly visits and digital companionship",
      impact: "Depression reduced by 60%, remained independent at home, volunteer found purpose after retirement",
      icon: Heart,
      gradient: "from-rose-500 to-pink-500"
    },
    {
      problem: "Young professional battling anxiety, NHS wait time 18 months, feeling hopeless",
      solution: "Connected with peer support group and trained mental health volunteer",
      impact: "Back at work within 3 months, now mentoring others, 12 people helped through same journey",
      icon: Sparkles,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      problem: "Food bank struggling with declining donations, couldn't reach new supporters",
      solution: "Corporate partners matched through CSR dashboard, social media campaign amplified",
      impact: "Donations increased 200%, 8 businesses now regular partners, feeding 500 more families monthly",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Real Problems. Real Solutions. Real Impact.
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how SouLVE transforms individual actions into collective change
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stories.map((story, index) => (
          <Card key={index} className="bg-white border-0 border-l-4 border-l-transparent hover:border-l-primary shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <CardContent className="p-8">
              <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${story.gradient} mb-8 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <story.icon className="h-7 w-7 text-white" />
              </div>
              
              <div className="relative space-y-6">
                {/* Vertical timeline line */}
                <div className="absolute left-[7px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-red-200 via-blue-200 to-green-200" />
                
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 w-4 h-4 bg-red-500 rounded-full" />
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Problem</span>
                  </div>
                  <p className="text-gray-900 text-lg font-semibold leading-relaxed">{story.problem}</p>
                </div>

                <div className="relative pl-6">
                  <CheckCircle2 className="absolute left-0 top-0 w-4 h-4 text-blue-500 fill-blue-100" />
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Solution</span>
                  </div>
                  <div className="bg-blue-50/50 -ml-6 pl-6 py-3 pr-3 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">{story.solution}</p>
                  </div>
                </div>

                <div className="relative pl-6">
                  <CheckCircle2 className="absolute left-0 top-0 w-4 h-4 text-green-500 fill-green-100" />
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Impact</span>
                  </div>
                  <div className="bg-green-50/50 -ml-6 pl-6 py-3 pr-3 rounded-r-lg">
                    <p className="text-gray-900 font-semibold leading-relaxed">{story.impact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-lg text-gray-600 font-medium mb-6">
          Here's how we make it happen ↓
        </p>
        <Button 
          size="lg"
          onClick={() => navigate("/register")}
          className="bg-gradient-to-r from-primary to-secondary text-white px-12 py-4 text-lg font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          Join the Movement
        </Button>
      </div>
    </section>
  );
};

export default ImpactStoriesSection;
