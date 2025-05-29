import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { BarChart3 } from "lucide-react";

type Campaign = Database['public']['Tables']['campaigns']['Row'];

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setCampaigns(data);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Campaigns</h2>
        <Button onClick={() => navigate("/campaign-builder")}>Create New Campaign</Button>
      </div>

      {isLoading ? (
        <p>Loading campaigns...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : campaigns?.length === 0 ? (
        <p>No campaigns found. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden flex flex-col">
              {campaign.featured_image ? (
                <img
                  src={campaign.featured_image}
                  alt={campaign.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
                <CardDescription>
                  {campaign.description?.slice(0, 100)}
                  {campaign.description && campaign.description.length > 100 ? "..." : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      variant={
                        campaign.status === "active"
                          ? "default"
                          : campaign.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>

                  {campaign.goal_amount && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>
                          {campaign.current_amount ? (
                            <>
                              ${campaign.current_amount.toLocaleString()} / $
                              {campaign.goal_amount.toLocaleString()}
                            </>
                          ) : (
                            <>$0 / ${campaign.goal_amount.toLocaleString()}</>
                          )}
                        </span>
                      </div>
                      <Progress
                        value={
                          campaign.current_amount
                            ? (campaign.current_amount / campaign.goal_amount) * 100
                            : 0
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <span className="text-sm">{formatCategory(campaign.category)}</span>
                  </div>

                  {campaign.end_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">End Date:</span>
                      <span className="text-sm">
                        {new Date(campaign.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" onClick={() => navigate(`/campaign-builder/${campaign.id}`)}>
                  Edit Campaign
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => navigate(`/campaign-analytics/${campaign.id}`)}
                  className="flex items-center gap-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
