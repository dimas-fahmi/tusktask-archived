import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { UserMetadata } from "../../types/supabase";
import { PROTECTED_ROUTES } from "../../configs";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const url = request.nextUrl;
  const pathname = url.pathname;
  const clonedUrl = request.nextUrl.clone();

  // Project URL
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  //   Project Publishable key
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_ID;

  if (!supabaseURL || !key) {
    throw new Error("MISSING_SUPABASE_URL_OR_KEY");
  }

  const supabase = createServerClient(supabaseURL, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check user's registration phase
  if (user) {
    const userMetadata = user.user_metadata as UserMetadata;
    const registrationPhase = userMetadata?.registration_phase;

    // Initialize registration phase for new users
    if (!registrationPhase) {
      await supabase.auth.updateUser({
        data: {
          registration_phase: "name",
        },
      });
    }

    // Redirect user to registration page if they're not finished reigistration phase
    if (
      registrationPhase !== "completed" &&
      !pathname.startsWith("/auth/registration") &&
      !pathname.startsWith("/auth/recovery/reset")
    ) {
      clonedUrl.pathname = "/auth/registration";
      return NextResponse.redirect(clonedUrl);
    }
  }

  // Redirect Users to auth page if they're not logged in and trying to visit protected routes
  if (!user && PROTECTED_ROUTES.includes(pathname) && pathname !== "/auth") {
    clonedUrl.pathname = "/auth";
    return NextResponse.redirect(clonedUrl);
  }

  // Redirect user from auth routes if already logged in
  if (
    user &&
    pathname.startsWith("/auth") &&
    user?.user_metadata?.registration_phase === "completed"
  ) {
    clonedUrl.pathname = "/dashboard";
    return NextResponse.redirect(clonedUrl);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
