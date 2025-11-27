// app/api/login/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      );
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Buat token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Buat response
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
    });

    // Set cookie HttpOnly (aman)
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
