
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface SkillsManagerProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  isEditing: boolean;
}

const SkillsManager = ({ skills, onAddSkill, onRemoveSkill, isEditing }: SkillsManagerProps) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAddSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Skills</Label>
      
      {isEditing && (
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a skill..."
            className="flex-1"
          />
          <Button 
            onClick={handleAddSkill} 
            size="sm"
            disabled={!newSkill.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="flex items-center gap-1"
          >
            {skill}
            {isEditing && (
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => onRemoveSkill(skill)}
              />
            )}
          </Badge>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-gray-500">
            {isEditing ? "Add skills to help others find you" : "No skills added yet"}
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
