
import DatabaseNetworkSearch from "./DatabaseNetworkSearch";
import DatabaseNetworkAnalytics from "./DatabaseNetworkAnalytics";

interface ConnectionsOverlaysProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  connectedPeople: any[];
  suggestedConnections: any[];
}

const ConnectionsOverlays = ({
  showSearch,
  setShowSearch,
  showAnalytics,
  setShowAnalytics,
  connectedPeople,
  suggestedConnections,
}: ConnectionsOverlaysProps) => {
  return (
    <>
      {showSearch && (
        <DatabaseNetworkSearch
          connectedPeople={connectedPeople}
          suggestedConnections={suggestedConnections}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showAnalytics && (
        <DatabaseNetworkAnalytics
          connectedPeople={connectedPeople}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </>
  );
};

export default ConnectionsOverlays;
