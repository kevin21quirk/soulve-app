import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface Donor {
  id: string;
  avatar?: string;
  name?: string;
  isAnonymous: boolean;
}

interface DonorAvatarListProps {
  donors: Donor[];
  totalCount: number;
}

export const DonorAvatarList = ({ donors, totalCount }: DonorAvatarListProps) => {
  const displayDonors = donors.slice(0, 5);
  const remainingCount = totalCount - displayDonors.length;

  if (totalCount === 0) return null;

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSupportText = () => {
    if (totalCount === 1) {
      const donor = displayDonors[0];
      if (donor.isAnonymous) return '1 person supports this campaign';
      return `${donor.name} supports this campaign`;
    }
    
    if (totalCount === 2) {
      const names = displayDonors
        .filter(d => !d.isAnonymous)
        .map(d => d.name?.split(' ')[0])
        .filter(Boolean);
      
      if (names.length === 2) {
        return `${names[0]} and ${names[1]} support this`;
      }
      return `${names[0] || 'Someone'} and 1 other support this`;
    }

    const firstDonor = displayDonors.find(d => !d.isAnonymous);
    const firstName = firstDonor?.name?.split(' ')[0] || 'Someone';
    
    return `${firstName} and ${totalCount - 1} others support this campaign`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-3"
    >
      {/* Avatar Stack */}
      <div className="flex -space-x-2">
        {displayDonors.map((donor, index) => (
          <motion.div
            key={donor.id}
            initial={{ scale: 0, x: -10 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Avatar className="h-8 w-8 border-2 border-background">
              {donor.isAnonymous ? (
                <AvatarFallback className="bg-muted">
                  <Users className="h-4 w-4" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={donor.avatar} alt={donor.name} />
                  <AvatarFallback>{getInitials(donor.name)}</AvatarFallback>
                </>
              )}
            </Avatar>
          </motion.div>
        ))}
        
        {remainingCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: displayDonors.length * 0.05 }}
          >
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarFallback className="bg-muted text-xs">
                +{remainingCount}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
      </div>

      {/* Support Text */}
      <p className="text-sm text-muted-foreground">
        {getSupportText()}
      </p>
    </motion.div>
  );
};
