
import { supabase } from "@/integrations/supabase/client";
import type { ConnectionWithProfiles } from "@/types/realConnections";

export const fetchUserConnections = async (): Promise<ConnectionWithProfiles[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  // First get the connections
  const { data: connections, error: connectionsError } = await supabase
    .from('connections')
    .select('*')
    .or(`requester_id.eq.${user.user.id},addressee_id.eq.${user.user.id}`);

  if (connectionsError) throw connectionsError;

  if (!connections || connections.length === 0) {
    return [];
  }

  // Get all unique user IDs from connections
  const userIds = new Set<string>();
  connections.forEach(conn => {
    userIds.add(conn.requester_id);
    userIds.add(conn.addressee_id);
  });

  // Fetch profiles for all users involved in connections
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, location, bio, skills, interests')
    .in('id', Array.from(userIds));

  if (profilesError) throw profilesError;

  // Create a map for quick profile lookup
  const profileMap = new Map();
  (profiles || []).forEach(profile => {
    profileMap.set(profile.id, profile);
  });

  // Combine connections with profile data and properly type the status
  const connectionsWithProfiles: ConnectionWithProfiles[] = connections.map(conn => ({
    ...conn,
    status: conn.status as 'pending' | 'accepted' | 'declined' | 'blocked',
    requester: profileMap.get(conn.requester_id) || null,
    addressee: profileMap.get(conn.addressee_id) || null,
  }));

  return connectionsWithProfiles;
};

export const sendConnectionRequest = async (addresseeId: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('connections')
    .insert({
      requester_id: user.user.id,
      addressee_id: addresseeId,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      recipient_id: addresseeId,
      sender_id: user.user.id,
      type: 'connection_request',
      title: 'New Connection Request',
      message: 'Someone wants to connect with you',
      metadata: { connection_id: data.id }
    });

  return data;
};

export const respondToConnectionRequest = async ({ connectionId, status }: { connectionId: string; status: 'accepted' | 'declined' }) => {
  const { data, error } = await supabase
    .from('connections')
    .update({ status })
    .eq('id', connectionId)
    .select()
    .single();

  if (error) throw error;

  if (status === 'accepted') {
    // Create notification for the requester
    await supabase
      .from('notifications')
      .insert({
        recipient_id: data.requester_id,
        sender_id: data.addressee_id,
        type: 'connection_accepted',
        title: 'Connection Accepted',
        message: 'Your connection request was accepted',
        metadata: { connection_id: data.id }
      });

    // Create activity for both users
    await Promise.all([
      supabase.from('user_activities').insert({
        user_id: data.requester_id,
        activity_type: 'connection_accepted',
        title: 'Connection Accepted',
        description: 'You are now connected with a new person',
        metadata: { connection_id: data.id }
      }),
      supabase.from('user_activities').insert({
        user_id: data.addressee_id,
        activity_type: 'connection_accepted',
        title: 'Connection Accepted',
        description: 'You accepted a connection request',
        metadata: { connection_id: data.id }
      })
    ]);
  }

  return data;
};

export const fetchSuggestedConnections = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  // Get all user IDs that the current user is already connected to or has pending requests with
  const { data: existingConnections } = await supabase
    .from('connections')
    .select('requester_id, addressee_id')
    .or(`requester_id.eq.${user.user.id},addressee_id.eq.${user.user.id}`);

  const connectedUserIds = new Set([
    user.user.id, // Exclude self
    ...(existingConnections || []).flatMap(conn => [conn.requester_id, conn.addressee_id])
  ]);

  // Get profiles not in the connected users list
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, location, bio, skills, interests')
    .not('id', 'in', `(${Array.from(connectedUserIds).join(',')})`)
    .limit(10);

  if (error) throw error;
  return profiles || [];
};
