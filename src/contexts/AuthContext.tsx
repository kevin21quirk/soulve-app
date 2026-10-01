import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/react';
import { createApiClient, type ApiClient } from '@/lib/apiClient';

// ── Shape compatible with existing consumers ──────────────────────────────
// `user.id` is the Neon profile UUID (not the Clerk ID)
// `session.access_token` is the Clerk JWT token
export interface AppUser {
  id: string;            // Neon profile UUID
  email: string | null;
  clerkId: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  user_type?: string | null;
  waitlist_status?: string | null;
}

export interface AppSession {
  access_token: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: AppSession | null;
  loading: boolean;
  organizationId: string | null;
  signOut: () => Promise<void>;
  api: ApiClient | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

// ── Provider ──────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useClerkAuth();
  const { signOut: clerkSignOut } = useClerk();

  const [appUser, setAppUser]           = useState<AppUser | null>(null);
  const [session, setSession]           = useState<AppSession | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading]           = useState(true);
  const [api, setApi]                   = useState<ApiClient | null>(null);

  const prevClerkId = useRef<string | null>(null);

  // Build the API client once per Clerk session
  const buildApi = useCallback(() => {
    const client = createApiClient(async () => getToken());
    setApi(client);
    return client;
  }, [getToken]);

  useEffect(() => {
    if (!clerkLoaded) return;

    if (!isSignedIn || !clerkUser) {
      setAppUser(null);
      setSession(null);
      setOrganizationId(null);
      setApi(null);
      setLoading(false);
      prevClerkId.current = null;
      return;
    }

    // Avoid re-fetching if same Clerk user
    if (prevClerkId.current === clerkUser.id) return;
    prevClerkId.current = clerkUser.id;

    const syncProfile = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error('No Clerk token');

        setSession({ access_token: token });

        const client = buildApi();

        // Fetch (or implicitly create via webhook) the Neon profile
        const profile = await client.get<AppUser>('/profiles/me');

        setAppUser({
          id:             profile.id,
          email:          profile.email ?? clerkUser.primaryEmailAddress?.emailAddress ?? null,
          clerkId:        clerkUser.id,
          first_name:     profile.first_name,
          last_name:      profile.last_name,
          avatar_url:     profile.avatar_url,
          user_type:      profile.user_type,
          waitlist_status: profile.waitlist_status,
        });

        // Fetch first organization membership
        try {
          const orgs = await client.get<Array<{ organization_id: string }>>('/organizations?limit=1');
          setOrganizationId((orgs as unknown as Array<{ id: string }>)[0]?.id ?? null);
        } catch {
          setOrganizationId(null);
        }
      } catch (err) {
        console.error('[AuthContext] profile sync failed:', err);
        // If profile not found yet (webhook may be delayed) — create minimal user object
        setAppUser({
          id:       '',
          email:    clerkUser.primaryEmailAddress?.emailAddress ?? null,
          clerkId:  clerkUser.id,
        });
      } finally {
        setLoading(false);
      }
    };

    syncProfile();
  }, [clerkLoaded, isSignedIn, clerkUser, getToken, buildApi]);

  // Timeout fallback — never hang the UI
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const signOut = useCallback(async () => {
    await clerkSignOut();
    setAppUser(null);
    setSession(null);
    setOrganizationId(null);
    setApi(null);
  }, [clerkSignOut]);

  return (
    <AuthContext.Provider value={{
      user: appUser,
      session,
      loading,
      organizationId,
      signOut,
      api,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
