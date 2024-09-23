import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
export default function middleware(req: Response) {
  return withAuth(req, {
    isReturnToCurrentPage: true,
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth-callback"],
};
