import { useQuery } from "@tanstack/react-query";
import { OrganizationManagementService } from "@/services/organizationManagementService";
import { DonorManagementService } from "@/services/donorManagementService";
import { VolunteerManagementService } from "@/services/volunteerManagementService";
import { GrantManagementService } from "@/services/grantManagementService";

// Shared query keys
export const charityToolsKeys = {
  all: ['charity-tools'] as const,
  team: (orgId: string) => [...charityToolsKeys.all, 'team', orgId] as const,
  donors: (orgId: string) => [...charityToolsKeys.all, 'donors', orgId] as const,
  donorAnalytics: (orgId: string) => [...charityToolsKeys.all, 'donor-analytics', orgId] as const,
  volunteers: (orgId: string) => [...charityToolsKeys.all, 'volunteers', orgId] as const,
  volunteerAnalytics: (orgId: string) => [...charityToolsKeys.all, 'volunteer-analytics', orgId] as const,
  grants: (orgId: string) => [...charityToolsKeys.all, 'grants', orgId] as const,
  grantAnalytics: (orgId: string) => [...charityToolsKeys.all, 'grant-analytics', orgId] as const,
  stats: (orgId: string) => [...charityToolsKeys.all, 'stats', orgId] as const,
};

// Hook for dashboard stats - fetches all data once
export const useCharityToolsStats = (organizationId: string) => {
  return useQuery({
    queryKey: charityToolsKeys.stats(organizationId),
    queryFn: async () => {
      const [teamData, donorData, volunteerData, grantData] = await Promise.allSettled([
        OrganizationManagementService.getTeamMembers(organizationId),
        DonorManagementService.getDonors(organizationId),
        VolunteerManagementService.getOpportunities(organizationId),
        GrantManagementService.getGrants(organizationId),
      ]);

      return {
        teamMembers: teamData.status === 'fulfilled' ? teamData.value.length : 0,
        donors: donorData.status === 'fulfilled' ? donorData.value.length : 0,
        volunteers: volunteerData.status === 'fulfilled' ? volunteerData.value.length : 0,
        totalRaised: donorData.status === 'fulfilled' 
          ? donorData.value.reduce((sum: number, d: any) => sum + (d.total_donated || 0), 0) 
          : 0,
        activeGrants: grantData.status === 'fulfilled' 
          ? grantData.value.filter((g: any) => g.status === 'active').length 
          : 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for donors list
export const useDonors = (organizationId: string) => {
  return useQuery({
    queryKey: charityToolsKeys.donors(organizationId),
    queryFn: () => DonorManagementService.getDonors(organizationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for donor analytics
export const useDonorAnalytics = (organizationId: string) => {
  return useQuery({
    queryKey: charityToolsKeys.donorAnalytics(organizationId),
    queryFn: () => DonorManagementService.getDonorAnalytics(organizationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for grants list
export const useGrants = (organizationId: string) => {
  return useQuery({
    queryKey: charityToolsKeys.grants(organizationId),
    queryFn: () => GrantManagementService.getGrants(organizationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for grant analytics
export const useGrantAnalytics = (organizationId: string) => {
  return useQuery({
    queryKey: charityToolsKeys.grantAnalytics(organizationId),
    queryFn: () => GrantManagementService.getGrantAnalytics(organizationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for volunteer opportunities with ALL applications in single query
export const useVolunteerOpportunities = (organizationId: string) => {
  return useQuery({
    queryKey: charityToolsKeys.volunteers(organizationId),
    queryFn: async () => {
      const opportunities = await VolunteerManagementService.getOpportunities(organizationId);
      
      // Fetch ALL applications for all opportunities in single parallel batch
      // instead of N+1 individual queries
      if (opportunities.length === 0) {
        return { opportunities, applications: {} };
      }

      const opportunityIds = opportunities.map(o => o.id);
      const applicationPromises = opportunityIds.map(id => 
        VolunteerManagementService.getApplications(id).catch(() => [])
      );
      
      const allApplications = await Promise.all(applicationPromises);
      
      const applications: Record<string, any[]> = {};
      opportunityIds.forEach((id, index) => {
        applications[id] = allApplications[index];
      });

      return { opportunities, applications };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for volunteer analytics
export const useVolunteerAnalytics = (organizationId: string) => {
  return useQuery({
    queryKey: charityToolsKeys.volunteerAnalytics(organizationId),
    queryFn: () => VolunteerManagementService.getVolunteerAnalytics(organizationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for analytics dashboard - all analytics in one query
export const useCharityAnalytics = (organizationId: string) => {
  return useQuery({
    queryKey: [...charityToolsKeys.all, 'all-analytics', organizationId],
    queryFn: async () => {
      const [donorAnalytics, volunteerAnalytics, grantAnalytics] = await Promise.all([
        DonorManagementService.getDonorAnalytics(organizationId),
        VolunteerManagementService.getVolunteerAnalytics(organizationId),
        GrantManagementService.getGrantAnalytics(organizationId)
      ]);

      return {
        donor: donorAnalytics,
        volunteer: volunteerAnalytics,
        grant: grantAnalytics
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
