"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getNppDataAction, SoldAccount, BuyerInfo } from "@/app/actions/npp";
import { logoutAction } from "@/app/actions/auth";

export function DistributorContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"revenue" | "buyers">("revenue");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distributorName, setDistributorName] = useState("");
  const [domain, setDomain] = useState("");
  const [soldAccounts, setSoldAccounts] = useState<SoldAccount[]>([]);
  const [buyers, setBuyers] = useState<BuyerInfo[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getNppDataAction();
        if (res.error) {
          setError(res.error);
        } else {
          setDistributorName(res.distributorName || "");
          setDomain(res.domain || "");
          setSoldAccounts(res.soldAccounts || []);
          setBuyers(res.buyers || []);
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRevenue = soldAccounts.reduce((sum, a) => sum + a.price, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full animate-fade-in-up">
        <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border-4 border-[rgb(251,191,36)]/20"></span>
          <span className="absolute inset-0 rounded-full border-4 border-t-[rgb(251,191,36)] animate-spin"></span>
        </div>
        <p className="text-gray-400 font-sans text-[14px]">Đang tải dữ liệu nhà phân phối...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[600px] mx-auto text-center bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] rounded-2xl p-8 animate-fade-in-up">
        <p className="text-[rgb(248,113,113)] font-bold text-[18px] mb-4">Đã xảy ra lỗi</p>
        <p className="text-gray-300 font-sans text-[14px] mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold rounded-lg transition-colors cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px] mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[rgb(251,191,36)] text-[22px] md:text-[28px] font-bold">{distributorName || "Nhà Phân Phối"}</h1>
          <p className="text-[rgba(238,238,238,0.5)] text-[13px] mt-1">
            Quản lý sản phẩm đã bán trên tên miền: <span className="text-[rgb(59,130,246)] font-semibold">{domain}</span>
          </p>
        </div>
        <button 
          onClick={() => startTransition(async () => { await logoutAction(); router.push("/login"); })}
          disabled={isPending}
          className="px-4 py-2 bg-[rgb(220,38,38)] hover:bg-[rgb(185,28,28)] disabled:opacity-60 text-white font-bold text-[12px] md:text-[13px] rounded-lg transition-colors cursor-pointer"
        >
          {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
        </button>
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
            {soldAccounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-sans text-[13px]">
                Chưa có tài khoản nào được bán qua tên miền của bạn.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] md:text-[14px]">
                  <thead><tr className="border-b border-[rgb(75,85,99)]">
                    <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Mã đơn</th>
                    <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Sản phẩm</th>
                    <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Người mua</th>
                    <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Giá bán</th>
                    <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Ngày mua</th>
                  </tr></thead>
                  <tbody>
                    {soldAccounts.map(acc => (
                      <tr key={acc.id} className="border-b border-[rgb(55,65,81)]">
                        <td className="py-3 text-white">#{acc.id}</td>
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
            )}
          </div>
        )}

        {activeTab === "buyers" && (
          <div>
            <h3 className="text-[rgb(251,191,36)] text-[16px] md:text-[20px] font-bold mb-4">Danh sách người mua hàng</h3>
            {buyers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-sans text-[13px]">
                Chưa có khách mua hàng nào qua tên miền của bạn.
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
