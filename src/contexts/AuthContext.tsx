
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.id);
        
        // Handle token refresh events
        if (event === 'TOKEN_REFRESHED') {
          console.log('✅ Token refreshed successfully');
        }
        
        // Handle sign out and user deletion
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          console.log('🔓 User signed out or deleted');
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        // Handle token refresh failure - critical for fixing infinite loop
        if (event === 'TOKEN_REFRESH_FAILED') {
          console.error('🔴 Token refresh failed - invalid or expired session, signing out');
          // Clear invalid session and force sign out
          await supabase.auth.signOut();
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        // Update state for all other events
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Only set loading to false after initialization
          if (initialized) {
            setLoading(false);
          }
        }
      }
    );

    // THEN initialize auth state
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Error getting initial session:', error);
            // If session is invalid, clear it
            if (error.message?.includes('session') || error.message?.includes('JWT')) {
              console.error('🔴 Invalid session detected, clearing...');
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
            }
          } else {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
          }
          
          setLoading(false);
          setInitialized(true);
        }
      } catch (error: any) {
        console.error('❌ Error in auth initialization:', error);
        
        // Check if it's a connection error
        const isConnectionError = 
          error.message?.includes('upstream') || 
          error.message?.includes('503') ||
          error.message?.includes('connect') ||
          error.name === 'NetworkError';
          
        if (isConnectionError) {
          console.error('🔴 Backend connection error detected - Supabase backend may be down or experiencing issues');
        }
        
        // Check for session/token errors
        const isSessionError = 
          error.message?.includes('session') ||
          error.message?.includes('JWT') ||
          error.message?.includes('token');
          
        if (isSessionError) {
          console.error('🔴 Session error detected, clearing invalid session');
          await supabase.auth.signOut();
        }
        
        if (mounted) {
          setSession(null);
          setUser(null);
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
  }, [initialized]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
