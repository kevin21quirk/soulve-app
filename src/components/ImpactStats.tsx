
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
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
  );
};

export default ImpactStats;
