import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import pool from "@/lib/db";
import { createSession } from "@/lib/session";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  role: "admin" | "npp" | "user";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json({ error: "Thiếu mã xác thực Google." }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Mã xác thực Google không hợp lệ." }, { status: 401 });
    }

    const googleId = payload.sub;
    const email = payload.email || "";
    const name = payload.name || email.split("@")[0] || "user";

    const [existing] = await pool.query<UserRow[]>(
      "SELECT id, username, role FROM users WHERE google_id = ? LIMIT 1",
      [googleId]
    );

    let user: UserRow;

    if (existing.length > 0) {
      user = existing[0];
    } else {
      let baseUsername = name
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 20);

      if (!baseUsername) {
        baseUsername = `user_${googleId.slice(0, 8)}`;
      }

      const [sameName] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE username = ? LIMIT 1",
        [baseUsername]
      );

      if (sameName.length > 0) {
        baseUsername = `${baseUsername}_${Math.random().toString(36).slice(2, 6)}`;
      }

      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO users (username, email, google_id, role, is_active) VALUES (?, ?, ?, 'user', 1)",
        [baseUsername, email || null, googleId]
      );

      user = { id: result.insertId, username: baseUsername, role: "user" } as UserRow;
    }

    await createSession(user.id, user.username, user.role);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Google auth error:", err);
    return NextResponse.json({ error: "Xác thực Google thất bại." }, { status: 401 });
  }
}
