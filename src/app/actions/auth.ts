"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string | null;
  password_hash: string;
  role: "admin" | "npp" | "user";
  is_active: number;
}

export type AuthState = {
  error?: string;
  success?: string;
} | null;

// ─── Lấy IP client ───────────────────────────────────────────────────────────
async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP.trim();
  return "unknown";
}

// ─── ĐĂNG NHẬP ───────────────────────────────────────────────────────────────
export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." };
  }

  // Rate limiting theo IP — chặn brute-force
  const ip = await getClientIP();
  const rateLimitKey = `login:${ip}`;
  const rateResult = checkRateLimit(rateLimitKey);

  if (!rateResult.allowed) {
    return {
      error: `Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ${rateResult.retryAfterMinutes} phút.`,
    };
  }

  try {
    const [rows] = await pool.query<User[]>(
      "SELECT id, username, email, password_hash, role, is_active FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    const user = rows[0];

    // Dùng thông báo chung cho cả "không tìm thấy user" và "sai mật khẩu"
    // để tránh user enumeration qua login
    if (!user) {
      return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
    }

    if (!user.is_active) {
      return { error: "Tài khoản của bạn đã bị khóa. Liên hệ admin để được hỗ trợ." };
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
    }

    // Đăng nhập thành công → reset rate limit
    resetRateLimit(rateLimitKey);
    await createSession(user.id, user.username, user.role);
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Lỗi kết nối server. Vui lòng thử lại sau." };
  }

  redirect("/");
}

// ─── ĐĂNG KÝ ─────────────────────────────────────────────────────────────────
export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Rate limiting theo IP — chặn mass registration
  const ip = await getClientIP();
  const rateLimitKey = `register:${ip}`;
  const rateResult = checkRateLimit(rateLimitKey);

  if (!rateResult.allowed) {
    return {
      error: `Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau ${rateResult.retryAfterMinutes} phút.`,
    };
  }

  // Validation cơ bản
  if (!username || !password) {
    return { error: "Vui lòng nhập đầy đủ thông tin." };
  }
  if (username.length < 3 || username.length > 50) {
    return { error: "Tên đăng nhập phải từ 3-50 ký tự." };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (_)." };
  }
  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }
  if (password !== confirmPassword) {
    return { error: "Mật khẩu xác nhận không khớp." };
  }

  try {
    // Fix user enumeration: không tiết lộ username đã tồn tại
    // → dùng thông báo mơ hồ thay vì "Tên đăng nhập đã tồn tại"
    const [existing] = await pool.query<User[]>(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [username]
    );
    if (existing.length > 0) {
      return {
        error: "Tên đăng nhập này không khả dụng. Vui lòng chọn tên đăng nhập khác.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [username, email, passwordHash]
    );

    const insertId = (result as { insertId: number }).insertId;

    // Đăng ký thành công → reset rate limit
    resetRateLimit(rateLimitKey);
    await createSession(insertId, username, "user");
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Lỗi kết nối server. Vui lòng thử lại sau." };
  }

  redirect("/");
}

// ─── ĐĂNG XUẤT ───────────────────────────────────────────────────────────────
export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
