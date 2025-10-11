import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface AccountContextType {
  accountType: 'personal' | 'organization';
  organizationId: string | null;
  setAccount: (type: 'personal' | 'organization', orgId?: string) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [accountType, setAccountType] = useState<'personal' | 'organization'>('personal');
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  // Sync with URL params
  useEffect(() => {
    const context = searchParams.get('context');
    const orgId = searchParams.get('orgId');
    
    if (context === 'org' && orgId) {
      setAccountType('organization');
      setOrganizationId(orgId);
    } else {
      setAccountType('personal');
      setOrganizationId(null);
    }
  }, [searchParams]);

  const setAccount = (type: 'personal' | 'organization', orgId?: string) => {
    setAccountType(type);
    setOrganizationId(orgId || null);
  };

  return (
    <AccountContext.Provider value={{ accountType, organizationId, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
