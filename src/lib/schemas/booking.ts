import { z } from "zod";

export const BookingSchema = z.object({
  billboardId: z.number(),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  clientType: z.string().optional(),
  campaignTitle: z.string().min(2, "Campaign title is required"),
  campaignType: z.string(), // simplified for flexibility
  campaignDuration: z.number().min(1),
  startDate: z.string(), // We'll parse this to Date on the server
  endDate: z.string(),   // We'll parse this to Date on the server
  slotsRequested: z.number().default(1),
  description: z.string().optional(),
  advertFile: z.string().optional(),
  totalPrice: z.number(),
  taxRate: z.number().optional(),
  paymentMethod: z.string().optional(),
});

export type BookingInput = z.infer<typeof BookingSchema>;
