import { ArrowRight, Heart, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ImpactStoriesSection = () => {
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
          <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-6">
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${story.gradient} mb-6 shadow-lg`}>
                <story.icon className="h-6 w-6 text-white" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Problem</span>
                  </div>
                  <p className="text-gray-700 font-medium">{story.problem}</p>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-gray-400 animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Solution</span>
                  </div>
                  <p className="text-gray-700">{story.solution}</p>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-gray-400 animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Impact</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{story.impact}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-lg text-gray-600 font-medium">
          Here's how we make it happen ↓
        </p>
      </div>
    </section>
  );
};

export default ImpactStoriesSection;
