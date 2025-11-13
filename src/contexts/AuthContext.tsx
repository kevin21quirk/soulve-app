
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { devLogger as logger } from '@/utils/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  organizationId: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        logger.log('Auth state change:', event, newSession?.user?.id);
        
        if (!mounted) return;
        
        // Handle token refresh success
        if (event === 'TOKEN_REFRESHED') {
          logger.log('✅ Token refreshed successfully');
        }
        
        // If session becomes null (sign out, expired, or invalid)
        if (!newSession) {
          logger.log('🔓 Session cleared - user signed out or session expired');
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Only update state if user ID changed (prevents re-renders on token refresh)
        setSession(newSession);
        setUser(prev => {
          // If same user, keep the existing user object to prevent re-renders
          if (prev?.id === newSession?.user?.id) {
            return prev;
          }
          return newSession?.user ?? null;
        });
        
        // Fetch organization membership
        if (newSession?.user) {
          fetchOrganizationId(newSession.user.id);
        } else {
          setOrganizationId(null);
        }
        
        setLoading(false);
      }
    );

    // Fetch organization ID for user
    const fetchOrganizationId = async (userId: string) => {
      try {
        const { data } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (mounted) {
          setOrganizationId(data?.organization_id ?? null);
        }
      } catch (error) {
        logger.error('Error fetching organization ID:', error);
        if (mounted) {
          setOrganizationId(null);
        }
      }
    };

    // THEN initialize auth state
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            logger.error('Error getting initial session:', error);
            // If session is invalid, clear it
            if (error.message?.includes('session') || error.message?.includes('JWT')) {
              logger.error('🔴 Invalid session detected, clearing...');
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              setOrganizationId(null);
            }
          } else {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            
            // Fetch organization membership
            if (initialSession?.user) {
              await fetchOrganizationId(initialSession.user.id);
            }
          }
          
          setLoading(false);
          setInitialized(true);
        }
      } catch (error: any) {
        logger.error('❌ Error in auth initialization:', error);
        
        // Check if it's a connection error
        const isConnectionError = 
          error.message?.includes('upstream') || 
          error.message?.includes('503') ||
          error.message?.includes('connect') ||
          error.name === 'NetworkError';
          
        if (isConnectionError) {
          logger.error('🔴 Backend connection error detected - Supabase backend may be down or experiencing issues');
        }
        
        // Check for session/token errors
        const isSessionError = 
          error.message?.includes('session') ||
          error.message?.includes('JWT') ||
          error.message?.includes('token');
          
        if (isSessionError) {
          logger.error('🔴 Session error detected, clearing invalid session');
          await supabase.auth.signOut();
        }
        
        if (mounted) {
          setSession(null);
          setUser(null);
          setOrganizationId(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Error signing out:', error);
      }
    } catch (error) {
      logger.error('Error in signOut:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    organizationId,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
