
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  console.log(session?.user);

  // User is not logged in
  if (!session) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  // User is logged in
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/destinations",
    "/profile",
    "/destinations/:path*",
    "/bookings/:path*",
    "/add-destination/:path*",
  ],
};
