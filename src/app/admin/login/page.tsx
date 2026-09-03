import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="grid-backdrop pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image
            src="/images/logo1.png"
            alt=""
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-cloud">
            Altveen<span className="text-brand-500"> Technologies</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-line bg-ink-850/90 p-8 backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-cloud">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-mist">
            Manage blog posts and view submissions.
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-mist">
          <Link href="/" className="hover:text-brand-400">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
