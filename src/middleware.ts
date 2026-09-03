import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// NOTE: middleware runs in its own bundle and cannot import from "@/lib/…"
// helpers that pull in Node-only code, so the key is resolved here too.
// Accept both the legacy `anon` name and the newer `publishable` one.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

type PendingCookie = { name: string; value: string; options: CookieOptions };

/**
 * Refreshes the Supabase session on every /admin request and gates the panel.
 *
 * `getUser()` may rotate the auth token, and those refreshed cookies MUST ride
 * along on whatever response we return. A bare NextResponse.redirect drops
 * them, which consumes the old refresh token without persisting the new one  - 
 * the session then dies on the next request and the user is bounced back to
 * the login page in a loop. Hence `pending` + `withCookies`.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  let response = NextResponse.next({ request });
  const pending: PendingCookie[] = [];

  /** Copies any refreshed auth cookies onto a response before returning it. */
  const withCookies = (res: NextResponse) => {
    for (const { name, value, options } of pending) {
      res.cookies.set(name, value, options);
    }
    return res;
  };

  const redirectTo = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    return withCookies(NextResponse.redirect(url));
  };

  // Without Supabase there is no way to authenticate, so fail closed.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return isLoginRoute ? response : redirectTo("/admin/login");
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
          pending.push({ name, value, options: options ?? {} });
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginRoute) {
    return redirectTo("/admin/login", `?next=${encodeURIComponent(pathname)}`);
  }

  if (user && isLoginRoute) {
    return redirectTo("/admin");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
