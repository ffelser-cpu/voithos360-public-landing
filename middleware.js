import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/api/patients(.*)",
  "/api/advocacy(.*)",
  "/api/admin(.*)",
  "/api/care-actions(.*)",
  "/api/consents(.*)",
  "/api/intake(.*)",
  "/api/overview(.*)",
  "/api/settings(.*)",
  "/advocacy(.*)",
  "/admin(.*)",
  "/benefits(.*)",
  "/copilot(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
