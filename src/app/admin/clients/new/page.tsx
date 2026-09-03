import { AdminShell } from "../../admin-shell";
import { ClientEditor } from "../client-editor";

export const dynamic = "force-dynamic";

export default function NewClientPage() {
  return (
    <AdminShell
      title="Add client"
      description="Appears on /clients, and in the home-page scroller if enabled."
    >
      <ClientEditor />
    </AdminShell>
  );
}
