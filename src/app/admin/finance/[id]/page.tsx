import Link from "next/link";
import { notFound } from "next/navigation";

import { getFinanceSaleById } from "@/lib/finance";
import { buttonClass } from "@/components/ui";
import { AdminShell } from "../../admin-shell";
import { ConfirmButton } from "../../confirm-button";
import { deleteFinanceSale } from "../../finance-actions";
import { SaleEditor } from "../sale-editor";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditFinanceSalePage({ params }: PageProps) {
  const { id } = await params;
  const sale = await getFinanceSaleById(id);

  if (!sale) notFound();

  return (
    <AdminShell
      title={sale.client_name}
      description={`${sale.item_name} — edit or delete this sale.`}
      action={
        <Link href="/admin/finance" className={buttonClass({ variant: "ghost" })}>
          ← Dashboard
        </Link>
      }
    >
      <SaleEditor sale={sale} />

      <form action={deleteFinanceSale} className="mx-auto mt-10 max-w-2xl border-t border-line pt-8">
        <input type="hidden" name="id" value={sale.id} />
        <ConfirmButton
          message={`Move sale for ${sale.client_name} to trash? You can restore it later from Trash.`}
          className="text-sm text-amber-400 hover:text-amber-300"
        >
          Move to trash
        </ConfirmButton>
      </form>
    </AdminShell>
  );
}
