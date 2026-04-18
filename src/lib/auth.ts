export const authConfig = {
  sessionStrategy: "jwt",
  publicRoutes: ["/login", "/signup"],
  protectedRoutes: ["/dashboard", "/profile"],
} as const;

export function isProtectedRoute(pathname: string) {
  return authConfig.protectedRoutes.some((route) => pathname.startsWith(route));
}
