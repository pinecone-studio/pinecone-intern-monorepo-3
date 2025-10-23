// Temporarily disable middleware to debug Internal Server Error
// import { authMiddleware } from '@clerk/nextjs';

// export default authMiddleware({
//   publicRoutes: ['/', '/sign-in', '/sign-up', '/api/webhooks'],
//   ignoredRoutes: ['/api/webhooks'],
// });

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };
