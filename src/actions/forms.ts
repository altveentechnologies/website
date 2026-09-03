"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail } from "@/lib/mail";
import { isValidEmail } from "@/lib/utils";
import type { FormState } from "@/lib/types";

const GENERIC_ERROR =
  "Something went wrong on our side. Please try again, or email us directly.";

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// ---------------------------------------------------------------------------
// Consultation request (home / services / clients CTA)
// ---------------------------------------------------------------------------
export async function submitConsultation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const countryCode = field(formData, "country_code") || "+91";
  const phone = field(formData, "phone");
  const services = formData
    .getAll("services")
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  const sourcePage = field(formData, "source_page") || null;

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please tell us your name.";
  if (!email) errors.email = "Please enter your email.";
  else if (!isValidEmail(email)) errors.email = "That email doesn't look right.";
  if (!phone) errors.phone = "Please enter a phone number.";
  if (services.length === 0) errors.services = "Select at least one service.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  const fullPhone = `${countryCode} ${phone}`;
  const supabase = createAdminClient();

  if (!supabase) {
    console.error("[consultation] Supabase not configured");
    return { status: "error", message: GENERIC_ERROR };
  }

  const { error } = await supabase.from("consultation_requests").insert({
    name,
    email,
    phone: fullPhone,
    services,
    source_page: sourcePage,
  });

  if (error) {
    console.error("[consultation] insert failed:", error.message);
    return { status: "error", message: GENERIC_ERROR };
  }

  await sendNotificationEmail("New consultation request, Altveen", [
    "New consultation request",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${fullPhone}`,
    `Services: ${services.join(", ")}`,
    `Page: ${sourcePage ?? "-"}`,
  ]);

  return {
    status: "success",
    message:
      "Thank you! We've received your request and will get back to you within one business day.",
  };
}

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------
export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const company = field(formData, "company");
  const message = field(formData, "message");

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please tell us your name.";
  if (!email) errors.email = "Please enter your email.";
  else if (!isValidEmail(email)) errors.email = "That email doesn't look right.";
  if (!message) errors.message = "Please add a short message.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  const supabase = createAdminClient();

  if (!supabase) {
    console.error("[contact] Supabase not configured");
    return { status: "error", message: GENERIC_ERROR };
  }

  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    company: company || null,
    message,
  });

  if (error) {
    console.error("[contact] insert failed:", error.message);
    return { status: "error", message: GENERIC_ERROR };
  }

  await sendNotificationEmail("Contact form, Altveen", [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "(not provided)"}`,
    "",
    "Message:",
    message,
  ]);

  return {
    status: "success",
    message:
      "Thank you! We've received your message and will get back to you soon.",
  };
}

// ---------------------------------------------------------------------------
// Newsletter signup
// ---------------------------------------------------------------------------
export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = field(formData, "email");
  const sourcePage = field(formData, "source_page") || null;

  if (!email || !isValidEmail(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      errors: { email: "Please enter a valid email address." },
    };
  }

  const supabase = createAdminClient();

  if (!supabase) {
    console.error("[newsletter] Supabase not configured");
    return { status: "error", message: GENERIC_ERROR };
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, source_page: sourcePage }, { onConflict: "email" });

  if (error) {
    console.error("[newsletter] upsert failed:", error.message);
    return { status: "error", message: GENERIC_ERROR };
  }

  await sendNotificationEmail("Newsletter signup, Altveen", [
    "New newsletter subscriber",
    "",
    `Email: ${email}`,
    `Page: ${sourcePage ?? "-"}`,
  ]);

  return {
    status: "success",
    message: "Thanks for subscribing. We'll be in touch.",
  };
}
