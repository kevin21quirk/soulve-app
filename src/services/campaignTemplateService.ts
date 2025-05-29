
export interface CampaignTemplate {
  id: string;
  name: string;
  category: "fundraising" | "volunteer" | "awareness" | "community" | "petition" | "social_cause";
  organization_type: "charity" | "business" | "social_group" | "community_group" | "individual";
  description: string;
  featured_image: string;
  template_data: {
    title: string;
    description: string;
    story: string;
    goal_type: "monetary" | "volunteers" | "signatures" | "participants";
    suggested_goal_amount?: number;
    duration_days?: number;
    urgency: "low" | "medium" | "high";
    tags: string[];
  };
  success_rate: number;
  usage_count: number;
  isPopular: boolean;
  createdBy: string;
  createdAt: string;
}

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: "education-scholarship",
    name: "Scholarship Fund",
    category: "fundraising",
    organization_type: "charity",
    description: "Create a scholarship fund to support students in need of financial assistance for their education.",
    featured_image: "/placeholder.svg",
    template_data: {
      title: "Supporting Dreams: [Student Name] Scholarship Fund",
      description: "Help us provide educational opportunities to deserving students who face financial barriers.",
      story: "Education is a powerful tool that can transform lives and break cycles of poverty. Many talented students are unable to pursue their dreams due to financial constraints. This scholarship fund aims to bridge that gap and provide opportunities for academic excellence.",
      goal_type: "monetary",
      suggested_goal_amount: 10000,
      duration_days: 90,
      urgency: "medium",
      tags: ["education", "scholarship", "students", "financial-aid"]
    },
    success_rate: 85,
    usage_count: 156,
    isPopular: true,
    createdBy: "SouLVE Team",
    createdAt: "2024-01-15"
  },
  {
    id: "community-garden",
    name: "Community Garden Project",
    category: "community",
    organization_type: "community_group",
    description: "Transform unused space into a thriving community garden that brings neighbors together.",
    featured_image: "/placeholder.svg",
    template_data: {
      title: "Growing Together: [Location] Community Garden",
      description: "Join us in creating a green space where neighbors can grow fresh produce, build connections, and strengthen our community.",
      story: "Community gardens are more than just places to grow food – they're spaces where relationships flourish, children learn about nature, and communities come together. Our project will transform an unused lot into a vibrant hub of activity and connection.",
      goal_type: "monetary",
      suggested_goal_amount: 5000,
      duration_days: 120,
      urgency: "medium",
      tags: ["community", "garden", "sustainability", "local"]
    },
    success_rate: 78,
    usage_count: 89,
    isPopular: true,
    createdBy: "Green Community Initiative",
    createdAt: "2024-02-01"
  },
  {
    id: "animal-rescue",
    name: "Animal Rescue Center",
    category: "fundraising",
    organization_type: "charity",
    description: "Support local animal rescue efforts and help provide shelter, medical care, and new homes for animals in need.",
    featured_image: "/placeholder.svg",
    template_data: {
      title: "Second Chances: [Location] Animal Rescue Initiative",
      description: "Every animal deserves love, care, and a forever home. Help us provide rescue, rehabilitation, and adoption services.",
      story: "Behind every rescue animal is a story of resilience and hope. Our rescue center provides emergency medical care, behavioral rehabilitation, and loving temporary homes while we search for permanent families. With your support, we can expand our capacity to save more lives.",
      goal_type: "monetary",
      suggested_goal_amount: 15000,
      duration_days: 180,
      urgency: "high",
      tags: ["animals", "rescue", "shelter", "veterinary"]
    },
    success_rate: 72,
    usage_count: 34,
    isPopular: false,
    createdBy: "Animal Welfare Alliance",
    createdAt: "2024-01-20"
  },
  {
    id: "volunteer-cleanup",
    name: "Community Cleanup Drive",
    category: "volunteer",
    organization_type: "social_group",
    description: "Organize volunteer events to clean and beautify local parks, beaches, and neighborhoods.",
    featured_image: "/placeholder.svg",
    template_data: {
      title: "Clean Up [Location]: Volunteer Initiative",
      description: "Join us in making our community cleaner and more beautiful through volunteer action.",
      story: "Small actions create big changes. Our volunteer cleanup drives bring community members together to take care of the spaces we all share and love.",
      goal_type: "volunteers",
      duration_days: 60,
      urgency: "medium",
      tags: ["volunteer", "cleanup", "environment", "community"]
    },
    success_rate: 92,
    usage_count: 67,
    isPopular: true,
    createdBy: "Clean Community Collective",
    createdAt: "2024-02-10"
  }
];

export const getCampaignTemplates = () => {
  return campaignTemplates;
};

export const getTemplatesByCategory = (category: string) => {
  return campaignTemplates.filter(template => template.category === category);
};

export const getPopularTemplates = () => {
  return campaignTemplates.filter(template => template.isPopular).sort((a, b) => b.usage_count - a.usage_count);
};

export const getHighPerformanceTemplates = () => {
  return campaignTemplates.filter(template => template.success_rate >= 80).sort((a, b) => b.success_rate - a.success_rate);
};

export const getTemplateById = (id: string) => {
  return campaignTemplates.find(template => template.id === id);
};

export const searchTemplates = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return campaignTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.template_data.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
