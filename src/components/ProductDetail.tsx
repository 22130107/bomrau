"use client";

import { useState } from "react";
import Link from "next/link";
import { buyAccountAction } from "@/app/actions/purchase";

interface ProductDetailProps {
  productId: number;
  currentUser: { id: number; username: string; balance: number } | null;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  petTim?: string;
  sanTim?: string;
  chuong?: string;
  extraInfo?: string;
  isOutOfStock?: boolean;
}

export function ProductDetail({
  productId,
  currentUser,
  name,
  image,
  price,
  originalPrice,
  discount,
  petTim,
  sanTim,
  chuong,
  extraInfo,
  isOutOfStock = false
}: ProductDetailProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"select" | "qr" | "zalo" | "buy-confirm" | "success">("select");
  
  // Trạng thái mua hàng
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [purchasedAccount, setPurchasedAccount] = useState<{ login_username?: string; login_password?: string } | null>(null);

  // Copy states
  const [copiedZalo, setCopiedZalo] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedBankInfo, setCopiedBankInfo] = useState({ stk: false, amount: false, content: false });

  const handleBuy = async () => {
    setBuying(true);
    setBuyError(null);
    try {
      const res = await buyAccountAction(productId);
      if (res.error) {
        setBuyError(res.error);
      } else if (res.success && res.account) {
        setPurchasedAccount(res.account);
        setModalMode("success");
      }
    } catch (err) {
      setBuyError("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setBuying(false);
    }
  };

  const copyToClipboard = (text: string, type: "zalo" | "user" | "pass" | "stk" | "amount" | "content") => {
    navigator.clipboard.writeText(text);
    if (type === "zalo") {
      setCopiedZalo(true);
      setTimeout(() => setCopiedZalo(false), 2000);
    } else if (type === "user") {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else if (type === "pass") {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    } else {
      setCopiedBankInfo(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopiedBankInfo(prev => ({ ...prev, [type]: false })), 2000);
    }
  };

  return (
    <>
      <div className="w-full max-w-[1200px] mx-auto px-[14px] animate-fade-in-up">
        <div className="md:clip-diagonal md:bg-[rgb(253,230,138)] md:p-[1px] md:h-full">
          <article className="items-start flex flex-col md:flex-row size-full relative bg-[rgb(2,6,23)] rounded-2xl md:rounded-none md:clip-diagonal gap-[16px] md:gap-[24px] pt-4 md:pt-16 pr-4 pb-6 pl-4 border border-[rgb(253,230,138)] md:border-none">
            <div className="font-medium text-[rgb(251,191,36)] text-[20px] md:text-[24px] font-[family-name:var(--font-nunito)] w-full md:absolute md:left-4 md:top-4 md:w-auto z-10 mb-2 md:mb-0">
              {name}
            </div>
            <figure className="relative w-full md:w-[50%] mt-2 md:mt-[12px]">
              <div className="items-center flex font-bold justify-center absolute w-[50px] md:w-[60px] h-[50px] md:h-[60px] top-0 right-0 text-white text-[18px] md:text-[22px] p-1 z-[2] animate-blink-badge font-[family-name:var(--font-nunito)]">
                <span className="block text-[rgb(254,239,199)]">-{discount}</span>
                <span className="block absolute left-0 top-0 right-0 bottom-0 z-[-1] before:absolute before:left-0 before:top-0 before:right-0 before:bottom-0 before:bg-[rgb(220,38,38)] before:content-[''] before:z-[-1] before:rounded-xs after:absolute after:left-0 after:top-0 after:right-0 after:bottom-0 after:bg-[rgb(220,38,38)] after:content-[''] after:rotate-45 after:z-[-1] after:rounded-xs animate-blink-badge"></span>
                <span className="block text-[rgb(254,239,199)] text-[14px]">%</span>
              </div>
              <img alt={name} src={image} className="block w-full h-auto rounded-2xl object-contain" />
            </figure>
            <div className="flex flex-col grow text-center w-full md:w-[calc(50%-24px)] pt-4 pb-4">
              <button 
                disabled={isOutOfStock}
                onClick={() => {
                  if (!isOutOfStock) {
                    setModalMode("select");
                    setBuyError(null);
                    setShowModal(true);
                  }
                }} 
                className={`items-center flex font-bold justify-center text-center mx-auto w-[180px] md:w-[200px] h-[50px] md:h-[60px] mt-[16px] border-[rgb(251,191,36)] border rounded-lg text-[16px] md:text-[18px] transition-colors ${
                  isOutOfStock 
                    ? 'bg-[rgb(107,114,128)] text-[rgb(75,85,99)] border-[rgb(75,85,99)] cursor-not-allowed'
                    : 'text-[rgb(251,191,36)] hover:bg-[rgb(251,191,36)] hover:text-black cursor-pointer'
                }`}
              >
                {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
              </button>
              <div className="text-center mt-[12px] pt-3 border-t border-dashed border-t-[rgba(251,191,36,0.4)]">
                <span className="font-bold text-[rgb(251,191,36)] text-[18px] md:text-[20px] pr-2 font-[family-name:var(--font-nunito)]">
                  {price.toLocaleString("vi-VN")}&nbsp;₫
                </span>
                <span className="font-medium line-through text-[rgba(238,238,238,0.6)] text-[13px] md:text-[14px] font-[family-name:var(--font-nunito)]">
                  {originalPrice.toLocaleString("vi-VN")}&nbsp;₫
                </span>
              </div>
              <div className="flex flex-col text-center mt-[24px] bg-[rgba(254,240,138,0.1)] rounded-br-sm rounded-tr-sm gap-[32px] min-h-[94px] pt-7 pr-3 pb-3 pl-3 border-l-2 border-l-[rgb(251,191,36)]">
                {petTim !== undefined && (
                  <dl className="border-dashed flex flex-col justify-center relative text-left w-full bg-[rgba(254,240,138,0.1)] border-[rgba(254,240,138,0.2)] border p-2 rounded-lg">
                    <dt className="absolute text-left left-0 top-[-24px] text-[rgba(238,238,238,0.6)] text-[13px]">Pet tím</dt>
                    <dd className="font-medium text-left text-[rgb(251,191,36)] text-[16px] md:text-[18px]">{petTim}</dd>
                  </dl>
                )}
                {sanTim !== undefined && (
                  <dl className="border-dashed flex flex-col justify-center relative text-left w-full bg-[rgba(254,240,138,0.1)] border-[rgba(254,240,138,0.2)] border p-2 rounded-lg">
                    <dt className="absolute text-left left-0 top-[-24px] text-[rgba(238,238,238,0.6)] text-[13px]">Sàn tím</dt>
                    <dd className="font-medium text-left text-[rgb(251,191,36)] text-[16px] md:text-[18px]">{sanTim}</dd>
                  </dl>
                )}
                {chuong !== undefined && (
                  <dl className="border-dashed flex flex-col justify-center relative text-left w-full bg-[rgba(254,240,138,0.1)] border-[rgba(254,240,138,0.2)] border p-2 rounded-lg">
                    <dt className="absolute text-left left-0 top-[-24px] text-[rgba(238,238,238,0.6)] text-[13px]">Chưởng</dt>
                    <dd className="font-medium text-left text-[rgb(251,191,36)] text-[16px] md:text-[18px]">{chuong}</dd>
                  </dl>
                )}
                {extraInfo !== undefined && (
                  <dl className="border-dashed flex flex-col justify-center relative text-left w-full bg-[rgba(254,240,138,0.1)] border-[rgba(254,240,138,0.2)] border p-2 rounded-lg">
                    <dt className="absolute text-left left-0 top-[-24px] text-[rgba(238,238,238,0.6)] text-[13px]">Thông tin thêm</dt>
                    <dd className="font-medium text-left text-[rgb(251,191,36)] text-[16px] md:text-[18px]">{extraInfo}</dd>
                  </dl>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Modal Mua Hàng */}
      {showModal && modalMode === "zalo" ? (
        <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60" onClick={() => setShowModal(false)}>
          <div className="bg-[#0f172a] border-l border-[rgba(255,255,255,0.1)] w-full max-w-[360px] h-full p-6 overflow-y-auto no-scrollbar animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-white rounded-xl p-2 mb-6 flex items-center justify-center">
              <img src="/zaloqr.png" alt="Zalo QR" className="w-full aspect-square object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300?text=Zalo+QR'} />
            </div>
            <a href="https://zalo.me/0338180818" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 mb-6 bg-transparent border border-[rgb(75,85,99)] rounded-lg text-white text-[15px] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              Zalo: 0338180818
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/></svg>
            </a>
            <div className="bg-[#1e293b] border border-[rgb(75,85,99)] rounded-lg p-4 mb-4 font-[family-name:var(--font-nunito)]">
              <p className="text-gray-200 text-[14px] leading-relaxed">
                Mã Acc: {name}<br/>
                --------<br/>
                Giá: {price.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <button 
              onClick={() => copyToClipboard(`Mã Acc: ${name}\n--------\nGiá: ${price.toLocaleString("vi-VN")}đ`, "zalo")}
              className="w-fit px-4 flex items-center gap-2 py-2 mb-8 bg-transparent border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
            >
              {copiedZalo ? "Đã sao chép!" : "Sao chép nội dung"}
              {!copiedZalo && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>}
            </button>
            <div className="mt-auto text-center pt-8">
              <button onClick={() => setShowModal(false)} className="px-10 py-2 bg-transparent border border-[rgb(75,85,99)] hover:bg-[rgba(255,255,255,0.05)] text-white text-[14px] rounded-lg transition-colors cursor-pointer">
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-5 max-w-[380px] w-full animate-fade-in-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            
            {/* MODE: SELECT */}
            {modalMode === "select" && (
              <>
                <h3 className="text-[rgb(251,191,36)] text-[20px] font-bold text-center mb-5">Thanh Toán</h3>
                
                {!currentUser ? (
                  <div className="text-center py-4 flex flex-col gap-4">
                    <p className="text-[rgba(238,238,238,0.7)] text-[14px]">Bạn cần đăng nhập để mua tài khoản này trực tuyến và nhận thông tin tài khoản ngay lập tức.</p>
                    <Link
                      href="/login"
                      className="w-full py-3 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[16px] rounded-lg text-center transition-colors"
                    >
                      🔑 Đăng nhập ngay
                    </Link>
                    <div className="border-t border-[rgb(75,85,99)] pt-3 mt-1">
                      <button 
                        onClick={() => setModalMode("zalo")}
                        className="w-full py-2.5 bg-transparent border border-[#0068FF] text-[#0068FF] hover:bg-[rgba(0,104,255,0.1)] font-semibold text-[14px] rounded-lg transition-colors"
                      >
                        💬 Mua thủ công qua Zalo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="bg-[rgb(15,23,42)] p-3.5 rounded-xl border border-[rgb(75,85,99)] flex justify-between items-center font-[family-name:var(--font-nunito)]">
                      <span className="text-[rgba(238,238,238,0.6)] text-[13px]">Số dư tài khoản:</span>
                      <span className="text-[rgb(251,191,36)] font-bold text-[18px]">{currentUser.balance.toLocaleString("vi-VN")}đ</span>
                    </div>

                    {currentUser.balance >= price ? (
                      <button 
                        onClick={() => {
                          setBuyError(null);
                          setModalMode("buy-confirm");
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[16px] rounded-lg transition-colors cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                      >
                        ⚡ Mua Bằng Số Dư (Nhận Acc Ngay)
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] p-3 rounded-lg text-center">
                          <p className="text-[rgb(248,113,113)] text-[13px]">Số dư không đủ! Thiếu {(price - currentUser.balance).toLocaleString("vi-VN")}đ</p>
                        </div>
                        <button 
                          onClick={() => setModalMode("qr")}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-[rgb(124,58,237)] hover:bg-[rgb(139,92,246)] text-white font-bold text-[15px] rounded-lg transition-colors cursor-pointer"
                        >
                          🏦 Chuyển Khoản Nạp Động (SePay)
                        </button>
                        <Link
                          href="/profile"
                          className="w-full py-2.5 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-gray-200 font-medium text-[13px] rounded-lg text-center transition-colors"
                        >
                          💳 Đến Trang Nạp Tiền
                        </Link>
                      </div>
                    )}

                    <div className="border-t border-[rgb(75,85,99)] pt-3 mt-1">
                      <button 
                        onClick={() => setModalMode("zalo")}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[rgb(31,41,55)] hover:bg-[rgb(55,65,81)] border border-gray-700 text-white font-medium text-[14px] rounded-lg transition-colors cursor-pointer"
                      >
                        💬 Liên hệ Zalo: 0338180818
                      </button>
                    </div>
                  </div>
                )}
                
                <button onClick={() => setShowModal(false)} className="mt-4 w-full py-2 bg-transparent text-gray-500 hover:text-gray-400 text-[13px] font-medium transition-colors cursor-pointer">
                  Hủy bỏ
                </button>
              </>
            )}

            {/* MODE: BUY CONFIRM */}
            {modalMode === "buy-confirm" && currentUser && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setModalMode("select")} className="text-gray-400 hover:text-white text-[22px] leading-none px-2 py-1 cursor-pointer">
                    ←
                  </button>
                  <h3 className="text-[rgb(251,191,36)] text-[18px] font-bold">Xác Nhận Mua</h3>
                  <div className="w-[30px]"></div>
                </div>

                <div className="flex flex-col gap-3 py-2 font-[family-name:var(--font-nunito)]">
                  <p className="text-gray-300 text-[14px] font-sans">Bạn có chắc chắn muốn mua nick game này?</p>
                  
                  <div className="bg-[rgb(15,23,42)] p-4 rounded-xl border border-[rgb(75,85,99)] flex flex-col gap-2.5">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-gray-400">Tên Acc:</span>
                      <span className="text-white font-bold font-sans">{name}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-gray-400">Giá bán:</span>
                      <span className="text-[rgb(251,191,36)] font-bold">{price.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="border-t border-gray-800 my-1"></div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-gray-400">Số dư hiện tại:</span>
                      <span className="text-white font-semibold">{currentUser.balance.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-gray-400">Số dư còn lại:</span>
                      <span className="text-[rgb(34,197,94)] font-bold">{(currentUser.balance - price).toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  {buyError && (
                    <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] p-3 rounded-lg text-center mt-2">
                      <p className="text-[rgb(248,113,113)] text-[12px] font-sans">{buyError}</p>
                    </div>
                  )}

                  <button 
                    onClick={handleBuy}
                    disabled={buying}
                    className="mt-3 w-full py-3 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] disabled:bg-[rgb(107,114,128)] disabled:cursor-not-allowed text-black font-bold text-[16px] rounded-lg transition-colors cursor-pointer"
                  >
                    {buying ? "Đang xử lý giao dịch..." : "✔️ XÁC NHẬN THANH TOÁN"}
                  </button>
                </div>
              </>
            )}

            {/* MODE: SUCCESS */}
            {modalMode === "success" && purchasedAccount && (
              <>
                <div className="text-center py-2 flex flex-col items-center">
                  <div className="w-[60px] h-[60px] bg-[rgba(34,197,94,0.1)] border-2 border-[rgb(34,197,94)] rounded-full flex items-center justify-center text-[30px] text-[rgb(34,197,94)] mb-4 animate-bounce">
                    ✓
                  </div>
                  <h3 className="text-[rgb(34,197,94)] text-[20px] font-bold mb-1">MUA HÀNG THÀNH CÔNG!</h3>
                  <p className="text-gray-400 text-[12px] mb-5 font-sans">Vui lòng lưu lại thông tin tài khoản game của bạn bên dưới</p>

                  <div className="w-full bg-[rgb(15,23,42)] p-4 rounded-xl border border-[rgb(253,230,138)] flex flex-col gap-3 font-sans text-[14px]">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-gray-400 text-[12px]">Tài khoản đăng nhập:</span>
                      <div className="flex justify-between items-center bg-[rgb(31,41,55)] px-3 py-2.5 rounded-lg border border-gray-700">
                        <span className="text-white font-mono font-bold select-all">{purchasedAccount.login_username}</span>
                        <button 
                          onClick={() => copyToClipboard(purchasedAccount.login_username || "", "user")}
                          className="text-[rgb(251,191,36)] hover:text-white text-[12px] cursor-pointer"
                        >
                          {copiedUser ? "Đã chép!" : "Sao chép"}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-gray-400 text-[12px]">Mật khẩu:</span>
                      <div className="flex justify-between items-center bg-[rgb(31,41,55)] px-3 py-2.5 rounded-lg border border-gray-700">
                        <span className="text-white font-mono font-bold select-all">{purchasedAccount.login_password}</span>
                        <button 
                          onClick={() => copyToClipboard(purchasedAccount.login_password || "", "pass")}
                          className="text-[rgb(251,191,36)] hover:text-white text-[12px] cursor-pointer"
                        >
                          {copiedPass ? "Đã chép!" : "Sao chép"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[rgba(251,191,36,0.05)] border border-[rgba(251,191,36,0.2)] p-3 rounded-lg mt-4 text-left">
                    <p className="text-[rgb(253,230,138)] text-[11px] leading-relaxed font-sans">
                      💡 <strong>Lưu ý:</strong> Bạn có thể vào mục <strong>Lịch sử mua hàng</strong> trên trang cá nhân để xem lại thông tin đăng nhập này bất cứ lúc nào.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setShowModal(false);
                      // Tải lại trang để cập nhật trạng thái kho acc và số dư
                      window.location.reload();
                    }}
                    className="mt-6 w-full py-3 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[15px] rounded-lg transition-colors cursor-pointer"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </>
            )}

            {/* MODE: QUICK QR FOR SEPAY */}
            {modalMode === "qr" && currentUser && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => setModalMode("select")} className="text-gray-400 hover:text-white text-[22px] leading-none px-2 py-1 cursor-pointer">
                    ←
                  </button>
                  <h3 className="text-[rgb(251,191,36)] text-[16px] md:text-[18px] font-bold">Nạp Tiền Nhanh</h3>
                  <div className="w-[30px]"></div>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-center text-[12px] text-gray-300 mb-3 font-sans">
                    Nạp nhanh số tiền còn thiếu để tự động mua tài khoản.
                  </p>

                  <div className="bg-white rounded-xl p-2.5 mb-3 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <img
                      src={`https://img.vietqr.io/image/MB-0338180818-compact.png?amount=${price - currentUser.balance}&addInfo=BOMRAU%20NAP%20${currentUser.id}`}
                      alt="VietQR SePay"
                      className="w-[180px] h-[180px] object-contain"
                    />
                  </div>

                  <div className="w-full flex flex-col gap-1.5 text-[13px] font-[family-name:var(--font-nunito)]">
                    <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99)]">
                      <span className="text-[rgba(238,238,238,0.7)] text-[12px] font-sans">Ngân hàng:</span>
                      <span className="text-white font-bold">MB Bank (Quân Đội)</span>
                    </div>
                    
                    <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99)]">
                      <span className="text-[rgba(238,238,238,0.7)] text-[12px] font-sans">Số tài khoản:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold">0338180818</span>
                        <button 
                          onClick={() => copyToClipboard("0338180818", "stk")}
                          className="text-[rgb(251,191,36)] text-[11px] font-sans cursor-pointer hover:underline"
                        >
                          {copiedBankInfo.stk ? "Đã chép" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99)]">
                      <span className="text-[rgba(238,238,238,0.7)] text-[12px] font-sans">Số tiền cần nạp:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[rgb(251,191,36)] font-bold">{(price - currentUser.balance).toLocaleString("vi-VN")}đ</span>
                        <button 
                          onClick={() => copyToClipboard(String(price - currentUser.balance), "amount")}
                          className="text-[rgb(251,191,36)] text-[11px] font-sans cursor-pointer hover:underline"
                        >
                          {copiedBankInfo.amount ? "Đã chép" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between py-1.5">
                      <span className="text-[rgba(238,238,238,0.7)] text-[12px] font-sans">Nội dung CK bắt buộc:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-extrabold bg-[rgba(251,191,36,0.15)] px-1.5 py-0.5 rounded text-[14px]">BOMRAU NAP {currentUser.id}</span>
                        <button 
                          onClick={() => copyToClipboard(`BOMRAU NAP ${currentUser.id}`, "content")}
                          className="text-[rgb(251,191,36)] text-[11px] font-sans cursor-pointer hover:underline"
                        >
                          {copiedBankInfo.content ? "Đã chép" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)] p-2.5 rounded-lg mt-3 text-left w-full">
                    <p className="text-[rgb(74,222,128)] text-[11px] leading-relaxed font-sans">
                      ⚠️ <strong>Lưu ý quan trọng:</strong> Bạn phải điền chính xác nội dung chuyển khoản <strong>BOMRAU NAP {currentUser.id}</strong> để hệ thống tự động nhận dạng giao dịch và cộng tiền sau 1 phút. Khi được cộng tiền, bạn chỉ cần bấm "Thanh toán bằng số dư" để lấy tài khoản ngay!
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setShowModal(false);
                      window.location.reload();
                    }} 
                    className="mt-4 w-full py-2.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[14px] rounded-lg transition-colors cursor-pointer"
                  >
                    Tôi đã chuyển khoản (Đóng & Reload)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
