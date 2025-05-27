
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Globe } from "lucide-react";

const ImpactStats = () => {
  const [impactStats, setImpactStats] = useState({ connections: 0, verified: 0, communities: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setImpactStats({ connections: 15420, verified: 2834, communities: 187 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "Connections Made", value: impactStats.connections.toLocaleString(), icon: Heart, color: "bg-gradient-to-r from-teal-500 to-cyan-500" },
    { label: "Verified Soulvers", value: impactStats.verified.toLocaleString(), icon: Shield, color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
    { label: "Active Communities", value: impactStats.communities.toLocaleString(), icon: Globe, color: "bg-gradient-to-r from-purple-500 to-pink-500" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/95 backdrop-blur-lg shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className={`inline-flex p-4 rounded-full ${stat.color} mb-6 shadow-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">{stat.value}</h3>
              <p className="text-gray-600 font-medium text-lg">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImpactStats;
