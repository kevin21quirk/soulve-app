
import React from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignFormData } from "@/services/campaignService";

interface GoalsTabProps {
  register: UseFormRegister<CampaignFormData>;
  setValue: UseFormSetValue<CampaignFormData>;
  watch: UseFormWatch<CampaignFormData>;
}

const GoalsTab = ({ register, setValue, watch }: GoalsTabProps) => {
  const goalType = watch('goal_type');

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="goal_type">Goal Type *</Label>
          <Select onValueChange={(value: any) => setValue('goal_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="What are you trying to achieve?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monetary">Monetary</SelectItem>
              <SelectItem value="volunteers">Volunteers</SelectItem>
              <SelectItem value="signatures">Signatures</SelectItem>
              <SelectItem value="participants">Participants</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {goalType === 'monetary' && (
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select onValueChange={(value) => setValue('currency', value)} defaultValue="GBP">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="goal_amount">
            Target {goalType === 'monetary' ? 'Amount' : 
                   goalType === 'volunteers' ? 'Volunteers' :
                   goalType === 'signatures' ? 'Signatures' : 'Participants'}
          </Label>
          <Input
            id="goal_amount"
            type="number"
            placeholder="Enter target number"
            {...register("goal_amount", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            {...register("end_date")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select onValueChange={(value: any) => setValue('urgency', value)} defaultValue="medium">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default GoalsTab;
