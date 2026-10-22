import { z } from "zod";

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
    .refine((value) => new Date(value) >= new Date(new Date().toDateString()), "Choose a date in the future"),
  message: z.string().trim().max(600, "Keep it under 600 characters").optional(),
});
export type InquiryValues = z.infer<typeof inquirySchema>;

/** Stand-in for a real API call; swap for your CRM or form endpoint. */
export function fakeSubmit() {
  return new Promise((resolve) => setTimeout(resolve, 900));
}
