import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // PENTING: Hapus cookie dengan menimpa cookie lama
  // Path '/' wajib ada agar cocok dengan cookie saat login
  response.cookies.set({
    name: "auth_token",
    value: "",
    expires: new Date(0), // Expire seketika
    path: "/",
  });

  return response;
}
