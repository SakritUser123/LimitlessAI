import { clerkMiddleware } from "@clerk/nextjs/server";

console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/api(.*)",
  ],
};




