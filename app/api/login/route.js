import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../../lib/db"; // <-- Impor koneksi database

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Cek input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Cari pengguna di database
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // 3. Jika pengguna tidak ditemukan
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // 4. Bandingkan kata sandi
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 5. Buat Token JWT (Sukses)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        // Anda bisa tambahkan data lain di sini
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token berlaku 1 jam
    );

    // 6. Kirim token ke client
    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
