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
}

export function ProductDetail({ name, image, price, originalPrice, discount, petTim, sanTim, chuong, extraInfo }: ProductDetailProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-[14px] animate-fade-in-up">
      <article className="items-start md:items-center flex flex-col md:flex-row size-full relative bg-[rgb(2,6,23)] rounded-br-[1.25rem] border-[rgb(253,230,138)] rounded-tl-[1.25rem] border gap-[16px] md:gap-[24px] pt-12 md:pt-4 pr-4 pb-6 pl-4">
        <div className="font-medium absolute left-4 top-4 text-[rgb(251,191,36)] text-[20px] md:text-[24px] font-[family-name:var(--font-nunito)]">
          {name}
        </div>
        <figure className="relative w-full md:w-[50%] mt-[12px] aspect-[16/9]">
          <div className="items-center flex font-bold justify-center absolute w-[50px] md:w-[60px] h-[50px] md:h-[60px] top-0 right-0 text-white text-[18px] md:text-[22px] p-1 z-[2] animate-blink-badge font-[family-name:var(--font-nunito)]">
            <span className="block text-[rgb(254,239,199)]">-{discount}</span>
            <span className="block absolute left-0 top-0 right-0 bottom-0 z-[-1] before:absolute before:left-0 before:top-0 before:right-0 before:bottom-0 before:bg-[rgb(220,38,38)] before:content-[''] before:z-[-1] before:rounded-xs after:absolute after:left-0 after:top-0 after:right-0 after:bottom-0 after:bg-[rgb(220,38,38)] after:content-[''] after:rotate-45 after:z-[-1] after:rounded-xs animate-blink-badge"></span>
            <span className="block text-[rgb(254,239,199)] text-[14px]">%</span>
          </div>
          <img alt={name} src={image} className="block size-full object-cover absolute left-0 top-0 right-0 bottom-0 rounded-2xl" />
        </figure>
        <div className="flex flex-col grow text-center w-full md:w-[calc(50%-24px)] pt-4 pb-4">
          <button onClick={() => setShowQR(true)} className="items-center flex font-bold justify-center text-center mx-auto w-[180px] md:w-[200px] h-[50px] md:h-[60px] mt-[16px] border-[rgb(251,191,36)] border rounded-lg text-[rgb(251,191,36)] text-[16px] md:text-[18px] hover:bg-[rgb(251,191,36)] hover:text-black transition-colors cursor-pointer">
            MUA NGAY
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

      {/* Modal QR chuyển khoản */}
      {showQR && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-5 max-w-[340px] w-full animate-fade-in-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-[rgb(251,191,36)] text-[18px] font-bold text-center mb-3">Chuyển khoản</h3>
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
                <span className="text-white font-bold">Mua {name}</span>
              </div>
            </div>
            <p className="text-center text-[11px] text-[rgba(238,238,238,0.5)] mt-3">Sau khi CK, liên hệ Zalo: <span className="text-[rgb(251,191,36)] font-bold">0338180818</span></p>
            <button onClick={() => setShowQR(false)} className="mt-3 w-full py-2.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[14px] rounded-lg transition-colors">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
