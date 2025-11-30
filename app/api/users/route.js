// app/api/users/route.js
import pool from "../../lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // Ambil cookie auth_token
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verifikasi JWT
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = payload.userId;

    // Ambil data user dari database
    const [rows] = await pool.query(
      "SELECT username, email FROM users WHERE id = ?",
      [userId]
    );

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
