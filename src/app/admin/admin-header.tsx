"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { signOut } from "./actions";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Posts" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/marquee", label: "Scroller" },
  { href: "/admin/testimonials", label: "Reviews" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/trash", label: "Trash" },
] as const;

export function AdminHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
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
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                isActive(link.href)
                  ? "bg-ink-800 text-cloud"
                  : "text-mist hover:bg-ink-800 hover:text-cloud",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 sm:flex">
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

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-cloud sm:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={cn(
                "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                menuOpen ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all duration-200",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                menuOpen ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-line bg-ink-900/98 backdrop-blur-xl sm:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-5">
              {ADMIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-ink-700/70 text-cloud"
                      : "text-mist hover:bg-ink-800 hover:text-cloud",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/"
                target="_blank"
                className="mt-2 rounded-lg px-4 py-3 text-base font-medium text-mist transition-colors hover:bg-ink-800 hover:text-brand-400"
              >
                View site ↗
              </Link>
              <form action={signOut} className="mt-1">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-line px-4 py-3 text-left text-base font-medium text-mist transition-colors hover:border-red-500/50 hover:text-red-400"
                >
                  Sign out
                </button>
              </form>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
