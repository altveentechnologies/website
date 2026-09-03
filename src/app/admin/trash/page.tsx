import { AdminShell } from "../admin-shell";
import { ConfirmButton } from "../confirm-button";
import { emptyTrash, permanentlyDelete, restoreFromTrash } from "../trash-actions";
import { getTrashItems, TRASH_KIND_LABEL } from "@/lib/trash";
import { formatDate } from "@/lib/utils";
import { buttonClass } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminTrashPage() {
  const items = await getTrashItems();

  return (
    <AdminShell
      title="Trash"
      description={
        items.length === 0
          ? "Nothing here, restore items or delete them permanently."
          : `${items.length} item${items.length === 1 ? "" : "s"} · restore or delete permanently`
      }
      action={
        items.length > 0 ? (
          <form action={emptyTrash}>
            <ConfirmButton
              message="Permanently delete everything in trash? This cannot be undone."
              className={buttonClass({ variant: "ghost" })}
            >
              Empty trash
            </ConfirmButton>
          </form>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
          <h2 className="text-lg font-semibold text-cloud">Trash is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist">
            When you trash a post, client, review, or form submission, it
            lands here until you restore it or delete it for good.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-ink-850 text-mist">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Item</th>
                  <th className="px-5 py-3.5 font-medium">Type</th>
                  <th className="px-5 py-3.5 font-medium">Trashed</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-line)]">
                {items.map((item) => (
                  <tr key={`${item.kind}-${item.id}`} className="bg-ink-900/60">
                    <td className="px-5 py-4">
                      <p className="font-medium text-cloud">{item.label}</p>
                      {item.detail ? (
                        <p className="mt-0.5 text-xs text-mist">{item.detail}</p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-mist">
                      {TRASH_KIND_LABEL[item.kind]}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-mist">
                      {formatDate(item.deleted_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <form action={restoreFromTrash}>
                          <input type="hidden" name="kind" value={item.kind} />
                          <input type="hidden" name="id" value={item.id} />
                          <button
                            type="submit"
                            className="text-brand-400 hover:text-brand-500"
                          >
                            Restore
                          </button>
                        </form>
                        <form action={permanentlyDelete}>
                          <input type="hidden" name="kind" value={item.kind} />
                          <input type="hidden" name="id" value={item.id} />
                          <ConfirmButton
                            message={`Permanently delete “${item.label}”? This cannot be undone.`}
                            className="text-mist transition-colors hover:text-red-400"
                          >
                            Delete forever
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
