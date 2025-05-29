
export interface CampaignTemplate {
  id: string;
  name: string;
  category: "education" | "healthcare" | "environment" | "community" | "disaster-relief" | "animal-welfare";
  description: string;
  estimatedDuration: string;
  targetAmount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  content: {
    title: string;
    description: string;
    story: string;
    goals: string[];
    impacts: string[];
  };
  mediaPlaceholders: {
    heroImage: string;
    galleryImages: string[];
    videoPlaceholder?: string;
  };
  socialStrategies: {
    platform: string;
    content: string;
    hashtags: string[];
  }[];
  milestones: {
    percentage: number;
    title: string;
    description: string;
    reward?: string;
  }[];
  isPopular: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
}

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: "education-scholarship",
    name: "Scholarship Fund",
    category: "education",
    description: "Create a scholarship fund to support students in need of financial assistance for their education.",
    estimatedDuration: "3-6 months",
    targetAmount: 10000,
    difficulty: "beginner",
    tags: ["education", "scholarship", "students", "financial-aid"],
    content: {
      title: "Supporting Dreams: [Student Name] Scholarship Fund",
      description: "Help us provide educational opportunities to deserving students who face financial barriers.",
      story: "Education is a powerful tool that can transform lives and break cycles of poverty. Many talented students are unable to pursue their dreams due to financial constraints. This scholarship fund aims to bridge that gap and provide opportunities for academic excellence.",
      goals: [
        "Provide full tuition coverage for one academic year",
        "Support 2-3 students with partial scholarships",
        "Create sustainable funding for future scholars"
      ],
      impacts: [
        "Direct impact on student's educational journey",
        "Strengthening community through education",
        "Creating role models for future generations"
      ]
    },
    mediaPlaceholders: {
      heroImage: "Education/graduation-ceremony.jpg",
      galleryImages: [
        "Education/students-studying.jpg",
        "Education/library-scene.jpg",
        "Education/campus-life.jpg"
      ]
    },
    socialStrategies: [
      {
        platform: "Facebook",
        content: "🎓 Every student deserves a chance to pursue their dreams! Help us support the next generation of leaders.",
        hashtags: ["#EducationForAll", "#ScholarshipFund", "#SupportStudents"]
      },
      {
        platform: "Twitter",
        content: "Education changes lives. Your support can make the difference for a deserving student. 📚✨",
        hashtags: ["#EducationMatters", "#Scholarship", "#PayItForward"]
      }
    ],
    milestones: [
      { percentage: 25, title: "First Quarter", description: "Cover textbooks and supplies for the semester" },
      { percentage: 50, title: "Halfway There", description: "Semester tuition covered" },
      { percentage: 75, title: "Almost There", description: "Full year tuition secured" },
      { percentage: 100, title: "Goal Achieved", description: "Complete scholarship funded with room for growth" }
    ],
    isPopular: true,
    usageCount: 156,
    createdBy: "SouLVE Team",
    createdAt: "2024-01-15"
  },
  {
    id: "community-garden",
    name: "Community Garden Project",
    category: "community",
    description: "Transform unused space into a thriving community garden that brings neighbors together.",
    estimatedDuration: "4-8 months",
    targetAmount: 5000,
    difficulty: "intermediate",
    tags: ["community", "garden", "sustainability", "local"],
    content: {
      title: "Growing Together: [Location] Community Garden",
      description: "Join us in creating a green space where neighbors can grow fresh produce, build connections, and strengthen our community.",
      story: "Community gardens are more than just places to grow food – they're spaces where relationships flourish, children learn about nature, and communities come together. Our project will transform an unused lot into a vibrant hub of activity and connection.",
      goals: [
        "Install raised garden beds and irrigation system",
        "Create composting and tool storage areas",
        "Establish community programs and workshops",
        "Engage 50+ local families in the project"
      ],
      impacts: [
        "Increased access to fresh, healthy food",
        "Stronger neighborhood connections",
        "Environmental benefits through green space",
        "Educational opportunities for children and adults"
      ]
    },
    mediaPlaceholders: {
      heroImage: "Community/community-garden-harvest.jpg",
      galleryImages: [
        "Community/people-gardening.jpg",
        "Community/fresh-vegetables.jpg",
        "Community/children-planting.jpg"
      ]
    },
    socialStrategies: [
      {
        platform: "Facebook",
        content: "🌱 Help us grow more than just vegetables – let's grow community! Support our garden project.",
        hashtags: ["#CommunityGarden", "#GrowTogether", "#LocalFood"]
      },
      {
        platform: "Instagram",
        content: "From seed to harvest, from neighbors to friends. Be part of our growing community! 🥕🌿",
        hashtags: ["#CommunityGarden", "#GrowLocal", "#NeighborhoodLove"]
      }
    ],
    milestones: [
      { percentage: 20, title: "Site Preparation", description: "Land cleared and soil tested" },
      { percentage: 40, title: "Infrastructure", description: "Raised beds and water access installed" },
      { percentage: 60, title: "Tools & Storage", description: "Shed built and tools purchased" },
      { percentage: 80, title: "First Planting", description: "Seeds planted and growing!" },
      { percentage: 100, title: "Harvest Time", description: "Community celebrating first harvest" }
    ],
    isPopular: true,
    usageCount: 89,
    createdBy: "Green Community Initiative",
    createdAt: "2024-02-01"
  },
  {
    id: "animal-rescue",
    name: "Animal Rescue Center",
    category: "animal-welfare",
    description: "Support local animal rescue efforts and help provide shelter, medical care, and new homes for animals in need.",
    estimatedDuration: "6-12 months",
    targetAmount: 15000,
    difficulty: "advanced",
    tags: ["animals", "rescue", "shelter", "veterinary"],
    content: {
      title: "Second Chances: [Location] Animal Rescue Initiative",
      description: "Every animal deserves love, care, and a forever home. Help us provide rescue, rehabilitation, and adoption services.",
      story: "Behind every rescue animal is a story of resilience and hope. Our rescue center provides emergency medical care, behavioral rehabilitation, and loving temporary homes while we search for permanent families. With your support, we can expand our capacity to save more lives.",
      goals: [
        "Rescue and rehabilitate 200+ animals annually",
        "Establish mobile veterinary clinic",
        "Create foster network of 50+ families",
        "Achieve 90% successful adoption rate"
      ],
      impacts: [
        "Lives saved through emergency rescue operations",
        "Reduced pet overpopulation through spay/neuter programs",
        "Community education on responsible pet ownership",
        "Support for families facing financial hardship with pet care"
      ]
    },
    mediaPlaceholders: {
      heroImage: "Animals/rescue-shelter.jpg",
      galleryImages: [
        "Animals/happy-adopted-pets.jpg",
        "Animals/veterinary-care.jpg",
        "Animals/volunteers-with-animals.jpg"
      ]
    },
    socialStrategies: [
      {
        platform: "Facebook",
        content: "🐾 Every donation helps us give animals a second chance at happiness. Join our rescue mission!",
        hashtags: ["#AnimalRescue", "#AdoptDontShop", "#SecondChances"]
      },
      {
        platform: "Instagram",
        content: "From rescue to forever home – your support makes these transformations possible! ❤️🐕🐱",
        hashtags: ["#RescueLife", "#AdoptionSuccess", "#AnimalWelfare"]
      }
    ],
    milestones: [
      { percentage: 15, title: "Emergency Fund", description: "Emergency medical care fund established" },
      { percentage: 35, title: "Foster Network", description: "Foster family recruitment and training" },
      { percentage: 55, title: "Mobile Clinic", description: "Veterinary clinic equipment purchased" },
      { percentage: 75, title: "Facility Expansion", description: "Additional shelter space created" },
      { percentage: 100, title: "Full Operation", description: "All programs running at full capacity" }
    ],
    isPopular: false,
    usageCount: 34,
    createdBy: "Animal Welfare Alliance",
    createdAt: "2024-01-20"
  }
];

export const getTemplatesByCategory = (category: string) => {
  return campaignTemplates.filter(template => template.category === category);
};

export const getPopularTemplates = () => {
  return campaignTemplates.filter(template => template.isPopular).sort((a, b) => b.usageCount - a.usageCount);
};

export const getTemplateById = (id: string) => {
  return campaignTemplates.find(template => template.id === id);
};

export const searchTemplates = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return campaignTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
