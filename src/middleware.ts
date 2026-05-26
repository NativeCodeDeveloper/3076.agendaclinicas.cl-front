import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { canAccessDashboardPath, getDashboardRoleFromClaims } from "@/lib/dashboard-access";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isDashboardApiRoute = createRouteMatcher(["/api/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isDashboardRoute(req) && !isDashboardApiRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = getDashboardRoleFromClaims(sessionClaims);
  const pathname = req.nextUrl.pathname;

  if (isDashboardRoute(req) && !canAccessDashboardPath(role, pathname)) {
    return NextResponse.redirect(new URL("/dashboard/no-access", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*"],
};
