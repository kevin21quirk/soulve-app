import { useSearchParams } from "react-router-dom";
import EnhancedCampaignBuilder from "../../campaign-builder/EnhancedCampaignBuilder";
import CampaignDetailSheet from "../../campaign-builder/CampaignDetailSheet";

const CampaignsTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign');

  const handleCloseDetail = () => {
    searchParams.delete('campaign');
    setSearchParams(searchParams);
  };

  return (
    <>
      <EnhancedCampaignBuilder />
      <CampaignDetailSheet 
        campaignId={campaignId}
        isOpen={!!campaignId}
        onClose={handleCloseDetail}
      />
    </>
  );
};

export default CampaignsTab;
