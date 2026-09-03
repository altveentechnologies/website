import Link from "next/link";

import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="grid-backdrop pointer-events-none absolute inset-0" />

      <div className="container-page relative text-center">
        <p className="font-mono text-8xl font-bold text-gradient sm:text-9xl">
          404
        </p>
        <h1 className="mt-6 text-3xl font-bold text-cloud">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-mist">
          The link may be broken, or the page may have moved.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className={buttonClass({ size: "lg" })}>
            Go to home
          </Link>
          <Link
            href="/contact"
            className={buttonClass({ variant: "ghost", size: "lg" })}
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
