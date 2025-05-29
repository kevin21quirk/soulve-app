
export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fundraising' | 'volunteer' | 'awareness' | 'community' | 'petition' | 'social_cause';
  organization_type: 'charity' | 'business' | 'social_group' | 'community_group' | 'individual';
  featured_image: string;
  template_data: {
    title: string;
    description: string;
    story: string;
    goal_type: 'monetary' | 'volunteers' | 'signatures' | 'participants';
    suggested_goal_amount?: number;
    urgency: 'low' | 'medium' | 'high';
    tags: string[];
    duration_days?: number;
  };
  usage_count: number;
  success_rate: number;
  average_goal_achievement: number;
}

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'emergency-fundraising',
    name: 'Emergency Medical Fundraising',
    description: 'Quick setup for urgent medical expenses and emergency situations',
    category: 'fundraising',
    organization_type: 'individual',
    featured_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    template_data: {
      title: 'Help [Name] with Medical Expenses',
      description: 'Emergency medical fundraiser to help cover unexpected healthcare costs',
      story: 'We are raising funds to help cover urgent medical expenses for [Name]. Any contribution, no matter how small, will make a significant difference during this challenging time.\n\nThe funds will be used for:\n• Medical treatments and procedures\n• Hospital bills and medication\n• Recovery and rehabilitation costs\n\nYour support means the world to us and will help [Name] focus on healing without the burden of financial stress.',
      goal_type: 'monetary',
      suggested_goal_amount: 10000,
      urgency: 'high',
      tags: ['medical', 'emergency', 'healthcare', 'urgent'],
      duration_days: 60
    },
    usage_count: 1247,
    success_rate: 78,
    average_goal_achievement: 65
  },
  {
    id: 'community-garden',
    name: 'Community Garden Project',
    description: 'Template for creating local community gardens and green spaces',
    category: 'community',
    organization_type: 'community_group',
    featured_image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
    template_data: {
      title: 'Community Garden Initiative - Growing Together',
      description: 'Creating a sustainable community garden to bring neighbors together and promote healthy living',
      story: 'Our community is coming together to create a beautiful, sustainable garden space that will benefit everyone in our neighborhood.\n\nProject Goals:\n• Provide fresh, organic produce for local families\n• Create educational opportunities for children\n• Build stronger community connections\n• Promote environmental sustainability\n\nWe need volunteers to help with:\n• Garden design and planning\n• Soil preparation and planting\n• Ongoing maintenance and care\n• Community events and workshops',
      goal_type: 'volunteers',
      suggested_goal_amount: 50,
      urgency: 'medium',
      tags: ['community', 'garden', 'sustainability', 'environment', 'local'],
      duration_days: 120
    },
    usage_count: 892,
    success_rate: 85,
    average_goal_achievement: 92
  },
  {
    id: 'education-fundraising',
    name: 'Education Support Fund',
    description: 'Raise funds for educational programs, scholarships, or school supplies',
    category: 'fundraising',
    organization_type: 'charity',
    featured_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop',
    template_data: {
      title: 'Supporting Education in Our Community',
      description: 'Raising funds to provide educational opportunities and resources for students in need',
      story: 'Education is the foundation of a brighter future. Our campaign aims to support students who face financial barriers to learning.\n\nYour contribution will help provide:\n• School supplies and textbooks\n• Technology and learning devices\n• Scholarship opportunities\n• After-school tutoring programs\n\nEvery donation, regardless of size, directly impacts a student\'s educational journey and helps build stronger communities through learning.',
      goal_type: 'monetary',
      suggested_goal_amount: 25000,
      urgency: 'medium',
      tags: ['education', 'students', 'learning', 'community', 'scholarship'],
      duration_days: 90
    },
    usage_count: 1156,
    success_rate: 82,
    average_goal_achievement: 73
  },
  {
    id: 'environmental-cleanup',
    name: 'Environmental Cleanup Drive',
    description: 'Organize community cleanup events and environmental protection initiatives',
    category: 'volunteer',
    organization_type: 'social_group',
    featured_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
    template_data: {
      title: 'Community Environmental Cleanup Initiative',
      description: 'Join us in protecting our environment through organized cleanup and conservation efforts',
      story: 'Our planet needs our help, and together we can make a real difference in our local environment.\n\nCleanup Activities:\n• Beach and waterway cleaning\n• Park and trail maintenance\n• Recycling and waste reduction programs\n• Tree planting and habitat restoration\n\nVolunteer Opportunities:\n• Event coordination and planning\n• Cleanup crew leaders\n• Educational outreach\n• Data collection and reporting\n\nNo experience necessary - just bring your enthusiasm and we\'ll provide training and supplies!',
      goal_type: 'volunteers',
      suggested_goal_amount: 100,
      urgency: 'medium',
      tags: ['environment', 'cleanup', 'conservation', 'volunteer', 'sustainability'],
      duration_days: 45
    },
    usage_count: 743,
    success_rate: 91,
    average_goal_achievement: 88
  },
  {
    id: 'local-business-support',
    name: 'Support Local Business',
    description: 'Help local businesses during challenging times or expansion',
    category: 'fundraising',
    organization_type: 'business',
    featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    template_data: {
      title: 'Supporting [Business Name] - Local Community Pillar',
      description: 'Help us support a beloved local business that serves our community',
      story: '[Business Name] has been a cornerstone of our community for [X] years, providing [services/products] and supporting local families.\n\nDue to [challenge/opportunity], they need our community\'s support to:\n• Continue serving our neighborhood\n• Maintain local jobs\n• Preserve community gathering space\n• Invest in improvements and growth\n\nYour support helps maintain the unique character of our community and ensures local businesses can thrive.',
      goal_type: 'monetary',
      suggested_goal_amount: 15000,
      urgency: 'medium',
      tags: ['local business', 'community', 'economy', 'support'],
      duration_days: 75
    },
    usage_count: 634,
    success_rate: 76,
    average_goal_achievement: 69
  },
  {
    id: 'mental-health-awareness',
    name: 'Mental Health Awareness Campaign',
    description: 'Promote mental health awareness and reduce stigma in your community',
    category: 'awareness',
    organization_type: 'social_group',
    featured_image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=400&fit=crop',
    template_data: {
      title: 'Breaking the Silence: Mental Health Awareness',
      description: 'Join our campaign to promote mental health awareness and create supportive communities',
      story: 'Mental health affects everyone, yet stigma often prevents people from seeking the help they need. Our awareness campaign aims to change that.\n\nCampaign Goals:\n• Reduce mental health stigma\n• Provide resources and information\n• Create safe spaces for discussion\n• Connect people with professional help\n\nHow You Can Help:\n• Share your story (if comfortable)\n• Attend awareness events\n• Volunteer at information booths\n• Help distribute resources\n• Support others in their journey\n\nTogether, we can create a community where mental health is treated with the same importance as physical health.',
      goal_type: 'participants',
      suggested_goal_amount: 500,
      urgency: 'medium',
      tags: ['mental health', 'awareness', 'support', 'community', 'wellness'],
      duration_days: 60
    },
    usage_count: 567,
    success_rate: 87,
    average_goal_achievement: 94
  }
];

export const getCampaignTemplates = (category?: string) => {
  if (category) {
    return campaignTemplates.filter(template => template.category === category);
  }
  return campaignTemplates;
};

export const getTemplateById = (id: string) => {
  return campaignTemplates.find(template => template.id === id);
};

export const getPopularTemplates = (limit: number = 3) => {
  return campaignTemplates
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, limit);
};

export const getHighPerformanceTemplates = (limit: number = 3) => {
  return campaignTemplates
    .sort((a, b) => b.success_rate - a.success_rate)
    .slice(0, limit);
};
