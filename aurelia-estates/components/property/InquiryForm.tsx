"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";
import { fakeSubmit, inquirySchema, type InquiryValues } from "@/lib/schemas";
import { localDateISO } from "@/lib/utils";

/** Book-a-viewing form shown alongside each listing. */
export function InquiryForm({ propertyTitle }: { propertyTitle: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<InquiryValues>({ resolver: zodResolver(inquirySchema), defaultValues: { phone: "" } });
  // Set after mount: the page is prerendered, so a build-time date would go stale.
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => setMinDate(localDateISO()), []);

  if (isSubmitSuccessful) {
    return (
      <div role="status" className="flex flex-col gap-3 py-6">
        <p className="text-title">Viewing requested.</p>
        <p className="text-navy/75">
          Thank you — an advisor will confirm your private viewing of {propertyTitle} within one business day.
        </p>
      </div>
    );
  }

  const describedBy = (field: keyof InquiryValues) => (errors[field] ? `inquiry-${field}-error` : undefined);

  return (
    <form
      onSubmit={handleSubmit(fakeSubmit)}
      noValidate
      className="flex flex-col gap-6"
      aria-label={`Book a viewing of ${propertyTitle}`}
    >
      <Field id="inquiry-name" label="Full name" error={errors.name?.message}>
        <input
          id="inquiry-name"
          autoComplete="name"
          className={inputClass}
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("name")}
          {...register("name")}
        />
      </Field>
      <Field id="inquiry-email" label="Email" error={errors.email?.message}>
        <input
          id="inquiry-email"
          type="email"
          autoComplete="email"
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
          {...register("email")}
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Field id="inquiry-phone" label="Phone (optional)" error={errors.phone?.message}>
          <input
            id="inquiry-phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            {...register("phone")}
          />
        </Field>
        <Field id="inquiry-date" label="Preferred date" error={errors.date?.message}>
          <input
            id="inquiry-date"
            type="date"
            min={minDate}
            className={inputClass}
            aria-invalid={!!errors.date}
            aria-describedby={describedBy("date")}
            {...register("date")}
          />
        </Field>
      </div>
      <Field id="inquiry-message" label="Message (optional)" error={errors.message?.message}>
        <textarea
          id="inquiry-message"
          rows={3}
          className={`${inputClass} resize-none`}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          {...register("message")}
        />
      </Field>
      <Button type="submit" disabled={isSubmitting} magnetic={false} className="w-full">
        {isSubmitting ? "Sending…" : "Book a viewing"}
      </Button>
    </form>
  );
}
