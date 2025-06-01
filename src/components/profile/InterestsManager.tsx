
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface InterestsManagerProps {
  interests: string[];
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (interest: string) => void;
  isEditing: boolean;
}

const InterestsManager = ({ interests, onAddInterest, onRemoveInterest, isEditing }: InterestsManagerProps) => {
  const [newInterest, setNewInterest] = useState('');

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      onAddInterest(newInterest.trim());
      setNewInterest('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Interests</Label>
      
      {isEditing && (
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add an interest..."
            className="flex-1"
          />
          <Button 
            onClick={handleAddInterest} 
            size="sm"
            disabled={!newInterest.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="flex items-center gap-1"
          >
            {interest}
            {isEditing && (
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => onRemoveInterest(interest)}
              />
            )}
          </Badge>
        ))}
        {interests.length === 0 && (
          <p className="text-sm text-gray-500">
            {isEditing ? "Add interests to connect with like-minded people" : "No interests added yet"}
          </p>
        )}
      </div>
    </div>
  );
};

export default InterestsManager;
