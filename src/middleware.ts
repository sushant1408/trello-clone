import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/", "/api/webhook"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, orgId } = await auth();

  // if user is logged in and trying to access any of the public page
  if (userId && isPublicRoute(request)) {
    // if user don't have organization, redirect to create organization page
    let path = "/select-org";

    // if user has organization, redirect to that organization page
    if (orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelection = new URL(path, request.url);

    return NextResponse.redirect(orgSelection);
  }

  // if user is logged in and don't have organization and trying to access any page except for "/select-org"
  if (userId && !orgId && request.nextUrl.pathname !== "/select-org") {
    // redirect user to "/select-org" page
    const orgSelection = new URL("/select-org", request.url);

    return NextResponse.redirect(orgSelection);
  } 

  // if user is not logged in and trying to access any page other than public pages
  if (!userId && !isPublicRoute(request)) {
    // redirect user to "/sign-in" page
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
