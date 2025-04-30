import { z } from "zod";

export const createOfferSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  maxParticipant: z.number().int().positive(),
});
