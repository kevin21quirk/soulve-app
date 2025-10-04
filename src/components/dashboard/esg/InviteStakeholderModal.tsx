import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, X, Send } from "lucide-react";
import { useSendESGInvitation, useESGFrameworks, useESGIndicators } from "@/services/esgService";

interface InviteStakeholderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

const InviteStakeholderModal = ({ open, onOpenChange, organizationId }: InviteStakeholderModalProps) => {
  const [stakeholderEmail, setStakeholderEmail] = useState("");
  const [stakeholderOrgName, setStakeholderOrgName] = useState("");
  const [stakeholderType, setStakeholderType] = useState("charity");
  const [frameworkId, setFrameworkId] = useState("");
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const [priority, setPriority] = useState("medium");
  const [requestMessage, setRequestMessage] = useState("");

  const { data: frameworks } = useESGFrameworks();
  const { data: indicators } = useESGIndicators(frameworkId);
  const sendInvitation = useSendESGInvitation();

  const handleSubmit = async () => {
    if (!stakeholderEmail || !stakeholderOrgName || !frameworkId || selectedIndicators.length === 0) {
      return;
    }

    await sendInvitation.mutateAsync({
      organizationId,
      stakeholderEmail,
      stakeholderOrgName,
      stakeholderType,
      frameworkId,
      indicatorIds: selectedIndicators,
      dueDate: dueDate?.toISOString(),
      priority,
      requestMessage
    });

    // Reset form
    setStakeholderEmail("");
    setStakeholderOrgName("");
    setSelectedIndicators([]);
    setDueDate(undefined);
    setRequestMessage("");
    onOpenChange(false);
  };

  const toggleIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indicatorId)
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Stakeholder to Contribute ESG Data</DialogTitle>
          <DialogDescription>
            Request ESG data from charities, suppliers, or partners in your ecosystem
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Stakeholder Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@charity.org"
                value={stakeholderEmail}
                onChange={(e) => setStakeholderEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                placeholder="Green Earth Foundation"
                value={stakeholderOrgName}
                onChange={(e) => setStakeholderOrgName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Stakeholder Type</Label>
              <Select value={stakeholderType} onValueChange={setStakeholderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charity">Charity/Foundation</SelectItem>
                  <SelectItem value="supplier">Supply Chain Partner</SelectItem>
                  <SelectItem value="partner">Strategic Partner</SelectItem>
                  <SelectItem value="community">Community Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="framework">ESG Framework *</Label>
            <Select value={frameworkId} onValueChange={setFrameworkId}>
              <SelectTrigger>
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {frameworks?.map(framework => (
                  <SelectItem key={framework.id} value={framework.id}>
                    {framework.name} ({framework.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {frameworkId && (
            <div>
              <Label>Select Indicators * ({selectedIndicators.length} selected)</Label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                {indicators?.map(indicator => (
                  <div key={indicator.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={indicator.id}
                      checked={selectedIndicators.includes(indicator.id)}
                      onChange={() => toggleIndicator(indicator.id)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={indicator.id} className="flex-1 cursor-pointer text-sm">
                      {indicator.name}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {indicator.category}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="message">Request Message</Label>
            <Textarea
              id="message"
              placeholder="Please provide the requested ESG data for our sustainability report..."
              rows={3}
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!stakeholderEmail || !stakeholderOrgName || !frameworkId || selectedIndicators.length === 0 || sendInvitation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {sendInvitation.isPending ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteStakeholderModal;