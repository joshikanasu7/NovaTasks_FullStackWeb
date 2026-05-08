import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as never);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (!user && (path.startsWith("/admin") || path.startsWith("/member"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && (path.startsWith("/admin") || path.startsWith("/member") || path === "/")) {
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (!profile) return NextResponse.redirect(new URL("/login", request.url));
    if (path.startsWith("/admin") && profile.role !== "admin") {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }
    if (path.startsWith("/member") && profile.role !== "member") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (path === "/") {
      return NextResponse.redirect(
        new URL(profile.role === "admin" ? "/admin/dashboard" : "/member/dashboard", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/", "/admin/:path*", "/member/:path*"]
};
