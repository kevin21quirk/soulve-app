import { z } from 'zod';

export const postCreationSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  content: z.string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be less than 5000 characters')
    .trim(),
  category: z.enum([
    'help-needed',
    'help-offered',
    'announcement',
    'fundraising',
    'volunteer',
    'event',
    'other'
  ]),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').optional(),
  media_urls: z.array(z.string().url()).max(10, 'Maximum 10 media files allowed').optional()
});

export const commentCreationSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be less than 2000 characters')
    .trim(),
  post_id: z.string().uuid('Invalid post ID'),
  parent_comment_id: z.string().uuid('Invalid comment ID').optional()
});

export type PostCreationInput = z.infer<typeof postCreationSchema>;
export type CommentCreationInput = z.infer<typeof commentCreationSchema>;
