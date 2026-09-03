import { notFound } from "next/navigation";

import { getClientById } from "@/lib/clients";
import { AdminShell } from "../../admin-shell";
import { ClientEditor } from "../client-editor";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) notFound();

  return (
    <AdminShell title="Edit client" description={client.name}>
      <ClientEditor client={client} />
    </AdminShell>
  );
}
