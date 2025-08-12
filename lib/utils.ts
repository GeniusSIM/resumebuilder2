import { z } from "zod";

export const ResumeSchema = z.object({
  basics: z.object({
    fullName: z.string().min(1),
    title: z.string().optional().default(""),
    email: z.string().email().optional().default(""),
    phone: z.string().optional().default(""),
    location: z.string().optional().default(""),
    website: z.string().optional().default("")
  }),
  summary: z.string().optional().default(""),
  skills: z.array(z.object({ name: z.string(), level: z.number().min(1).max(5).optional() })).optional().default([]),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(),
    end: z.string().optional(),
    bullets: z.array(z.string()).optional().default([])
  })).optional().default([]),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    start: z.string(),
    end: z.string().optional()
  })).optional().default([]),
  projects: z.array(z.object({
    name: z.string(),
    link: z.string().optional(),
    bullets: z.array(z.string()).optional().default([])
  })).optional().default([])
});

export type ResumeData = z.infer<typeof ResumeSchema>;
