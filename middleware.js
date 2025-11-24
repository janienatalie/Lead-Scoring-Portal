import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // 1. DAFTAR HALAMAN YANG DILINDUNGI (Wajib Login)
  // Tambahkan path lain di sini jika ada (misal: /profile, /settings)
  const protectedPaths = ["/dashboard", "/leadscore", "/nasabah"];

  // Cek apakah user sedang membuka salah satu halaman yang dilindungi
  const isProtectedPage = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 2. DAFTAR HALAMAN PUBLIK (Halaman Login)
  const isLoginPage = pathname === "/" || pathname === "/login";

  // --- LOGIKA PENGAMANAN ---

  // SKENARIO A: User mau masuk halaman rahasia TAPI tidak punya token
  if (isProtectedPage && !token) {
    const loginUrl = new URL("/", request.url);
    // (Opsional) Simpan halaman yang mau diakses agar nanti bisa redirect balik
    // loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // SKENARIO B: User SUDAH login TAPI mau masuk halaman Login lagi
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// 3. KONFIGURASI MATCHER (PENTING!)
// Middleware hanya akan aktif pada path yang didaftarkan di sini.
export const config = {
  matcher: [
    /*
     * Match semua request path KECUALI yang berawalan:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - gambar publik (png, jpg, svg, dll)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
