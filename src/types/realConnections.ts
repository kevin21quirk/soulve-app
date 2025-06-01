
export interface DatabaseConnection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
}

export interface ConnectionWithProfiles extends DatabaseConnection {
  requester: DatabaseProfile | null;
  addressee: DatabaseProfile | null;
}
