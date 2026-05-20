"use client";

import { useState } from "react";

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState<"info" | "topup" | "history">("info");
  const [topupAmount, setTopupAmount] = useState("");

  const user = {
    username: "player01",
    email: "player01@gmail.com",
    balance: 500000,
    joinDate: "01/01/2026",
    purchasedAccounts: [
      { name: "Yone Thần Kiếm T1 Nị", date: "15/05/2026", price: 2499000 },
      { name: "Yasuo Long Kiếm", date: "10/05/2026", price: 2998000 },
    ],
  };

  const topupOptions = [50000, 100000, 200000, 500000, 1000000, 2000000];

  return (
    <div className="w-full max-w-[800px] mx-auto animate-fade-in-up">
      {/* Profile header */}
      <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full bg-[rgb(202,138,4)] flex items-center justify-center text-[32px] md:text-[40px] font-bold text-black">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-[rgb(251,191,36)] text-[22px] md:text-[28px] font-bold">{user.username}</h2>
            <p className="text-[rgba(238,238,238,0.7)] text-[14px]">{user.email}</p>
            <p className="text-[rgba(238,238,238,0.5)] text-[12px] mt-1">Tham gia: {user.joinDate}</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[rgba(238,238,238,0.7)] text-[13px]">Số dư</p>
            <p className="text-[rgb(251,191,36)] text-[24px] md:text-[30px] font-bold">{user.balance.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl overflow-hidden">
        <button onClick={() => setActiveTab("info")} className={`flex-1 py-3 text-[13px] md:text-[16px] font-bold transition-colors ${activeTab === "info" ? "bg-[rgb(202,138,4)] text-black" : "text-[rgba(238,238,238,0.7)] hover:text-white"}`}>Thông tin</button>
        <button onClick={() => setActiveTab("topup")} className={`flex-1 py-3 text-[13px] md:text-[16px] font-bold transition-colors ${activeTab === "topup" ? "bg-[rgb(202,138,4)] text-black" : "text-[rgba(238,238,238,0.7)] hover:text-white"}`}>Nạp tiền</button>
        <button onClick={() => setActiveTab("history")} className={`flex-1 py-3 text-[13px] md:text-[16px] font-bold transition-colors ${activeTab === "history" ? "bg-[rgb(202,138,4)] text-black" : "text-[rgba(238,238,238,0.7)] hover:text-white"}`}>Lịch sử mua</button>
      </div>

      {/* Tab content */}
      <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-6 md:p-8">
        {activeTab === "info" && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-2">Thông tin tài khoản</h3>
            <div className="flex justify-between items-center py-3 border-b border-[rgb(75,85,99)]">
              <span className="text-[rgba(238,238,238,0.7)] text-[14px]">Tên đăng nhập</span>
              <span className="text-white font-semibold text-[14px]">{user.username}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[rgb(75,85,99)]">
              <span className="text-[rgba(238,238,238,0.7)] text-[14px]">Email</span>
              <span className="text-white font-semibold text-[14px]">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[rgb(75,85,99)]">
              <span className="text-[rgba(238,238,238,0.7)] text-[14px]">Số dư</span>
              <span className="text-[rgb(251,191,36)] font-bold text-[16px]">{user.balance.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[rgb(75,85,99)]">
              <span className="text-[rgba(238,238,238,0.7)] text-[14px]">Tổng acc đã mua</span>
              <span className="text-white font-semibold text-[14px]">{user.purchasedAccounts.length}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[rgba(238,238,238,0.7)] text-[14px]">Ngày tham gia</span>
              <span className="text-white font-semibold text-[14px]">{user.joinDate}</span>
            </div>
            <button className="mt-4 w-full py-3 bg-[rgb(220,38,38)] hover:bg-[rgb(185,28,28)] text-white font-bold text-[16px] rounded-lg transition-colors">Đăng Xuất</button>
          </div>
        )}

        {activeTab === "topup" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-2">Nạp tiền vào tài khoản</h3>
            <div className="grid grid-cols-3 gap-3">
              {topupOptions.map((amount) => (
                <button key={amount} onClick={() => setTopupAmount(String(amount))} className={`py-3 rounded-lg font-bold text-[13px] md:text-[14px] transition-colors border ${topupAmount === String(amount) ? "bg-[rgb(202,138,4)] text-black border-[rgb(251,191,36)]" : "bg-[rgb(31,41,55)] text-white border-[rgb(75,85,99)] hover:border-[rgb(251,191,36)]"}`}>
                  {amount.toLocaleString("vi-VN")}đ
                </button>
              ))}
            </div>
            <input type="number" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} placeholder="Nhập số tiền (VNĐ)" className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] transition-colors" />
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-[14px] text-[rgba(238,238,238,0.7)]">Phương thức thanh toán</p>
              <label className="flex items-center gap-3 p-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg cursor-pointer hover:border-[rgb(251,191,36)]"><input type="radio" name="payment" defaultChecked className="accent-[rgb(251,191,36)]" /><span className="text-[14px]">Chuyển khoản ngân hàng</span></label>
              <label className="flex items-center gap-3 p-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg cursor-pointer hover:border-[rgb(251,191,36)]"><input type="radio" name="payment" className="accent-[rgb(251,191,36)]" /><span className="text-[14px]">Ví MoMo</span></label>
              <label className="flex items-center gap-3 p-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg cursor-pointer hover:border-[rgb(251,191,36)]"><input type="radio" name="payment" className="accent-[rgb(251,191,36)]" /><span className="text-[14px]">Thẻ cào điện thoại</span></label>
            </div>
            <button onClick={() => alert("Nạp tiền thành công! (Demo)")} className="mt-4 w-full py-3 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[16px] rounded-lg transition-colors">Nạp tiền</button>
          </div>
        )}

        {activeTab === "history" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-2">Lịch sử mua hàng</h3>
            {user.purchasedAccounts.length === 0 ? (
              <p className="text-center text-[rgba(238,238,238,0.5)] text-[14px] py-8">Bạn chưa mua tài khoản nào.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {user.purchasedAccounts.map((acc, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
                    <div>
                      <p className="text-white font-semibold text-[14px] md:text-[16px]">{acc.name}</p>
                      <p className="text-[rgba(238,238,238,0.5)] text-[12px]">{acc.date}</p>
                    </div>
                    <p className="text-[rgb(251,191,36)] font-bold text-[14px] md:text-[16px]">{acc.price.toLocaleString("vi-VN")}đ</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
