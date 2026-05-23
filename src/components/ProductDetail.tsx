"use client";

import { useState } from "react";

interface ProductDetailProps {
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

export function ProductDetail({ name, image, price, originalPrice, discount, petTim, sanTim, chuong, extraInfo, isOutOfStock = false }: ProductDetailProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"select" | "qr" | "zalo">("select");
  const [copied, setCopied] = useState(false);

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

            <div className="bg-[#1e293b] border border-[rgb(75,85,99)] rounded-lg p-4 mb-4">
              <p className="text-gray-200 text-[14px] font-sans leading-relaxed">
                Mã Acc: {name}<br/>
                --------<br/>
                Giá: {price.toLocaleString("vi-VN")}
              </p>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(`Mã Acc: ${name}\n--------\nGiá: ${price.toLocaleString("vi-VN")}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-fit px-4 flex items-center gap-2 py-2 mb-8 bg-transparent border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              {copied ? "Đã sao chép!" : "Sao chép nội dung"}
              {!copied && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>}
            </button>

            <div className="mt-8 text-center">
              <button onClick={() => setShowModal(false)} className="px-10 py-2 bg-transparent border border-[rgb(75,85,99)] hover:bg-[rgba(255,255,255,0.05)] text-white text-[14px] rounded-lg transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-5 max-w-[340px] w-full animate-fade-in-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {modalMode === "select" ? (
              <>
                <h3 className="text-[rgb(251,191,36)] text-[20px] font-bold text-center mb-5">Chọn Hình Thức Mua</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setModalMode("qr")}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[16px] rounded-lg transition-colors"
                  >
                    🏦 Thanh Toán Online (QR)
                  </button>
                  <button 
                    onClick={() => setModalMode("zalo")}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#0068FF] hover:bg-[#0054cc] text-white font-bold text-[16px] rounded-lg transition-colors"
                  >
                    💬 Nhắn tin Zalo để mua
                  </button>
                </div>
                <button onClick={() => setShowModal(false)} className="mt-5 w-full py-2 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-gray-200 font-medium text-[14px] rounded-lg transition-colors">
                  Huỷ bỏ
                </button>
              </>
            ) : modalMode === "qr" ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setModalMode("select")} className="text-gray-400 hover:text-white text-[24px] leading-none px-2 py-1">
                    ←
                  </button>
                  <h3 className="text-[rgb(251,191,36)] text-[18px] font-bold">Chuyển khoản</h3>
                  <div className="w-[30px]"></div>
                </div>
                <div className="bg-white rounded-xl p-2 mb-3 flex items-center justify-center">
                  <img
                    src={`https://img.vietqr.io/image/MB-0338180818-compact.png?amount=${price}&addInfo=Mua%20${encodeURIComponent(name)}`}
                    alt="QR Chuyển khoản"
                    className="w-[200px]"
                  />
                </div>
                <div className="flex flex-col gap-1 text-[13px]">
                  <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99)]">
                    <span className="text-[rgba(238,238,238,0.7)]">Ngân hàng</span>
                    <span className="text-white font-bold">MB Bank</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99)]">
                    <span className="text-[rgba(238,238,238,0.7)]">STK</span>
                    <span className="text-white font-bold">0338180818</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99)]">
                    <span className="text-[rgba(238,238,238,0.7)]">Số tiền</span>
                    <span className="text-[rgb(251,191,36)] font-bold">{price.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[rgba(238,238,238,0.7)]">Nội dung</span>
                    <span className="text-white font-bold truncate max-w-[150px] text-right" title={`Mua ${name}`}>Mua {name}</span>
                  </div>
                </div>
                <p className="text-center text-[11px] text-[rgba(238,238,238,0.5)] mt-3">Sau khi CK, liên hệ Zalo: <span className="text-[rgb(251,191,36)] font-bold">0338180818</span></p>
                <button onClick={() => setShowModal(false)} className="mt-3 w-full py-2.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[14px] rounded-lg transition-colors">
                  Đóng
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
