"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

interface PurchasedAccount {
  id: number;
  name: string;
  date: string;
  price: number;
  status: "pending" | "completed" | "cancelled" | "refunded";
}

interface UserData {
  username: string;
  email: string;
  balance: number;
  role: "admin" | "npp" | "user";
  avatarUrl: string | null;
  joinDate: string;
  totalSpent: number;
  totalOrders: number;
  purchasedAccounts: PurchasedAccount[];
}

interface ProfileContentProps {
  user: UserData;
}

const ROLE_LABEL: Record<string, { label: string; color: string }> = {
  admin: { label: "Quản trị viên", color: "bg-[rgb(220,38,38)] text-white" },
  npp: { label: "Nhà phân phối", color: "bg-[rgb(124,58,237)] text-white" },
  user: { label: "Thành viên", color: "bg-[rgb(31,41,55)] text-[rgb(251,191,36)] border border-[rgb(251,191,36)]" },
};

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Chờ xử lý",  color: "text-[rgb(234,179,8)]" },
  completed: { label: "Hoàn thành", color: "text-[rgb(34,197,94)]" },
  cancelled: { label: "Đã huỷ",     color: "text-[rgb(156,163,175)]" },
  refunded:  { label: "Hoàn tiền",  color: "text-[rgb(59,130,246)]" },
};

export function ProfileContent({ user }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<"info" | "topup" | "history">("info");
  const [topupAmount, setTopupAmount] = useState("");

  const topupOptions = [50000, 100000, 200000, 500000, 1000000, 2000000];
  const roleStyle = ROLE_LABEL[user.role] ?? ROLE_LABEL.user;

  return (
    <div className="w-full max-w-[800px] mx-auto animate-fade-in-up">

      {/* ── Profile Header ───────────────────────────────────────────────── */}
      <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-6 md:p-8 mb-6 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">

          {/* Avatar */}
          <div className="relative shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full object-cover border-2 border-[rgb(251,191,36)] shadow-[0_0_20px_rgba(251,191,36,0.4)]"
              />
            ) : (
              <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full bg-gradient-to-br from-[rgb(202,138,4)] to-[rgb(251,191,36)] flex items-center justify-center text-[32px] md:text-[40px] font-bold text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-1">
              <h2 className="text-[rgb(251,191,36)] text-[22px] md:text-[26px] font-bold">{user.username}</h2>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${roleStyle.color}`}>
                {roleStyle.label}
              </span>
            </div>
            <p className="text-[rgba(238,238,238,0.7)] text-[14px]">{user.email}</p>
            <p className="text-[rgba(238,238,238,0.5)] text-[12px] mt-1">Tham gia: {user.joinDate}</p>
          </div>

          {/* Balance */}
          <div className="text-center md:text-right shrink-0">
            <p className="text-[rgba(238,238,238,0.7)] text-[13px]">Số dư</p>
            <p className="text-[rgb(251,191,36)] text-[24px] md:text-[30px] font-bold font-[family-name:var(--font-nunito)]">
              {user.balance.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-[rgb(75,85,99)]">
          <div className="bg-[rgb(15,23,42)] rounded-xl p-3 text-center">
            <p className="text-[rgba(238,238,238,0.5)] text-[11px] uppercase tracking-wider mb-1">Đơn hoàn thành</p>
            <p className="text-white font-bold text-[20px] font-[family-name:var(--font-nunito)]">{user.totalOrders}</p>
          </div>
          <div className="bg-[rgb(15,23,42)] rounded-xl p-3 text-center">
            <p className="text-[rgba(238,238,238,0.5)] text-[11px] uppercase tracking-wider mb-1">Tổng chi tiêu</p>
            <p className="text-[rgb(251,191,36)] font-bold text-[18px] font-[family-name:var(--font-nunito)]">
              {user.totalSpent.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex mb-6 bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl overflow-hidden">
        {(["info", "topup", "history"] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[13px] md:text-[16px] font-bold transition-colors ${
              activeTab === tab ? "bg-[rgb(202,138,4)] text-black" : "text-[rgba(238,238,238,0.7)] hover:text-white"
            }`}
          >
            {tab === "info" ? "Thông tin" : tab === "topup" ? "Nạp tiền" : `Lịch sử mua (${user.purchasedAccounts.length})`}
          </button>
        ))}
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-6 md:p-8">

        {/* Tab: Thông tin */}
        {activeTab === "info" && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-2">Thông tin tài khoản</h3>

            {[
              { label: "Tên đăng nhập", value: user.username },
              { label: "Email", value: user.email },
              {
                label: "Loại tài khoản",
                value: (
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${roleStyle.color}`}>
                    {roleStyle.label}
                  </span>
                ),
              },
              {
                label: "Số dư",
                value: <span className="text-[rgb(251,191,36)] font-bold text-[16px]">{user.balance.toLocaleString("vi-VN")}đ</span>,
              },
              { label: "Tổng acc đã mua", value: `${user.purchasedAccounts.length} acc` },
              {
                label: "Tổng chi tiêu",
                value: <span className="text-[rgb(251,191,36)] font-semibold">{user.totalSpent.toLocaleString("vi-VN")}đ</span>,
              },
              { label: "Ngày tham gia", value: user.joinDate },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? "border-b border-[rgb(75,85,99)]" : ""}`}
              >
                <span className="text-[rgba(238,238,238,0.7)] text-[14px]">{label}</span>
                <span className="text-white font-semibold text-[14px]">{value}</span>
              </div>
            ))}
            {/* Nút vào dashboard (chỉ admin/npp) */}
            {user.role !== "user" && (
              <Link
                href={user.role === "admin" ? "/admin" : "/npp"}
                className="mt-2 w-full py-3 flex items-center justify-center gap-2 bg-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.3)] border border-[rgb(124,58,237)] text-[rgb(167,139,250)] font-bold text-[15px] rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
                {user.role === "admin" ? "Vào trang Quản trị" : "Vào trang Nhà phân phối"}
              </Link>
            )}

            <LogoutButton />
          </div>
        )}


        {/* Tab: Nạp tiền */}
        {activeTab === "topup" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-2">Nạp tiền vào tài khoản</h3>
            <div className="grid grid-cols-3 gap-3">
              {topupOptions.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopupAmount(String(amount))}
                  className={`py-3 rounded-lg font-bold text-[13px] md:text-[14px] transition-colors border ${
                    topupAmount === String(amount)
                      ? "bg-[rgb(202,138,4)] text-black border-[rgb(251,191,36)]"
                      : "bg-[rgb(31,41,55)] text-white border-[rgb(75,85,99)] hover:border-[rgb(251,191,36)]"
                  }`}
                >
                  {amount.toLocaleString("vi-VN")}đ
                </button>
              ))}
            </div>
            <input
              type="number"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              placeholder="Nhập số tiền (VNĐ)"
              className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] transition-colors"
            />
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-[14px] text-[rgba(238,238,238,0.7)]">Phương thức thanh toán</p>
              {["Chuyển khoản ngân hàng", "Ví MoMo", "Thẻ cào điện thoại"].map((method, i) => (
                <label key={method} className="flex items-center gap-3 p-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg cursor-pointer hover:border-[rgb(251,191,36)]">
                  <input type="radio" name="payment" defaultChecked={i === 0} className="accent-[rgb(251,191,36)]" />
                  <span className="text-[14px]">{method}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => alert("Nạp tiền thành công! (Demo)")}
              className="mt-4 w-full py-3 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[16px] rounded-lg transition-colors"
            >
              Nạp tiền
            </button>
          </div>
        )}

        {/* Tab: Lịch sử mua */}
        {activeTab === "history" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-2">
              Lịch sử mua hàng
            </h3>

            {user.purchasedAccounts.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[rgba(238,238,238,0.2)]">
                  <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
                <p className="text-center text-[rgba(238,238,238,0.5)] text-[14px]">Bạn chưa mua tài khoản nào.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {user.purchasedAccounts.map((acc) => {
                  const statusStyle = ORDER_STATUS[acc.status] ?? ORDER_STATUS.pending;
                  return (
                    <div
                      key={acc.id}
                      className="flex justify-between items-center p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)] hover:border-[rgba(251,191,36,0.4)] transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-white font-semibold text-[14px] md:text-[15px]">{acc.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[rgba(238,238,238,0.5)] text-[12px]">{acc.date}</p>
                          <span className={`text-[11px] font-semibold ${statusStyle.color}`}>
                            • {statusStyle.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-[rgb(251,191,36)] font-bold text-[14px] md:text-[16px] shrink-0 ml-3">
                        {acc.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
