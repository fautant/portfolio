import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  type: z.enum(["job", "freelance", "question", "other"]),
  message: z.string().min(10).max(5000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
