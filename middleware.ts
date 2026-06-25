import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/api(.*)",
  ],
};

console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);
