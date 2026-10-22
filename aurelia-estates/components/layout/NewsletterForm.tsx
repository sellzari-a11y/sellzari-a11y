"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { fakeSubmit, newsletterSchema, type NewsletterValues } from "@/lib/schemas";

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async () => {
    await fakeSubmit();
    reset(undefined, { keepIsSubmitSuccessful: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Newsletter signup">
      <label htmlFor="newsletter-email" className="label text-white/70">
        The Private List — new homes before they go public
      </label>
      <div className="mt-4 flex items-center border-b border-white/30 focus-within:border-sand">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          className="w-full bg-transparent py-4 text-lg text-white placeholder:text-white/50 focus:outline-none"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex shrink-0 items-center gap-2 py-4 pl-4 text-sm font-bold text-white transition-colors hover:text-sand"
        >
          {isSubmitting ? "Joining…" : "Subscribe"}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm">
        {errors.email ? (
          <span id="newsletter-email-error" className="text-sand">
            {errors.email.message}
          </span>
        ) : (
          isSubmitSuccessful && <span className="text-white/80">Welcome to the list — watch your inbox.</span>
        )}
      </p>
    </form>
  );
}
