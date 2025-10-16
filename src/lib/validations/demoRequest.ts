import { z } from 'zod';

export const demoRequestSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  company_name: z.string().max(100).optional(),
  job_title: z.string().max(100).optional(),
  phone_number: z.string().regex(/^\+?[\d\s\-()]+$/, "Invalid phone number").optional().or(z.literal('')),
  organization_size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
  preferred_date: z.date().optional(),
  preferred_time: z.enum(['morning', 'afternoon', 'evening', 'flexible']).optional(),
  interest_areas: z.array(z.string()).default([]),
  message: z.string().max(500, "Message must be less than 500 characters").optional(),
});

export type DemoRequestFormData = z.infer<typeof demoRequestSchema>;
