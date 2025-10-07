import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FlaggedKeyword {
  id: string;
  keyword: string;
  category: string;
  severity: string;
  requires_immediate_escalation: boolean;
  is_active: boolean;
  created_at: string;
}

export const KeywordManagementPanel = () => {
  const [keywords, setKeywords] = useState<FlaggedKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    category: 'wellbeing',
    severity: 'medium',
    requiresEscalation: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const { data, error } = await supabase
        .from('safe_space_flagged_keywords')
        .select('*')
        .order('severity', { ascending: false })
        .order('keyword', { ascending: true });

      if (error) throw error;
      setKeywords(data || []);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch keywords',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = async () => {
    if (!newKeyword.keyword.trim()) {
      toast({
        title: 'Keyword Required',
        description: 'Please enter a keyword',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('safe_space_flagged_keywords')
        .insert({
          keyword: newKeyword.keyword.toLowerCase().trim(),
          category: newKeyword.category,
          severity: newKeyword.severity,
          requires_immediate_escalation: newKeyword.requiresEscalation,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: 'Keyword Added',
        description: `"${newKeyword.keyword}" is now monitored`
      });

      setNewKeyword({
        keyword: '',
        category: 'wellbeing',
        severity: 'medium',
        requiresEscalation: false
      });
      setShowAddForm(false);
      fetchKeywords();
    } catch (error: any) {
      console.error('Error adding keyword:', error);
      toast({
        title: 'Error',
        description: error.message?.includes('duplicate') 
          ? 'This keyword already exists' 
          : 'Failed to add keyword',
        variant: 'destructive'
      });
    }
  };

  const toggleKeywordStatus = async (keywordId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('safe_space_flagged_keywords')
        .update({ is_active: !currentStatus })
        .eq('id', keywordId);

      if (error) throw error;

      setKeywords(prev => prev.map(k =>
        k.id === keywordId ? { ...k, is_active: !currentStatus } : k
      ));

      toast({
        title: currentStatus ? 'Keyword Disabled' : 'Keyword Enabled',
        description: 'Keyword status updated'
      });
    } catch (error) {
      console.error('Error toggling keyword:', error);
      toast({
        title: 'Error',
        description: 'Failed to update keyword',
        variant: 'destructive'
      });
    }
  };

  const deleteKeyword = async (keywordId: string, keyword: string) => {
    if (!confirm(`Are you sure you want to delete "${keyword}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('safe_space_flagged_keywords')
        .delete()
        .eq('id', keywordId);

      if (error) throw error;

      setKeywords(prev => prev.filter(k => k.id !== keywordId));
      toast({
        title: 'Keyword Deleted',
        description: `"${keyword}" removed from monitoring`
      });
    } catch (error) {
      console.error('Error deleting keyword:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete keyword',
        variant: 'destructive'
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const groupedKeywords = keywords.reduce((acc, keyword) => {
    if (!acc[keyword.category]) acc[keyword.category] = [];
    acc[keyword.category].push(keyword);
    return acc;
  }, {} as Record<string, FlaggedKeyword[]>);

  if (loading) {
    return <div className="p-8">Loading keywords...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            Crisis Keyword Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage automated detection keywords for Safe Space monitoring
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Keyword
        </Button>
      </div>

      {/* Add Keyword Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Keyword</CardTitle>
            <CardDescription>Add a keyword or phrase to monitor in conversations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyword">Keyword or Phrase</Label>
              <Input
                id="keyword"
                placeholder="e.g., feeling hopeless"
                value={newKeyword.keyword}
                onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newKeyword.category} 
                  onValueChange={(val) => setNewKeyword({ ...newKeyword, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self_harm">Self Harm</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="wellbeing">Wellbeing</SelectItem>
                    <SelectItem value="abuse">Abuse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select 
                  value={newKeyword.severity} 
                  onValueChange={(val) => setNewKeyword({ ...newKeyword, severity: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="escalation"
                checked={newKeyword.requiresEscalation}
                onCheckedChange={(checked) => setNewKeyword({ ...newKeyword, requiresEscalation: checked })}
              />
              <Label htmlFor="escalation">Requires Immediate Escalation</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={addKeyword}>
                Add Keyword
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords by Category */}
      <div className="space-y-6">
        {Object.entries(groupedKeywords).map(([category, categoryKeywords]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category.replace(/_/g, ' ')}</CardTitle>
              <CardDescription>{categoryKeywords.length} keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categoryKeywords.map(keyword => (
                  <div
                    key={keyword.id}
                    className={`p-3 rounded-lg border ${keyword.is_active ? 'bg-background' : 'bg-muted opacity-60'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{keyword.keyword}</span>
                      <Switch
                        checked={keyword.is_active}
                        onCheckedChange={() => toggleKeywordStatus(keyword.id, keyword.is_active)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className={getSeverityColor(keyword.severity)} variant="secondary">
                        {keyword.severity}
                      </Badge>
                      {keyword.requires_immediate_escalation && (
                        <Badge variant="destructive" className="text-xs">
                          Immediate
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive"
                      onClick={() => deleteKeyword(keyword.id, keyword.keyword)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};