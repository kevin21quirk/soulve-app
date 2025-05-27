
import { TrustFootprint } from "@/types/trustFootprint";

export const mockTrustFootprint: TrustFootprint = {
  userId: "current-user",
  userName: "Alex Johnson",
  trustScore: 95,
  totalActivities: 18,
  totalDonated: 1250,
  totalVolunteerHours: 45,
  helpProvidedCount: 12,
  helpReceivedCount: 3,
  charitiesSupported: 5,
  verificationBadges: ["Verified Helper", "Community Champion", "Trusted Donor"],
  activities: [
    {
      id: "1",
      type: "donation",
      title: "Food Bank Donation",
      description: "Monthly donation to local food bank",
      organization: "City Food Bank",
      amount: 50,
      date: "2024-01-15",
      status: "completed",
      impact: "Fed 15 families for a week",
      recipients: 15
    },
    {
      id: "2",
      type: "volunteer",
      title: "Community Garden Maintenance",
      description: "Helped maintain the community garden and taught sustainable farming",
      organization: "Green Community Initiative",
      date: "2024-01-10",
      status: "completed",
      hours: 8,
      impact: "Maintained 50 garden plots"
    },
    {
      id: "3",
      type: "help_provided",
      title: "Moving Assistance",
      description: "Helped elderly neighbor move to new apartment",
      date: "2024-01-08",
      status: "completed",
      hours: 4,
      impact: "Successful relocation completed"
    },
    {
      id: "4",
      type: "charity_support",
      title: "Animal Shelter Support",
      description: "Organized pet adoption event",
      organization: "Happy Paws Shelter",
      date: "2024-01-05",
      status: "completed",
      impact: "12 pets found homes",
      recipients: 12
    },
    {
      id: "5",
      type: "help_received",
      title: "Car Repair Assistance",
      description: "Received help with car repairs from community member",
      date: "2023-12-20",
      status: "completed",
      impact: "Car restored to working condition"
    },
    {
      id: "6",
      type: "donation",
      title: "Homeless Shelter Donation",
      description: "Winter clothing and blanket donation",
      organization: "Warm Hearts Shelter",
      amount: 150,
      date: "2023-12-15",
      status: "verified",
      impact: "Provided warmth for 20 people",
      recipients: 20
    }
  ]
};
