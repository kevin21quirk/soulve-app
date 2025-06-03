
import { useState, useCallback } from 'react';

export interface PostTemplate {
  id: string;
  name: string;
  description: string;
  category: 'help_request' | 'offer_help' | 'community_update' | 'event' | 'campaign';
  template: string;
  fields: TemplateField[];
  popularity: number;
}

export interface TemplateField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'location';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

const DEFAULT_TEMPLATES: PostTemplate[] = [
  {
    id: 'help-moving',
    name: 'Moving Help Request',
    description: 'Request help for moving furniture and belongings',
    category: 'help_request',
    template: 'I need help moving {items} from {fromLocation} to {toLocation} on {date}. Looking for {numberOfPeople} people to help. Will provide {compensation}.',
    fields: [
      { name: 'items', type: 'text', label: 'What needs to be moved', required: true, placeholder: 'furniture, boxes, etc.' },
      { name: 'fromLocation', type: 'location', label: 'Moving from', required: true, placeholder: 'Current address' },
      { name: 'toLocation', type: 'location', label: 'Moving to', required: true, placeholder: 'New address' },
      { name: 'date', type: 'date', label: 'Moving date', required: true, placeholder: 'Select date' },
      { name: 'numberOfPeople', type: 'select', label: 'Number of helpers needed', required: true, options: ['1-2 people', '3-4 people', '5+ people'] },
      { name: 'compensation', type: 'text', label: 'Compensation offered', required: false, placeholder: 'Pizza and drinks, hourly pay, etc.' }
    ],
    popularity: 95
  },
  {
    id: 'food-assistance',
    name: 'Food Assistance Request',
    description: 'Request help with food or grocery needs',
    category: 'help_request',
    template: 'I am in need of {assistanceType} for {duration}. I have {familySize} family members including {children} children. Any help with {specificNeeds} would be greatly appreciated.',
    fields: [
      { name: 'assistanceType', type: 'select', label: 'Type of assistance', required: true, options: ['Prepared meals', 'Groceries', 'Food vouchers', 'Restaurant gift cards'] },
      { name: 'duration', type: 'select', label: 'Duration of need', required: true, options: ['1-2 days', '1 week', '2-3 weeks', 'Ongoing'] },
      { name: 'familySize', type: 'select', label: 'Family size', required: true, options: ['1 person', '2 people', '3-4 people', '5+ people'] },
      { name: 'children', type: 'select', label: 'Number of children', required: false, options: ['0', '1', '2', '3+'] },
      { name: 'specificNeeds', type: 'textarea', label: 'Specific dietary needs or preferences', required: false, placeholder: 'Allergies, dietary restrictions, preferred foods...' }
    ],
    popularity: 88
  },
  {
    id: 'offer-tutoring',
    name: 'Tutoring Offer',
    description: 'Offer tutoring or educational help',
    category: 'offer_help',
    template: 'I am offering {subject} tutoring for {gradeLevel} students. I have {experience} and am available {schedule}. Sessions can be {format} and I charge {rate}.',
    fields: [
      { name: 'subject', type: 'text', label: 'Subject(s)', required: true, placeholder: 'Math, Science, English, etc.' },
      { name: 'gradeLevel', type: 'select', label: 'Grade level', required: true, options: ['Elementary', 'Middle School', 'High School', 'College', 'Adult learners'] },
      { name: 'experience', type: 'text', label: 'Your experience/qualifications', required: true, placeholder: 'Teaching degree, 5 years experience, etc.' },
      { name: 'schedule', type: 'text', label: 'Available schedule', required: true, placeholder: 'Weekends, evenings, flexible, etc.' },
      { name: 'format', type: 'select', label: 'Session format', required: true, options: ['In-person only', 'Online only', 'Both in-person and online'] },
      { name: 'rate', type: 'text', label: 'Rate', required: false, placeholder: 'Free, $20/hour, negotiable, etc.' }
    ],
    popularity: 82
  },
  {
    id: 'community-event',
    name: 'Community Event',
    description: 'Announce a community event or gathering',
    category: 'event',
    template: 'Join us for {eventName} on {date} at {time} located at {venue}. This {eventType} will feature {activities}. {additionalInfo}',
    fields: [
      { name: 'eventName', type: 'text', label: 'Event name', required: true, placeholder: 'Community BBQ, Block Party, etc.' },
      { name: 'date', type: 'date', label: 'Event date', required: true, placeholder: 'Select date' },
      { name: 'time', type: 'text', label: 'Event time', required: true, placeholder: '2:00 PM - 6:00 PM' },
      { name: 'venue', type: 'location', label: 'Event location', required: true, placeholder: 'Park, community center, etc.' },
      { name: 'eventType', type: 'select', label: 'Event type', required: true, options: ['Social gathering', 'Fundraiser', 'Educational workshop', 'Volunteer activity', 'Celebration'] },
      { name: 'activities', type: 'textarea', label: 'Activities/agenda', required: true, placeholder: 'Food, games, live music, speakers, etc.' },
      { name: 'additionalInfo', type: 'textarea', label: 'Additional information', required: false, placeholder: 'RSVP details, what to bring, contact info, etc.' }
    ],
    popularity: 76
  }
];

export const usePostTemplates = () => {
  const [templates] = useState<PostTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});

  const selectTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    setTemplateValues({});
  }, [templates]);

  const updateTemplateValue = useCallback((fieldName: string, value: string) => {
    setTemplateValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  const generatePostContent = useCallback(() => {
    if (!selectedTemplate) return '';

    let content = selectedTemplate.template;
    
    // Replace template placeholders with actual values
    selectedTemplate.fields.forEach(field => {
      const value = templateValues[field.name] || `{${field.name}}`;
      content = content.replace(new RegExp(`{${field.name}}`, 'g'), value);
    });

    return content;
  }, [selectedTemplate, templateValues]);

  const clearTemplate = useCallback(() => {
    setSelectedTemplate(null);
    setTemplateValues({});
  }, []);

  const getTemplatesByCategory = useCallback((category: PostTemplate['category']) => {
    return templates.filter(template => template.category === category);
  }, [templates]);

  const getPopularTemplates = useCallback((limit = 5) => {
    return templates
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }, [templates]);

  return {
    templates,
    selectedTemplate,
    templateValues,
    selectTemplate,
    updateTemplateValue,
    generatePostContent,
    clearTemplate,
    getTemplatesByCategory,
    getPopularTemplates
  };
};
