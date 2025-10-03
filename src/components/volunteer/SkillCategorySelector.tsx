import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { SkillCategory } from '@/types/skillCategories';
import { SkillRateService } from '@/services/skillRateService';
import { cn } from '@/lib/utils';

interface SkillCategorySelectorProps {
  value?: string;
  onValueChange: (value: string, skill: SkillCategory) => void;
  placeholder?: string;
}

export const SkillCategorySelector = ({ 
  value, 
  onValueChange,
  placeholder = "Select skill..." 
}: SkillCategorySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    if (value && skills.length > 0) {
      const skill = skills.find(s => s.id === value);
      if (skill) setSelectedSkill(skill);
    }
  }, [value, skills]);

  const loadSkills = async () => {
    try {
      const data = await SkillRateService.getSkillCategories();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillCategory[]>);

  const categoryNames: Record<string, string> = {
    professional_services: 'Professional Services',
    technology: 'Technology',
    creative: 'Creative',
    marketing: 'Marketing',
    management: 'Management',
    education: 'Education',
    healthcare: 'Healthcare',
    trades: 'Trades',
    general: 'General',
    caregiving: 'Caregiving'
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedSkill ? (
              <div className="flex items-center gap-2">
                <span>{selectedSkill.name}</span>
                <Badge variant="secondary" className="text-xs">
                  £{selectedSkill.market_rate_gbp}/hr
                </Badge>
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search skills..." />
            <CommandEmpty>No skill found.</CommandEmpty>
            <div className="max-h-[200px] sm:max-h-[300px] overflow-y-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <CommandGroup 
                  key={category} 
                  heading={categoryNames[category] || category}
                >
                  {categorySkills.map((skill) => (
                    <CommandItem
                      key={skill.id}
                      value={skill.name}
                      onSelect={() => {
                        onValueChange(skill.id, skill);
                        setSelectedSkill(skill);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === skill.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center justify-between w-full">
                        <span>{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            £{skill.market_rate_gbp}/hr
                          </Badge>
                          {skill.requires_verification && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedSkill && (
        <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Market Rate:</span>
            <span className="font-semibold">£{selectedSkill.market_rate_gbp}/hour</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Points Rate:</span>
            <span className="font-semibold text-primary">
              {(selectedSkill.market_rate_gbp * 0.5).toFixed(1)} pts/hour
            </span>
          </div>
          {selectedSkill.description && (
            <p className="text-xs text-muted-foreground pt-1 border-t">
              {selectedSkill.description}
            </p>
          )}
          {selectedSkill.evidence_required && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-3 w-3" />
              <span>Evidence required for this skill</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
