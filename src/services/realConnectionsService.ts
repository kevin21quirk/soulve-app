
// Re-export everything for backward compatibility
export type { DatabaseConnection, DatabaseProfile, ConnectionWithProfiles } from "@/types/realConnections";
export { useRealConnections } from "@/hooks/useRealConnections";
export { useSuggestedConnections } from "@/hooks/useSuggestedConnections";
export { useSendConnectionRequest } from "@/hooks/useSendConnectionRequest";
export { useRespondToConnection } from "@/hooks/useRespondToConnection";
