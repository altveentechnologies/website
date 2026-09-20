import Link from "next/link";

import { buttonClass } from "@/components/ui";
import { AdminShell } from "../../admin-shell";
import { SaleEditor } from "../sale-editor";

export const dynamic = "force-dynamic";

export default function NewFinanceSalePage() {
  return (
    <AdminShell
      title="Add sale"
      description="Record what you sold to a company and payment status."
      action={
        <Link href="/admin/finance" className={buttonClass({ variant: "ghost" })}>
          ← Dashboard
        </Link>
      }
    >
      <SaleEditor />
    </AdminShell>
  );
}
