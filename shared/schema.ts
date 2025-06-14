import { z } from "zod";

export const bypassRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export const bypassResponseSchema = z.object({
  success: z.boolean(),
  originalUrl: z.string(),
  directUrl: z.string().optional(),
  error: z.string().optional(),
});

export type BypassRequest = z.infer<typeof bypassRequestSchema>;
export type BypassResponse = z.infer<typeof bypassResponseSchema>;
