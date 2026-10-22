import { z } from "zod";
import { localDateISO } from "./utils";

const email = z.email("Enter a valid email address");
const name = z.string().trim().min(2, "Please enter your full name");
const phone = z
  .string()
  .trim()
  .regex(/^[+()\d\s-]{7,20}$/, "Enter a valid phone number")
  .or(z.literal(""));

export const newsletterSchema = z.object({ email });
export type NewsletterValues = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  name,
  email,
  phone,
  interest: z.enum(["Buying", "Selling", "Renting", "Investing", "Other"], {
    error: "Choose what you’re interested in",
  }),
  message: z.string().trim().min(20, "Tell us a little more (20 characters minimum)"),
  consent: z.literal(true, { error: "Please accept the privacy policy" }),
});
export type ContactValues = z.infer<typeof contactSchema>;

export const inquirySchema = z.object({
  name,
  email,
  phone,
  date: z
    .string()
    .min(1, "Choose a preferred date")
    // Compare as YYYY-MM-DD strings: parsing with new Date() treats the value as UTC
    // midnight, which rejects "today" for visitors west of UTC.
    .refine((value) => value >= localDateISO(), "Choose today or a later date"),
  message: z.string().trim().max(600, "Keep it under 600 characters").optional(),
});
export type InquiryValues = z.infer<typeof inquirySchema>;

/** Stand-in for a real API call; swap for your CRM or form endpoint. */
export function fakeSubmit() {
  return new Promise((resolve) => setTimeout(resolve, 900));
}
