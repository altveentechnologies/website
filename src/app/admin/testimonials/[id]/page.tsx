import { notFound } from "next/navigation";

import { getTestimonialById } from "@/lib/testimonials";
import { AdminShell } from "../../admin-shell";
import { TestimonialEditor } from "../testimonial-editor";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  if (!testimonial) notFound();

  return (
    <AdminShell title="Edit review" description={testimonial.client_name}>
      <TestimonialEditor testimonial={testimonial} />
    </AdminShell>
  );
}
