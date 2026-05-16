import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Make the homepage and API routes public so anyone can see the feed
  publicRoutes: ["/", "/api/reports(.*)"]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};