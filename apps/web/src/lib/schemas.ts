import { z } from "zod";

export const ExtractionSchema = z.object({
  age: z.number().optional(),
  symptoms: z.array(z.string()),
  duration: z.string().optional(),
  medicalHistory: z.array(z.string()).optional(),
  conditions: z.array(
    z.object({
      name: z.string(),
      probability: z.number(),
      reason: z.string().optional(),
    })
  ),
  readyToSearch: z.boolean(),
});

export const TrialSchema = z.object({
  nctId: z.string(),
  title: z.string(),
  status: z.enum([
    "RECRUITING",
    "ENROLLING_BY_INVITATION",
    "ACTIVE_NOT_RECRUITING",
    "COMPLETED",
    "TERMINATED",
  ]),
  conditions: z.array(z.string()),
  phase: z.string().optional(),
  location: z.string().optional(),
  eligibility: z.string().optional(),
  url: z.string(),
});

export const RankedTrialSchema = TrialSchema.extend({
  relevanceScore: z.number(),
  matchReasons: z.array(z.string()),
});

export type Extraction = z.infer<typeof ExtractionSchema>;
export type Trial = z.infer<typeof TrialSchema>;
export type RankedTrial = z.infer<typeof RankedTrialSchema>;
