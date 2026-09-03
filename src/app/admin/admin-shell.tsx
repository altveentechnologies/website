import type { ReactNode } from "react";

import { AdminHeader } from "./admin-header";

export function AdminShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AdminHeader />

      <div className="container-page py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cloud">{title}</h1>
            {description ? (
              <p className="mt-1.5 text-sm text-mist">{description}</p>
            ) : null}
          </div>
          {action}
        </div>

        {children}
      </div>
    </div>
  );
}
