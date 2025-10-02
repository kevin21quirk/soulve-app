import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { useNotificationTemplates, NotificationTemplate } from '@/hooks/useNotificationTemplates';

const NotificationTemplatesManager = () => {
  const { templates, loading, createTemplate } = useNotificationTemplates();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'system',
    title_template: '',
    message_template: '',
    default_priority: 'normal' as 'urgent' | 'high' | 'normal' | 'low',
    default_action_type: '',
    metadata_schema: {},
    is_active: true,
  });

  const handleCreate = async () => {
    await createTemplate(formData);
    setShowCreateDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'system',
      title_template: '',
      message_template: '',
      default_priority: 'normal',
      default_action_type: '',
      metadata_schema: {},
      is_active: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Templates</h2>
          <p className="text-muted-foreground">
            Create and manage reusable notification templates
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading templates...</div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates created yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowCreateDialog(true)}
              >
                Create Your First Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant={template.is_active ? 'default' : 'secondary'}>
                    {template.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge
                      variant={
                        template.default_priority === 'urgent'
                          ? 'destructive'
                          : template.default_priority === 'high'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {template.default_priority}
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Title Template:</p>
                    <p className="text-xs font-mono bg-muted p-2 rounded">
                      {template.title_template}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Message Template:</p>
                    <p className="text-xs font-mono bg-muted p-2 rounded line-clamp-3">
                      {template.message_template}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditingTemplate(template);
                      setFormData({
                        name: template.name,
                        description: template.description || '',
                        type: template.type,
                        title_template: template.title_template,
                        message_template: template.message_template,
                        default_priority: template.default_priority,
                        default_action_type: template.default_action_type || '',
                        metadata_schema: template.metadata_schema,
                        is_active: template.is_active,
                      });
                      setShowCreateDialog(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
            <DialogDescription>
              Create a reusable notification template with variable placeholders like {`{{name}}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Welcome Message"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="message">Message</SelectItem>
                    <SelectItem value="follow">Follow</SelectItem>
                    <SelectItem value="comment">Comment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe this template's purpose"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title_template">Title Template *</Label>
              <Input
                id="title_template"
                value={formData.title_template}
                onChange={(e) =>
                  setFormData({ ...formData, title_template: e.target.value })
                }
                placeholder="e.g., Welcome {{name}}!"
              />
              <p className="text-xs text-muted-foreground">
                Use {`{{variableName}}`} for dynamic values
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message_template">Message Template *</Label>
              <Textarea
                id="message_template"
                value={formData.message_template}
                onChange={(e) =>
                  setFormData({ ...formData, message_template: e.target.value })
                }
                placeholder="e.g., Hi {{name}}, thanks for joining {{organizationName}}!"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Use {`{{variableName}}`} for dynamic values
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Default Priority</Label>
                <Select
                  value={formData.default_priority}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      default_priority: value as 'urgent' | 'high' | 'normal' | 'low',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action_type">Action Type</Label>
                <Select
                  value={formData.default_action_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, default_action_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="view">View</SelectItem>
                    <SelectItem value="accept">Accept</SelectItem>
                    <SelectItem value="decline">Decline</SelectItem>
                    <SelectItem value="reply">Reply</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="is_active">Active (users can use this template)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setEditingTemplate(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name || !formData.title_template || !formData.message_template}
            >
              {editingTemplate ? 'Update' : 'Create'} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationTemplatesManager;
