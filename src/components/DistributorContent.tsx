"use client";

import { useState } from "react";

export function DistributorContent() {
  const [activeTab, setActiveTab] = useState<"revenue" | "buyers">("revenue");

  const soldAccounts = [
    { id: 1, name: "YoneThanKiem", buyer: "player01", price: 2499000, date: "15/05/2026" },
    { id: 2, name: "YasuoLongKiem", buyer: "gamer_pro", price: 2998000, date: "14/05/2026" },
    { id: 3, name: "ACC #400", buyer: "bomrau_fan", price: 2999000, date: "13/05/2026" },
    { id: 4, name: "LeeTieuLong", buyer: "tft_lover", price: 2998000, date: "12/05/2026" },
    { id: 5, name: "ACC #538", buyer: "gamer_pro", price: 2999000, date: "11/05/2026" },
  ];

  const totalRevenue = soldAccounts.reduce((sum, a) => sum + a.price, 0);

  const buyerMap = new Map<string, { count: number; totalSpent: number; lastDate: string }>();
  soldAccounts.forEach(acc => {
    const existing = buyerMap.get(acc.buyer);
    if (existing) { existing.count++; existing.totalSpent += acc.price; existing.lastDate = acc.date; }
    else { buyerMap.set(acc.buyer, { count: 1, totalSpent: acc.price, lastDate: acc.date }); }
  });
  const buyers = Array.from(buyerMap.entries()).map(([name, data]) => ({ name, ...data }));

  return (
    <div className="w-full max-w-[900px] mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[rgb(251,191,36)] text-[22px] md:text-[28px] font-bold">Nhà Phân Phối</h1>
          <p className="text-[rgba(238,238,238,0.5)] text-[13px] mt-1">Quản lý sản phẩm đã bán trên <span className="text-[rgb(59,130,246)] font-semibold">bomrautft.com</span></p>
        </div>
        <button className="px-3 py-2 bg-[rgb(220,38,38)] hover:bg-[rgb(185,28,28)] text-white font-bold text-[12px] md:text-[13px] rounded-lg transition-colors">Đăng xuất</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-3 md:p-5 text-center">
          <p className="text-[rgba(238,238,238,0.6)] text-[11px] md:text-[13px]">Tổng doanh thu</p>
          <p className="text-[rgb(251,191,36)] text-[16px] md:text-[22px] font-bold mt-1">{totalRevenue.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-3 md:p-5 text-center">
          <p className="text-[rgba(238,238,238,0.6)] text-[11px] md:text-[13px]">Đã bán</p>
          <p className="text-[rgb(34,197,94)] text-[16px] md:text-[22px] font-bold mt-1">{soldAccounts.length} acc</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl overflow-hidden">
        <button onClick={() => setActiveTab("revenue")} className={`flex-1 py-3 text-[13px] md:text-[15px] font-bold transition-colors ${activeTab === "revenue" ? "bg-[rgb(202,138,4)] text-black" : "text-[rgba(238,238,238,0.7)] hover:text-white"}`}>Doanh thu</button>
        <button onClick={() => setActiveTab("buyers")} className={`flex-1 py-3 text-[13px] md:text-[15px] font-bold transition-colors ${activeTab === "buyers" ? "bg-[rgb(202,138,4)] text-black" : "text-[rgba(238,238,238,0.7)] hover:text-white"}`}>Người mua hàng</button>
      </div>

      <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
        {activeTab === "revenue" && (
          <div>
            <h3 className="text-[rgb(251,191,36)] text-[16px] md:text-[20px] font-bold mb-4">Chi tiết doanh thu</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] md:text-[14px]">
                <thead><tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">#</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Sản phẩm</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Người mua</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Giá bán</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Ngày</th>
                </tr></thead>
                <tbody>
                  {soldAccounts.map(acc => (
                    <tr key={acc.id} className="border-b border-[rgb(55,65,81)]">
                      <td className="py-3 text-white">{acc.id}</td>
                      <td className="py-3 text-[rgb(251,191,36)] font-semibold">{acc.name}</td>
                      <td className="py-3 text-white">{acc.buyer}</td>
                      <td className="py-3 text-white">{acc.price.toLocaleString("vi-VN")}đ</td>
                      <td className="py-3 text-white hidden md:table-cell">{acc.date}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr className="border-t-2 border-[rgb(251,191,36)]">
                  <td colSpan={3} className="py-3 text-white font-bold text-right">Tổng:</td>
                  <td className="py-3 text-[rgb(251,191,36)] font-bold">{totalRevenue.toLocaleString("vi-VN")}đ</td>
                  <td className="hidden md:table-cell"></td>
                </tr></tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === "buyers" && (
          <div>
            <h3 className="text-[rgb(251,191,36)] text-[16px] md:text-[20px] font-bold mb-4">Danh sách người mua hàng</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] md:text-[14px]">
                <thead><tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">#</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Người mua</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Số acc</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Tổng chi tiêu</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Lần mua cuối</th>
                </tr></thead>
                <tbody>
                  {buyers.map((buyer, i) => (
                    <tr key={buyer.name} className="border-b border-[rgb(55,65,81)]">
                      <td className="py-3 text-white">{i + 1}</td>
                      <td className="py-3 text-[rgb(251,191,36)] font-semibold">{buyer.name}</td>
                      <td className="py-3 text-white font-bold">{buyer.count}</td>
                      <td className="py-3 text-white">{buyer.totalSpent.toLocaleString("vi-VN")}đ</td>
                      <td className="py-3 text-white hidden md:table-cell">{buyer.lastDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
