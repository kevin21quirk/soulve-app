
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CampaignFormData } from "@/services/campaignService";

interface PromotionTabProps {
  register: UseFormRegister<CampaignFormData>;
}

const PromotionTab = ({ register }: PromotionTabProps) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="promotion_budget">Promotion Budget</Label>
          <Input
            id="promotion_budget"
            type="number"
            placeholder="Amount to spend on promoting this campaign"
            {...register("promotion_budget", { valueAsNumber: true })}
          />
          <p className="text-sm text-gray-600">
            Set aside budget to boost your campaign's visibility and reach more supporters
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Promotion Features</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Featured placement in search results</li>
            <li>• Social media promotion tools</li>
            <li>• Email marketing templates</li>
            <li>• Analytics and performance tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PromotionTab;
