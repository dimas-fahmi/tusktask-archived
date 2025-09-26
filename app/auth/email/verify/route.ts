import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Extract Parameters
  const url = req.nextUrl;
  const { token, type, email } = Object.fromEntries(url.searchParams.entries());
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Validate required environment variables
  if (!origin) {
    return NextResponse.redirect(
      "/auth?code=server_error&message=" +
        encodeURIComponent("Missing app URL configuration")
    );
  }

  if (!supabaseURL) {
    return NextResponse.redirect(
      `${origin}/auth?code=server_error&message=${encodeURIComponent("Missing Supabase URL configuration")}`
    );
  }

  if (!token) {
    return NextResponse.redirect(
      `${origin}/auth?code=bad_request&message=${encodeURIComponent("Missing token parameter")}`
    );
  }

  if (!type) {
    return NextResponse.redirect(
      `${origin}/auth?code=bad_request&message=${encodeURIComponent("Missing type parameter")}`
    );
  }

  if (!email) {
    return NextResponse.redirect(
      `${origin}/auth?code=bad_request&message=${encodeURIComponent("Missing email parameter")}`
    );
  }

  // Construct URL
  const confirmedURL = `${origin}/auth/email/confirmed?email=${email}`;
  const verifyURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify?token=${token}&type=${type}&redirect_to=${confirmedURL}`;

  return NextResponse.redirect(verifyURL);
}
