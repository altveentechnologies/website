import { AdminShell } from "../../admin-shell";
import { TestimonialEditor } from "../testimonial-editor";

export const dynamic = "force-dynamic";

export default function NewTestimonialPage() {
  return (
    <AdminShell
      title="Add review"
      description="Client name, star rating, and what they said about Altveen."
    >
      <TestimonialEditor />
    </AdminShell>
  );
}
