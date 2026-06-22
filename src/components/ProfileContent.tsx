"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoutButton } from "./LogoutButton";
import { getBalanceAction } from "@/app/actions/auth";

interface PurchasedAccount {
  id: number;
  name: string;
  date: string;
  price: number;
  status: "pending" | "completed" | "cancelled" | "refunded";
  login_username?: string;
  login_password?: string;
}

interface DepositHistory {
  id: number;
  amount: number;
  method: "bank_transfer" | "momo" | "card" | null;
  status: "pending" | "completed" | "failed" | "cancelled";
  description: string;
  reference_id: string;
  date: string;
  time: string;
}

interface UserData {
  id: number;
  username: string;
  displayName: string;
  email: string;
  balance: number;
  role: "admin" | "npp" | "user";
  avatarUrl: string | null;
  joinDate: string;
  totalSpent: number;
  totalOrders: number;
  purchasedAccounts: PurchasedAccount[];
  depositHistory: DepositHistory[];
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

const DEPOSIT_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Chờ xử lý",  color: "text-[rgb(234,179,8)]", bg: "bg-[rgba(234,179,8,0.15)]" },
  completed: { label: "Thành công", color: "text-[rgb(34,197,94)]", bg: "bg-[rgba(34,197,94,0.15)]" },
  failed:    { label: "Thất bại",   color: "text-[rgb(239,68,68)]",  bg: "bg-[rgba(239,68,68,0.15)]" },
  cancelled: { label: "Đã huỷ",     color: "text-[rgb(156,163,175)]", bg: "bg-[rgba(156,163,175,0.15)]" },
};

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Chuyển khoản ngân hàng",
  momo: "Ví điện tử MoMo",
  card: "Thẻ cào điện thoại",
};

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || "MB";
  const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT || "0338180818";
  const bankHolder = process.env.NEXT_PUBLIC_BANK_HOLDER || "NGUYEN VAN A";

  const [activeTab, setActiveTab] = useState<"info" | "topup" | "history" | "deposits">("info");
  const [topupAmount, setTopupAmount] = useState("100000");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "momo" | "card">("bank");
  const [showQR, setShowQR] = useState(false);
  const [topupError, setTopupError] = useState<string | null>(null);

  const [balance, setBalance] = useState(user.balance);
  const [showSuccessBanner, setShowSuccessBanner] = useState<{ amount: number } | null>(null);

  useEffect(() => {
    setBalance(user.balance);
  }, [user.balance]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "topup" || tab === "history" || tab === "deposits") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab !== "topup" || !showQR) return;

    const interval = setInterval(async () => {
      const res = await getBalanceAction();
      if (res.balance !== undefined && res.balance > balance) {
        const amountAdded = res.balance - balance;
        setShowSuccessBanner({ amount: amountAdded });
        setBalance(res.balance);
        router.refresh();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab, showQR, balance, router]);

  // States for copying feedback
  const [copiedBankInfo, setCopiedBankInfo] = useState({ stk: false, amount: false, content: false });
  const [copiedHistory, setCopiedHistory] = useState<Record<string, boolean>>({});
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const topupOptions = [50000, 100000, 200000, 500000, 1000000, 2000000];
  const roleStyle = ROLE_LABEL[user.role] ?? ROLE_LABEL.user;

  const copyToClipboard = (text: string, type: "stk" | "amount" | "content") => {
    navigator.clipboard.writeText(text);
    setCopiedBankInfo(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopiedBankInfo(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const copyHistoryToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHistory(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedHistory(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto animate-fade-in-up">
      {/* ── Success Toast Notification ── */}
      {showSuccessBanner && (
        <div className="fixed top-20 right-4 z-50 animate-bounce bg-[rgba(34,197,94,0.15)] border-2 border-[rgb(34,197,94)] backdrop-blur-md rounded-2xl p-4 shadow-[0_0_30px_rgba(34,197,94,0.3)] max-w-sm flex items-start gap-3">
          <div className="bg-[rgb(34,197,94)] text-black rounded-full p-1.5 shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 font-sans">
            <h4 className="text-[rgb(34,197,94)] font-bold text-[15px] mb-0.5">Nạp tiền thành công!</h4>
            <p className="text-white text-[13px] leading-relaxed">
              Tài khoản của bạn đã được cộng <strong className="text-[rgb(34,197,94)] font-extrabold font-[family-name:var(--font-nunito)]">+{showSuccessBanner.amount.toLocaleString("vi-VN")}đ</strong>.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessBanner(null)}
            className="text-gray-400 hover:text-white shrink-0 font-bold ml-1 text-[16px]"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Profile Header ───────────────────────────────────────────────── */}
      <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-6 md:p-8 mb-6 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">

          {/* Avatar */}
          <div className="relative shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full object-cover border-2 border-[rgb(251,191,36)] shadow-[0_0_20px_rgba(251,191,36,0.4)]"
              />
            ) : (
              <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full bg-gradient-to-br from-[rgb(202,138,4)] to-[rgb(251,191,36)] flex items-center justify-center text-[32px] md:text-[40px] font-bold text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-1">
              <h2 className="text-[rgb(251,191,36)] text-[22px] md:text-[26px] font-bold">{user.displayName}</h2>
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
            <p className="text-[rgb(251,191,36)] text-[24px] md:text-[30px] font-bold font-[family-name:var(--font-nunito)] animate-pulse">
              {balance.toLocaleString("vi-VN")}đ
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
        {(["info", "topup", "history", "deposits"] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[11px] md:text-[14px] font-bold transition-colors cursor-pointer ${
              activeTab === tab ? "bg-[rgb(202,138,4)] text-black font-extrabold" : "text-[rgba(238,238,238,0.7)] hover:text-white"
            }`}
          >
            {tab === "info"
              ? "Thông tin"
              : tab === "topup"
                ? "Nạp tiền"
                : tab === "history"
                  ? `Lịch sử mua (${user.purchasedAccounts.length})`
                  : `Lịch sử nạp (${user.depositHistory?.length || 0})`}
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
              { label: "Tên hiển thị", value: user.displayName },
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
                value: <span className="text-[rgb(251,191,36)] font-bold text-[16px]">{balance.toLocaleString("vi-VN")}đ</span>,
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
            
            {/* Phương thức thanh toán */}
            <div className="flex flex-col gap-2 mb-2">
              <p className="text-[14px] text-[rgba(238,238,238,0.7)]">Chọn phương thức nạp tiền</p>
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={() => { setPaymentMethod("bank"); setShowQR(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 p-3.5 border rounded-xl font-semibold text-[14px] cursor-pointer transition-colors ${
                    paymentMethod === "bank"
                      ? "bg-[rgba(251,191,36,0.1)] border-[rgb(251,191,36)] text-[rgb(251,191,36)]"
                      : "bg-[rgb(31,41,55)] border-[rgb(75,85,99)] text-gray-300 hover:border-gray-500"
                  }`}
                >
                  Chuyển khoản (Tự động)
                </button>
                <button
                  onClick={() => { setPaymentMethod("momo"); setShowQR(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 p-3.5 border rounded-xl font-semibold text-[14px] cursor-pointer transition-colors ${
                    paymentMethod === "momo"
                      ? "bg-[rgba(251,191,36,0.1)] border-[rgb(251,191,36)] text-[rgb(251,191,36)]"
                      : "bg-[rgb(31,41,55)] border-[rgb(75,85,99)] text-gray-300 hover:border-gray-500"
                  }`}
                >
                  Ví MoMo (Bảo trì)
                </button>
                <button
                  onClick={() => { setPaymentMethod("card"); setShowQR(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 p-3.5 border rounded-xl font-semibold text-[14px] cursor-pointer transition-colors ${
                    paymentMethod === "card"
                      ? "bg-[rgba(251,191,36,0.1)] border-[rgb(251,191,36)] text-[rgb(251,191,36)]"
                      : "bg-[rgb(31,41,55)] border-[rgb(75,85,99)] text-gray-300 hover:border-gray-500"
                  }`}
                >
                  Thẻ cào (Bảo trì)
                </button>
              </div>
            </div>

            {paymentMethod !== "bank" ? (
              <div className="bg-[rgba(220,38,38,0.05)] border border-[rgba(220,38,38,0.2)] p-6 rounded-xl text-center py-10 flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[rgb(248,113,113)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-gray-300 text-[15px] font-sans">
                  Phương thức này hiện đang bảo trì và nâng cấp.
                </p>
                <p className="text-gray-500 text-[13px] font-sans max-w-[450px]">
                  Vui lòng sử dụng <strong>Chuyển khoản ngân hàng</strong> để nạp tiền tự động 24/7 thông qua quét mã QR.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Chọn số tiền nạp */}
                <div className="grid grid-cols-3 gap-3">
                  {topupOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setTopupAmount(String(amount));
                        setShowQR(false);
                      }}
                      className={`py-3 rounded-lg font-bold text-[13px] md:text-[14px] transition-colors border cursor-pointer ${
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
                  onChange={(e) => {
                    setTopupAmount(e.target.value);
                    setTopupError(null);
                    setShowQR(false);
                  }}
                  placeholder="Nhập số tiền nạp tùy chọn (VNĐ)"
                  className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] transition-colors"
                />

                {topupError && (
                  <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] p-2.5 rounded-lg mt-2 text-center font-sans animate-fade-in">
                    <p className="text-[rgb(248,113,113)] text-[12px]">{topupError}</p>
                  </div>
                )}

                {!showQR ? (
                  <button
                    onClick={() => {
                      if (!topupAmount || isNaN(Number(topupAmount)) || Number(topupAmount) < 1000) {
                        setTopupError("Số tiền nạp tối thiểu là 1,000 VNĐ.");
                        return;
                      }
                      setTopupError(null);
                      setShowQR(true);
                    }}
                    className="mt-2 w-full py-3.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-extrabold text-[16px] rounded-lg transition-colors cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                  >
                    TẠO MÃ THANH TOÁN QR
                  </button>
                ) : (
                  <div className="bg-[rgb(15,23,42)] border border-[rgb(253,230,138)] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 mt-2 animate-fade-in">
                    
                    {/* VietQR Code */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="bg-white rounded-xl p-3 flex items-center justify-center shadow-lg">
                        <img
                          src={`https://img.vietqr.io/image/${bankName}-${bankAccount}-compact.png?amount=${topupAmount}&addInfo=BOMRAU%20NAP%20${user.id}`}
                          alt="VietQR"
                          className="w-[180px] h-[180px] object-contain"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-2 font-sans">VietQR - Quét để chuyển khoản nhanh</span>
                    </div>

                    {/* Transfer Details */}
                    <div className="flex-1 w-full flex flex-col gap-2.5 text-[13px] md:text-[14px] font-[family-name:var(--font-nunito)]">
                      <h4 className="text-[rgb(251,191,36)] font-bold text-[16px] mb-1 font-sans">Thông Tin Chuyển Khoản</h4>
                      
                      <div className="flex justify-between py-1.5 border-b border-gray-800">
                        <span className="text-gray-400 font-sans">Ngân hàng:</span>
                        <span className="text-white font-bold">{bankName === "MB" ? "MB Bank (Quân Đội)" : bankName}</span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-gray-800">
                        <span className="text-gray-400 font-sans">Chủ tài khoản:</span>
                        <span className="text-white font-bold uppercase">{bankHolder}</span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-gray-800">
                        <span className="text-gray-400 font-sans">Số tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{bankAccount}</span>
                          <button
                            onClick={() => copyToClipboard(bankAccount, "stk")}
                            className="text-[rgb(251,191,36)] text-[12px] font-sans hover:underline cursor-pointer"
                          >
                            {copiedBankInfo.stk ? "Đã chép" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-gray-800">
                        <span className="text-gray-400 font-sans">Số tiền:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[rgb(251,191,36)] font-bold">{Number(topupAmount).toLocaleString("vi-VN")}đ</span>
                          <button
                            onClick={() => copyToClipboard(topupAmount, "amount")}
                            className="text-[rgb(251,191,36)] text-[12px] font-sans hover:underline cursor-pointer"
                          >
                            {copiedBankInfo.amount ? "Đã chép" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between py-1.5">
                        <span className="text-gray-400 font-sans">Nội dung chuyển khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-extrabold bg-[rgba(251,191,36,0.15)] px-2 py-0.5 rounded text-[14px]">BOMRAU NAP {user.id}</span>
                          <button
                            onClick={() => copyToClipboard(`BOMRAU NAP ${user.id}`, "content")}
                            className="text-[rgb(251,191,36)] text-[12px] font-sans hover:underline cursor-pointer"
                          >
                            {copiedBankInfo.content ? "Đã chép" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)] p-2.5 rounded-lg mt-1 text-left w-full text-[11px] leading-relaxed text-gray-300 font-sans">
                        <strong>Lưu ý:</strong> Chuyển đúng nội dung <strong className="text-white">BOMRAU NAP {user.id}</strong> để hệ thống tự động nhận dạng giao dịch và cộng tiền sau 1-2 phút.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                      className="flex flex-col p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)] hover:border-[rgba(251,191,36,0.4)] transition-colors"
                    >
                      <div className="flex justify-between items-center w-full">
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

                      <div className="mt-2 flex justify-end gap-2">
                        {acc.status === "completed" && acc.login_username && (
                          <button
                            onClick={() => toggleOrderExpand(acc.id)}
                            className="px-3 py-1 bg-[rgb(15,23,42)] border border-[rgb(75,85,99)] hover:border-[rgb(251,191,36)] text-[rgb(251,191,36)] text-[12px] font-sans font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            {expandedOrders[acc.id] ? "Ẩn thông tin nick" : "Xem thông tin nick"}
                          </button>
                        )}
                        <a
                          href="https://zalo.me/0338180818"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[rgba(0,136,204,0.15)] border border-[rgb(0,136,204)] hover:bg-[rgba(0,136,204,0.3)] text-[rgb(0,185,255)] text-[12px] font-sans font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                          </svg>
                          Liên hệ Admin
                        </a>
                      </div>

                      {acc.status === "completed" && acc.login_username && expandedOrders[acc.id] && (
                        <div className="mt-3 pt-3 border-t border-gray-700 flex flex-col gap-2.5 text-[13px] font-[family-name:var(--font-nunito)] animate-fade-in">
                          <div className="bg-[rgb(15,23,42)] border border-[rgb(75,85,99)] rounded-lg p-3 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 font-sans">Tài khoản đăng nhập:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-mono font-bold select-all">{acc.login_username}</span>
                                <button
                                  onClick={() => copyHistoryToClipboard(acc.login_username || "", `user-${acc.id}`)}
                                  className="text-[rgb(251,191,36)] hover:text-white text-[12px] cursor-pointer"
                                >
                                  {copiedHistory[`user-${acc.id}`] ? "Đã chép" : "Copy"}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 font-sans">Mật khẩu:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-mono font-bold select-all">{acc.login_password}</span>
                                <button
                                  onClick={() => copyHistoryToClipboard(acc.login_password || "", `pass-${acc.id}`)}
                                  className="text-[rgb(251,191,36)] hover:text-white text-[12px] cursor-pointer"
                                >
                                  {copiedHistory[`pass-${acc.id}`] ? "Đã chép" : "Copy"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Lịch sử nạp */}
        {activeTab === "deposits" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-2">
              Lịch sử nạp tiền
            </h3>

            {!user.depositHistory || user.depositHistory.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[rgba(238,238,238,0.2)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-center text-[rgba(238,238,238,0.5)] text-[14px]">Bạn chưa có giao dịch nạp tiền nào.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {user.depositHistory.map((dep) => {
                  const statusStyle = DEPOSIT_STATUS[dep.status] ?? DEPOSIT_STATUS.pending;
                  const methodLabel = METHOD_LABELS[dep.method || ""] || "Khác";
                  return (
                    <div
                      key={dep.id}
                      className="flex flex-col p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)] hover:border-[rgba(251,191,36,0.4)] transition-colors"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col gap-1">
                          <p className="text-white font-semibold text-[14px] md:text-[15px]">{methodLabel}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[rgba(238,238,238,0.5)] text-[12px]">{dep.date} lúc {dep.time}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${statusStyle.bg} ${statusStyle.color}`}>
                              {statusStyle.label}
                            </span>
                          </div>
                          {dep.reference_id && (
                            <p className="text-[rgba(238,238,238,0.4)] text-[11px] font-mono mt-0.5">
                              Mã GD: {dep.reference_id}
                            </p>
                          )}
                        </div>
                        <p className="text-[rgb(34,197,94)] font-bold text-[15px] md:text-[17px] shrink-0 ml-3">
                          +{dep.amount.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      {dep.description && (
                        <p className="mt-2 text-[12px] text-[rgba(238,238,238,0.6)] bg-[rgb(15,23,42)] p-2 rounded border border-gray-800 leading-relaxed font-sans">
                          {dep.description}
                        </p>
                      )}
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
