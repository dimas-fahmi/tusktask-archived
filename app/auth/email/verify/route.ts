import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Extract Parameters
  const url = req.nextUrl;
  const { token, type, email } = Object.fromEntries(url.searchParams.entries());

  if (!token) {
    return NextResponse.redirect(
      `/auth?code=bad_request&message=${encodeURIComponent("Missing token parameter")}`
    );
  }

  if (!type) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth?code=bad_request&message=${encodeURIComponent("Missing type parameter")}`
    );
  }

  if (!email) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth?code=bad_request&message=${encodeURIComponent("Missing email parameter")}`
    );
  }

  // Construct URL
  const confirmedURL = `${process.env.NEXT_PUBLIC_APP_URL}/auth/email/confirmed?email=${email}`;
  const verifyURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify?token=${token}&type=${type}&redirect_to=${confirmedURL}`;

  return NextResponse.redirect(verifyURL);
}
