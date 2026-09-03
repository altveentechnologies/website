import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { signOut } from "./actions";

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
      <header className="sticky top-0 z-40 border-b border-line bg-ink-900/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/images/logo1.png"
              alt=""
              width={30}
              height={30}
              className="rounded-md"
            />
            <span className="font-semibold text-cloud">
              Altveen <span className="text-mist">Admin</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {[
              { href: "/admin", label: "Posts" },
              { href: "/admin/clients", label: "Clients" },
              { href: "/admin/marquee", label: "Scroller" },
              { href: "/admin/testimonials", label: "Reviews" },
              { href: "/admin/submissions", label: "Submissions" },
              { href: "/admin/trash", label: "Trash" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-mist transition-colors hover:bg-ink-800 hover:text-cloud"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-mist transition-colors hover:text-brand-400"
            >
              View site ↗
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-line px-3.5 py-2 text-sm text-mist transition-colors hover:border-red-500/50 hover:text-red-400"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

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
