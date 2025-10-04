import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Clock, Award } from "lucide-react";
import { SkillCategory } from '@/types/skillCategories';
import { SkillRateService } from '@/services/skillRateService';
import { SkillCategorySelector } from '@/components/volunteer/SkillCategorySelector';
import { useImpactTracking } from '@/hooks/useImpactTracking';

const SkillsTab = () => {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillCategory | null>(null);
  const [hours, setHours] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [organization, setOrganization] = useState('');
  const [recipientType, setRecipientType] = useState<'organization' | 'individual'>('organization');
  const [postId, setPostId] = useState('');
  const { trackVolunteerWork } = useImpactTracking();

  useEffect(() => {
    loadTopSkills();
  }, []);

  const loadTopSkills = async () => {
    try {
      const data = await SkillRateService.getTopSkillsByRate(9);
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogVolunteerWork = async () => {
    if (!selectedSkill || !hours || !description) return;

    await trackVolunteerWork(
      hours,
      description,
      organization || undefined,
      selectedSkill.id,
      selectedSkill.market_rate_gbp,
      undefined, // evidenceUrl
      recipientType === 'individual' ? postId : undefined
    );

    // Reset form
    setDialogOpen(false);
    setSelectedSkill(null);
    setHours(1);
    setDescription('');
    setOrganization('');
    setRecipientType('organization');
    setPostId('');
  };

  const getDemandBadge = (marketRate: number) => {
    if (marketRate >= 70) return { label: "High", variant: "default" as const };
    if (marketRate >= 40) return { label: "Medium", variant: "secondary" as const };
    return { label: "Standard", variant: "outline" as const };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skills-Based Volunteering</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Use your professional skills to make an impact. Points earned based on market rates.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Award className="h-4 w-4 mr-2" />
                Log Volunteer Work
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] sm:max-h-[90vh] flex flex-col p-0">
              <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
                <DialogTitle>Log Skill-Based Volunteer Work</DialogTitle>
                <DialogDescription>
                  Track your professional volunteer contributions and earn points based on market rates
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Skill Used</Label>
                  <SkillCategorySelector
                    value={selectedSkill?.id}
                    onValueChange={(id, skill) => setSelectedSkill(skill)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours Contributed</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    placeholder="e.g., 2.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you help with?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Who did you help?</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={recipientType === 'organization' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRecipientType('organization')}
                      className="flex-1"
                    >
                      Organization
                    </Button>
                    <Button
                      type="button"
                      variant={recipientType === 'individual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRecipientType('individual')}
                      className="flex-1"
                    >
                      Individual
                    </Button>
                  </div>
                </div>

                {recipientType === 'organization' ? (
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization Name</Label>
                    <Input
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Enter organization name"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="postId">Help Request ID (from their post)</Label>
                    <Input
                      id="postId"
                      value={postId}
                      onChange={(e) => setPostId(e.target.value)}
                      placeholder="Enter the help request ID"
                    />
                    <p className="text-xs text-muted-foreground">
                      The person you helped will receive a notification to confirm your contribution
                    </p>
                  </div>
                )}

                {selectedSkill && hours > 0 && (
                  <div className="rounded-lg border bg-primary/5 p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Market Value:</span>
                      <span className="font-semibold">
                        £{(selectedSkill.market_rate_gbp * hours).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Points Earned:</span>
                      <span className="font-bold text-primary text-lg">
                        +{Math.round(selectedSkill.market_rate_gbp * hours * 0.5)} pts
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 pt-4 flex-shrink-0 border-t">
                <Button 
                  onClick={handleLogVolunteerWork} 
                  className="w-full"
                  disabled={!selectedSkill || !hours || !description}
                >
                  Log Volunteer Work
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              Loading skills...
            </div>
          ) : (
            skills.map((skill) => {
              const demand = getDemandBadge(skill.market_rate_gbp);
              const pointsPerHour = Math.round(skill.market_rate_gbp * 0.5);
              
              return (
                <div 
                  key={skill.id} 
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                  onClick={() => {
                    setSelectedSkill(skill);
                    setDialogOpen(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{skill.name}</h4>
                    <Badge variant={demand.variant}>
                      {demand.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>£{skill.market_rate_gbp}/hour</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Award className="h-4 w-4" />
                      <span>{pointsPerHour} pts/hour</span>
                    </div>

                    {skill.requires_verification && (
                      <Badge variant="outline" className="text-xs">
                        Verification Required
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSkill(skill);
                      setDialogOpen(true);
                    }}
                  >
                    Log Work
                  </Button>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            How It Works
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
            <li>Points are calculated based on professional market rates</li>
            <li>Formula: Points = (Market Rate × Hours) × 0.5</li>
            <li>High-value skills (&gt;£50/hr) may require evidence verification</li>
            <li>Maximum 40 hours per skill per week can be logged</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsTab;
