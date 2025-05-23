
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Users, Globe, TreePine, Droplets, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [impactStats, setImpactStats] = useState({ lives: 0, projects: 0, volunteers: 0 });
  const { toast } = useToast();

  // Animate impact numbers on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setImpactStats({ lives: 12450, projects: 89, volunteers: 1200 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thank you for joining!",
        description: "You'll receive updates about our latest impact initiatives.",
      });
      setEmail("");
    }
  };

  const causes = [
    {
      title: "Clean Water Initiative",
      description: "Bringing safe drinking water to communities in need across rural Africa.",
      image: "photo-1500673922987-e212871fec22",
      raised: 85000,
      goal: 100000,
      icon: Droplets,
      color: "text-blue-600"
    },
    {
      title: "Education for All",
      description: "Building schools and providing educational resources in underserved areas.",
      image: "photo-1519389950473-47ba0277781c",
      raised: 62000,
      goal: 80000,
      icon: GraduationCap,
      color: "text-purple-600"
    },
    {
      title: "Forest Restoration",
      description: "Planting trees and restoring ecosystems to combat climate change.",
      image: "photo-1501854140801-50d01698950b",
      raised: 45000,
      goal: 60000,
      icon: TreePine,
      color: "text-green-600"
    }
  ];

  const volunteerOpportunities = [
    {
      title: "Community Garden Coordinator",
      location: "Local Community Centers",
      commitment: "4 hours/week",
      skills: "Gardening, Community Outreach"
    },
    {
      title: "Education Mentor",
      location: "Remote/Online",
      commitment: "2 hours/week",
      skills: "Teaching, Patience, Communication"
    },
    {
      title: "Environmental Advocate",
      location: "Various Locations",
      commitment: "Flexible",
      skills: "Public Speaking, Research, Passion for Environment"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Change the World
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Join our global community of changemakers creating lasting impact through innovative solutions and collective action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200">
                <Heart className="mr-2 h-5 w-5" />
                Start Making Impact
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200">
                <Users className="mr-2 h-5 w-5" />
                Join as Volunteer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Lives Impacted", value: impactStats.lives.toLocaleString(), icon: Heart, color: "bg-red-500" },
            { label: "Active Projects", value: impactStats.projects.toLocaleString(), icon: Globe, color: "bg-blue-500" },
            { label: "Volunteers", value: impactStats.volunteers.toLocaleString(), icon: Users, color: "bg-green-500" }
          ].map((stat, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-3 rounded-full ${stat.color} mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Causes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Causes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support meaningful projects that are creating real change in communities around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${cause.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={cause.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <div className={`p-2 rounded-full bg-white/90 ${cause.color}`}>
                    <cause.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{cause.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {cause.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Raised: ${cause.raised.toLocaleString()}</span>
                    <span>Goal: ${cause.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                    ></div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Support This Cause
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Volunteer Opportunities */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Volunteer Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Use your skills and passion to make a difference in your community and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{opportunity.title}</CardTitle>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {opportunity.commitment}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Skills needed:</strong> {opportunity.skills}
                  </p>
                  <Button variant="outline" className="w-full hover:bg-blue-50">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Connected</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get updates on our latest projects and discover new ways to make an impact.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/90 border-0"
              required
            />
            <Button type="submit" className="bg-white text-blue-600 hover:bg-blue-50">
              Join Community
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ImpactHub</h3>
              <p className="text-gray-400">
                Creating lasting change through community-driven initiatives and global partnerships.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get Involved</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Donate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Impact Reports</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ImpactHub. Making the world a better place, one project at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
