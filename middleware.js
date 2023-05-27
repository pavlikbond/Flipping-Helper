import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/api/webhooks/user",
    "/api/webhooks/stripe",
    "/api/notifier",
    "/",
    "/pricing",
    "/sign-in",
    "/sign-up",
    "/about",
    "/api/stripe/checkout-session",
    "/api/stripe/portal",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
