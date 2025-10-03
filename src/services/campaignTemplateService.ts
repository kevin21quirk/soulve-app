
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
  // Additional properties for the components
  estimatedDuration?: string;
  targetAmount?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  content?: {
    title: string;
    description: string;
    story: string;
    goals: string[];
    impacts: string[];
  };
  socialStrategies?: Array<{
    platform: string;
    content: string;
    hashtags: string[];
  }>;
  milestones?: Array<{
    title: string;
    percentage: number;
    description: string;
    reward?: string;
  }>;
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
    createdAt: "2024-01-15",
    estimatedDuration: "3 months",
    targetAmount: 10000,
    difficulty: "intermediate",
    content: {
      title: "Supporting Dreams: [Student Name] Scholarship Fund",
      description: "Help us provide educational opportunities to deserving students who face financial barriers.",
      story: "Education is a powerful tool that can transform lives and break cycles of poverty.",
      goals: ["Provide financial assistance to students", "Support academic excellence", "Break barriers to education"],
      impacts: ["Students receive higher education", "Reduced financial burden on families", "Increased graduation rates"]
    },
    socialStrategies: [
      {
        platform: "Facebook",
        content: "🎓 Help us support deserving students! Every donation brings someone closer to their educational dreams.",
        hashtags: ["#Education", "#Scholarship", "#Students"]
      },
      {
        platform: "Twitter",
        content: "Education changes lives. Help us provide scholarships to students in need. #EducationForAll",
        hashtags: ["#Scholarship", "#Education", "#Community"]
      }
    ],
    milestones: [
      {
        title: "First Scholarship Awarded",
        percentage: 25,
        description: "Celebrate our first scholarship recipient",
        reward: "Thank you video from recipient"
      },
      {
        title: "Halfway to Goal",
        percentage: 50,
        description: "We're making great progress!",
        reward: "Progress report and impact update"
      },
      {
        title: "Goal Achieved",
        percentage: 100,
        description: "Full scholarship fund established",
        reward: "Annual impact report"
      }
    ]
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
    createdAt: "2024-02-01",
    estimatedDuration: "4 months",
    targetAmount: 5000,
    difficulty: "beginner",
    content: {
      title: "Growing Together: [Location] Community Garden",
      description: "Join us in creating a green space where neighbors can grow fresh produce, build connections, and strengthen our community.",
      story: "Community gardens are more than just places to grow food – they're spaces where relationships flourish.",
      goals: ["Create community green space", "Provide fresh produce access", "Build neighborhood connections"],
      impacts: ["Improved food security", "Stronger community bonds", "Environmental benefits"]
    },
    socialStrategies: [
      {
        platform: "Instagram",
        content: "🌱 Growing more than vegetables - we're growing community! Join our garden project.",
        hashtags: ["#CommunityGarden", "#Sustainability", "#LocalFood"]
      }
    ],
    milestones: [
      {
        title: "Land Secured",
        percentage: 30,
        description: "Garden plot secured and prepared",
      },
      {
        title: "Garden Established",
        percentage: 100,
        description: "Community garden fully operational",
        reward: "Harvest celebration event"
      }
    ]
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
    createdAt: "2024-01-20",
    estimatedDuration: "6 months",
    targetAmount: 15000,
    difficulty: "advanced",
    content: {
      title: "Second Chances: [Location] Animal Rescue Initiative",
      description: "Every animal deserves love, care, and a forever home. Help us provide rescue, rehabilitation, and adoption services.",
      story: "Behind every rescue animal is a story of resilience and hope.",
      goals: ["Provide emergency medical care", "Create temporary shelter", "Find forever homes"],
      impacts: ["Animals saved from streets", "Reduced animal suffering", "Increased adoption rates"]
    },
    socialStrategies: [
      {
        platform: "Facebook",
        content: "🐾 Every animal deserves a second chance. Help us provide rescue and rehabilitation services.",
        hashtags: ["#AnimalRescue", "#AdoptDontShop", "#SecondChances"]
      }
    ],
    milestones: [
      {
        title: "Emergency Fund",
        percentage: 40,
        description: "Emergency medical care fund established"
      },
      {
        title: "Shelter Operational",
        percentage: 100,
        description: "Full rescue center operational",
        reward: "Adoption success stories video"
      }
    ]
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
    createdAt: "2024-02-10",
    estimatedDuration: "2 months",
    targetAmount: 0,
    difficulty: "beginner",
    content: {
      title: "Clean Up [Location]: Volunteer Initiative",
      description: "Join us in making our community cleaner and more beautiful through volunteer action.",
      story: "Small actions create big changes. Our volunteer cleanup drives bring community members together.",
      goals: ["Organize cleanup events", "Engage volunteers", "Beautify community spaces"],
      impacts: ["Cleaner environment", "Community pride", "Environmental awareness"]
    },
    socialStrategies: [
      {
        platform: "Twitter",
        content: "🌍 Small actions, big changes! Join our community cleanup drive this weekend.",
        hashtags: ["#CommunityCleanup", "#Environment", "#Volunteer"]
      }
    ],
    milestones: [
      {
        title: "First Cleanup Event",
        percentage: 50,
        description: "Successfully organized first cleanup"
      },
      {
        title: "Monthly Events",
        percentage: 100,
        description: "Regular cleanup schedule established",
        reward: "Community recognition ceremony"
      }
    ]
  },
  {
    id: "climate-awareness",
    name: "Climate Action Awareness Campaign",
    category: "awareness",
    organization_type: "social_group",
    description: "Educate the community about climate change and sustainable living practices through workshops, events, and educational materials.",
    featured_image: "/placeholder.svg",
    template_data: {
      title: "Act Now: [Location] Climate Action Awareness",
      description: "Join us in spreading awareness about climate change and empowering our community with sustainable living practices.",
      story: "Climate change is the defining challenge of our time. By educating our community and promoting sustainable practices, we can create lasting change. This campaign focuses on workshops, educational materials, and community events to build a more environmentally conscious society.",
      goal_type: "participants",
      duration_days: 90,
      urgency: "high",
      tags: ["climate", "awareness", "education", "sustainability", "environment"]
    },
    success_rate: 88,
    usage_count: 124,
    isPopular: true,
    createdBy: "Environmental Action Network",
    createdAt: "2024-01-25",
    estimatedDuration: "3 months",
    targetAmount: 0,
    difficulty: "intermediate",
    content: {
      title: "Act Now: [Location] Climate Action Awareness",
      description: "Join us in spreading awareness about climate change and empowering our community with sustainable practices.",
      story: "Climate change is the defining challenge of our time. Through education and community action, we can make a difference.",
      goals: ["Educate 1000+ community members", "Host monthly sustainability workshops", "Distribute educational materials", "Create local climate action groups"],
      impacts: ["Increased environmental awareness", "Adoption of sustainable practices", "Community climate action network", "Reduced carbon footprint"]
    },
    socialStrategies: [
      {
        platform: "Instagram",
        content: "🌍 Climate change starts with awareness! Join our campaign to learn sustainable living practices. #ClimateAction",
        hashtags: ["#ClimateAction", "#Sustainability", "#GoGreen"]
      },
      {
        platform: "Twitter",
        content: "Knowledge is power in the fight against climate change. Join our awareness campaign today! 🌱",
        hashtags: ["#ClimateAwareness", "#ActOnClimate", "#Sustainability"]
      },
      {
        platform: "Facebook",
        content: "🌿 Want to make a difference? Our climate awareness campaign provides tools, knowledge, and community support for sustainable living.",
        hashtags: ["#ClimateChange", "#CommunityAction", "#Sustainability"]
      }
    ],
    milestones: [
      {
        title: "First Workshop Complete",
        percentage: 25,
        description: "Successfully hosted first community workshop",
        reward: "Workshop highlights video"
      },
      {
        title: "500 Participants Reached",
        percentage: 50,
        description: "Halfway to our awareness goal",
        reward: "Sustainability toolkit for all participants"
      },
      {
        title: "Climate Action Groups Formed",
        percentage: 75,
        description: "Local action groups established",
        reward: "Group leader training session"
      },
      {
        title: "Goal Achieved",
        percentage: 100,
        description: "1000+ community members educated",
        reward: "Impact report and celebration event"
      }
    ]
  },
  {
    id: "policy-change-petition",
    name: "Community Policy Change Petition",
    category: "petition",
    organization_type: "community_group",
    description: "Rally community support for local policy changes through organized petition campaigns and stakeholder engagement.",
    featured_image: "/placeholder.svg",
    template_data: {
      title: "Change [Location] Policy: [Policy Name] Petition",
      description: "Stand with us to bring about meaningful policy change in our community. Every signature counts!",
      story: "Change starts with community action. This petition aims to bring about essential policy reforms that will benefit our entire community. By gathering signatures and demonstrating unified support, we can make our voices heard by decision-makers.",
      goal_type: "signatures",
      duration_days: 60,
      urgency: "high",
      tags: ["petition", "policy", "advocacy", "community", "change"]
    },
    success_rate: 81,
    usage_count: 203,
    isPopular: true,
    createdBy: "Civic Engagement Alliance",
    createdAt: "2024-02-05",
    estimatedDuration: "2 months",
    targetAmount: 0,
    difficulty: "beginner",
    content: {
      title: "Change [Location] Policy: [Policy Name] Petition",
      description: "Stand with us to bring about meaningful policy change in our community.",
      story: "Change starts with community action. Together, our voices can shape better policies for everyone.",
      goals: ["Collect 5000+ signatures", "Present to local government", "Engage community stakeholders", "Media coverage for awareness"],
      impacts: ["Policy reform achieved", "Community empowerment", "Democratic participation", "Lasting legislative change"]
    },
    socialStrategies: [
      {
        platform: "Facebook",
        content: "✍️ Your signature matters! Join thousands supporting [Policy Name] change. Sign and share today!",
        hashtags: ["#PolicyChange", "#CommunityAction", "#MakeADifference"]
      },
      {
        platform: "Twitter",
        content: "Real change happens when communities unite. Sign our petition for [Policy Name] reform. Every voice counts! ✊",
        hashtags: ["#Petition", "#PolicyReform", "#CivicEngagement"]
      },
      {
        platform: "Instagram",
        content: "📝 Be part of the change! Our petition is gaining momentum - add your voice to the movement.",
        hashtags: ["#SignThePetition", "#CommunityPower", "#LocalChange"]
      }
    ],
    milestones: [
      {
        title: "1000 Signatures",
        percentage: 20,
        description: "Strong initial support demonstrated",
        reward: "Thank you social media feature"
      },
      {
        title: "2500 Signatures",
        percentage: 50,
        description: "Halfway to our goal!",
        reward: "Progress update to all signers"
      },
      {
        title: "4000 Signatures",
        percentage: 80,
        description: "Meeting scheduled with officials",
        reward: "Invitation to community town hall"
      },
      {
        title: "Goal Achieved",
        percentage: 100,
        description: "Petition submitted to authorities",
        reward: "Live-streamed submission event"
      }
    ]
  },
  {
    id: "mental-health-support",
    name: "Mental Health Support Initiative",
    category: "social_cause",
    organization_type: "charity",
    description: "Create support networks and resources for mental health awareness and assistance, breaking down stigma and providing help.",
    featured_image: "/placeholder.svg",
    template_data: {
      title: "Breaking Silence: [Location] Mental Health Support",
      description: "Building a compassionate community where mental health support is accessible, stigma-free, and empowering for everyone.",
      story: "Mental health challenges affect millions, yet stigma prevents many from seeking help. This initiative creates safe spaces, support groups, and resources to ensure no one faces these challenges alone. Through community events, professional partnerships, and peer support, we're building a network of care.",
      goal_type: "participants",
      duration_days: 180,
      urgency: "medium",
      tags: ["mental-health", "support", "wellness", "community", "awareness"]
    },
    success_rate: 76,
    usage_count: 87,
    isPopular: false,
    createdBy: "Mental Wellness Foundation",
    createdAt: "2024-01-30",
    estimatedDuration: "6 months",
    targetAmount: 0,
    difficulty: "advanced",
    content: {
      title: "Breaking Silence: [Location] Mental Health Support",
      description: "Building a compassionate community where mental health support is accessible and stigma-free.",
      story: "Mental health challenges affect us all. Together, we can create a community of understanding and support.",
      goals: ["Establish 10 support groups", "Partner with mental health professionals", "Host monthly awareness events", "Provide free counseling resources", "Create peer mentorship program"],
      impacts: ["Reduced mental health stigma", "Accessible support services", "Stronger community bonds", "Improved well-being outcomes", "Professional network established"]
    },
    socialStrategies: [
      {
        platform: "Instagram",
        content: "💚 You are not alone. Our mental health support initiative provides safe spaces, resources, and community. Join us.",
        hashtags: ["#MentalHealthMatters", "#BreakTheStigma", "#SupportCommunity"]
      },
      {
        platform: "Facebook",
        content: "🧠 Mental health is just as important as physical health. Our initiative offers support groups, resources, and a judgment-free community.",
        hashtags: ["#MentalWellness", "#CommunitySupport", "#EndTheStigma"]
      },
      {
        platform: "Twitter",
        content: "Breaking the stigma, one conversation at a time. Join our mental health support community. 💙",
        hashtags: ["#MentalHealthAwareness", "#YouAreNotAlone", "#Support"]
      }
    ],
    milestones: [
      {
        title: "First Support Group",
        percentage: 20,
        description: "Inaugural support group successfully launched",
        reward: "Welcome kit for all participants"
      },
      {
        title: "Professional Partnerships",
        percentage: 40,
        description: "Partnerships with mental health professionals established",
        reward: "Free counseling sessions available"
      },
      {
        title: "Community Network",
        percentage: 60,
        description: "All support groups operational",
        reward: "Peer mentor training program"
      },
      {
        title: "Awareness Event",
        percentage: 80,
        description: "Major community awareness event held",
        reward: "Mental health resource booklet"
      },
      {
        title: "Full Initiative Launch",
        percentage: 100,
        description: "Complete support network established",
        reward: "Annual impact report and community celebration"
      }
    ]
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
