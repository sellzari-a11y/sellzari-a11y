"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";
import { contactSchema, fakeSubmit, type ContactValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const interests = contactSchema.shape.interest.options;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { phone: "" } });
  const selected = watch("interest");
  const describedBy = (field: keyof ContactValues) => (errors[field] ? `contact-${field}-error` : undefined);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isSubmitSuccessful ? (
        <m.div
          key="done"
          role="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-6 py-10"
        >
          <p className="text-headline">Thank you.</p>
          <p className="max-w-md text-lg text-navy/75">
            Your message is with our team. An advisor will be in touch within one business day.
          </p>
          <Button variant="outline" onClick={() => reset()} icon={false}>
            Send another message
          </Button>
        </m.div>
      ) : (
        <m.form
          key="form"
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit(fakeSubmit)}
          noValidate
          aria-label="Contact form"
          className="flex flex-col gap-8"
        >
          <fieldset>
            <legend className="label text-navy/80">I’m interested in</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <label key={interest}>
                  <input
                    type="radio"
                    value={interest}
                    className="peer sr-only"
                    aria-describedby={describedBy("interest")}
                    {...register("interest")}
                  />
                  <span
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-sm font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-royal",
                      selected === interest ? "border-navy bg-navy text-white" : "border-navy/20 hover:border-navy",
                    )}
                  >
                    {interest}
                  </span>
                </label>
              ))}
            </div>
            {errors.interest && (
              <p id="contact-interest-error" role="alert" className="mt-2 text-sm text-red-700">
                {errors.interest.message}
              </p>
            )}
          </fieldset>

          <div className="grid gap-8 sm:grid-cols-2">
            <Field id="contact-name" label="Full name" error={errors.name?.message}>
              <input
                id="contact-name"
                autoComplete="name"
                className={inputClass}
                aria-invalid={!!errors.name}
                aria-describedby={describedBy("name")}
                {...register("name")}
              />
            </Field>
            <Field id="contact-email" label="Email" error={errors.email?.message}>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                className={inputClass}
                aria-invalid={!!errors.email}
                aria-describedby={describedBy("email")}
                {...register("email")}
              />
            </Field>
          </div>
          <Field id="contact-phone" label="Phone (optional)" error={errors.phone?.message}>
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              className={inputClass}
              aria-invalid={!!errors.phone}
              aria-describedby={describedBy("phone")}
              {...register("phone")}
            />
          </Field>
          <Field id="contact-message" label="How can we help?" error={errors.message?.message}>
            <textarea
              id="contact-message"
              rows={5}
              className={`${inputClass} resize-none`}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy("message")}
              {...register("message")}
            />
          </Field>

          <div>
            <label className="flex items-start gap-3 text-sm text-navy/80">
              <input
                type="checkbox"
                className="mt-0.5 size-5 shrink-0 accent-royal"
                aria-invalid={!!errors.consent}
                aria-describedby={describedBy("consent")}
                {...register("consent")}
              />
              <span>I agree to be contacted about my enquiry and accept the privacy policy.</span>
            </label>
            {errors.consent && (
              <p id="contact-consent-error" role="alert" className="mt-2 text-sm text-red-700">
                {errors.consent.message}
              </p>
            )}
          </div>

          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </div>
        </m.form>
      )}
    </AnimatePresence>
  );
}
