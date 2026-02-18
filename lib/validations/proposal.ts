import { z } from "zod";

export const proposalFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional().or(z.literal("")),
  budget: z.enum(["<1000", "1000-5000", "5000-10000", ">10000"]),
  deadline: z.string().min(1),
  description: z.string().min(20).max(10000),
});

export type ProposalFormData = z.infer<typeof proposalFormSchema>;
