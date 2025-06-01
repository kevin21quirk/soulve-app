
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useNetworkNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigateToDiscover = () => {
    navigate('/dashboard?tab=discover');
    toast({
      title: "Discover People",
      description: "Find new connections in your community",
    });
  };

  const navigateToConnections = () => {
    navigate('/dashboard?tab=connections');
    toast({
      title: "Manage Connections",
      description: "Review your pending connection requests",
    });
  };

  const navigateToGroups = () => {
    navigate('/dashboard?tab=groups');
    toast({
      title: "Explore Groups",
      description: "Find communities that match your interests",
    });
  };

  const navigateToCampaigns = () => {
    navigate('/dashboard?tab=campaigns');
    toast({
      title: "Join Campaigns",
      description: "Participate in community initiatives",
    });
  };

  const navigateToProfile = () => {
    navigate('/profile');
    toast({
      title: "Complete Profile",
      description: "Add more details to improve recommendations",
    });
  };

  return {
    navigateToDiscover,
    navigateToConnections,
    navigateToGroups,
    navigateToCampaigns,
    navigateToProfile,
  };
};
