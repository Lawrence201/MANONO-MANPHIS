import { z } from "zod";

export const BillboardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  assetCode: z.string().min(1, "Asset code is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().nullish(),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.union([z.string(), z.number()]).transform(v => String(v)),
  longitude: z.union([z.string(), z.number()]).transform(v => String(v)),
  screenType: z.string().default("led"),
  resolution: z.string().default("p6"),
  aspectRatio: z.string().default("landscape"),
  dimensions: z.string().nullish(),
  brightness: z.string().nullish(),
  trafficVolume: z.string().nullish(),
  weeklyRate: z.union([z.string(), z.number()]).transform(v => Number(v) || 0),
  taxRate: z.union([z.string(), z.number()]).transform(v => Number(v) || 0),
  minDuration: z.string().default("1w"),
  wakeTime: z.string().default("06:00"),
  sleepTime: z.string().default("00:00"),
  maxSlots: z.union([z.string(), z.number()]).transform(v => Number(v) || 12),
  slotDuration: z.union([z.string(), z.number()]).transform(v => Number(v) || 10),
  hasLightSensor: z.boolean().default(true),
  hasAudio: z.boolean().default(false),
  hasStreaming: z.boolean().default(true),
  hasClimate: z.boolean().default(true),
  featureImage: z.string().nullish(),
  videoShowcase: z.string().nullish(),
  audienceTags: z.array(z.string()).default([]),
  galleryImages: z.array(
    z.union([
      z.string(),
      z.object({ imagePath: z.string() }).transform(o => o.imagePath)
    ])
  ).default([]),
});

export type BillboardInput = z.infer<typeof BillboardSchema>;
export type BillboardFormValues = z.input<typeof BillboardSchema>;
